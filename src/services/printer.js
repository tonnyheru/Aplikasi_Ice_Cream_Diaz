// Diaz Ice Cream POS - Thermal Printer & Receipt Service
export class PrinterService {
  constructor() {
    this.bluetoothDevice = null;
    this.characteristic = null;
  }

  // Format currency
  formatRupiah(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  // Generate clean text version for WhatsApp / SMS / Raw printing
  generateTextReceipt(order, settings) {
    const store = settings?.store || {
      name: 'Diaz Ice Cream',
      address: 'Jl. Merdeka No. 45, Jakarta Pusat',
      phone: '0812-3456-7890',
      tagline: 'Kelezatan Dingin Penuh Kebahagiaan'
    };

    let text = `================================\n`;
    text += `       ${store.name.toUpperCase()}\n`;
    text += `   ${store.tagline}\n`;
    text += `  ${store.address}\n`;
    text += `     Telp: ${store.phone}\n`;
    text += `================================\n`;
    text += `No. Transaksi : ${order.id}\n`;
    text += `Waktu         : ${new Date(order.createdAt).toLocaleString('id-ID')}\n`;
    text += `Kasir         : ${order.cashierName || 'Kasir'}\n`;
    text += `Tipe          : ${order.orderType || 'Dine In'}${order.tableNo ? ' (Meja: ' + order.tableNo + ')' : ''}\n`;
    if (order.customerName) {
      text += `Pelanggan     : ${order.customerName}\n`;
    }
    text += `--------------------------------\n`;

    (order.items || []).forEach(item => {
      text += `${item.name} (${item.size || 'Regular'})\n`;
      if (item.variants && item.variants.length) {
        text += `  Rasa: ${item.variants.join(', ')}\n`;
      }
      if (item.toppings && item.toppings.length) {
        text += `  Topping: ${item.toppings.map(t => t.name || t).join(', ')}\n`;
      }
      const qtyStr = `${item.qty} x ${this.formatRupiah(item.price)}`;
      const subStr = this.formatRupiah(item.qty * item.price);
      text += `  ${qtyStr.padEnd(16)} ${subStr.padStart(13)}\n`;
    });

    text += `--------------------------------\n`;
    text += `Subtotal      : ${this.formatRupiah(order.subtotal).padStart(16)}\n`;
    if (order.discount > 0) {
      text += `Diskon (${order.discountLabel || 'Promo'}) : -${this.formatRupiah(order.discount).padStart(13)}\n`;
    }
    if (order.tax > 0) {
      text += `Pajak (${order.taxRate || 10}%)   : ${this.formatRupiah(order.tax).padStart(16)}\n`;
    }
    text += `================================\n`;
    text += `TOTAL AKHIR   : ${this.formatRupiah(order.total).padStart(16)}\n`;
    text += `Metode Bayar  : ${(order.paymentMethod || 'CASH').toUpperCase()}\n`;
    text += `Bayar Tunai   : ${this.formatRupiah(order.cashTendered || order.total).padStart(16)}\n`;
    text += `Kembalian     : ${this.formatRupiah(order.change || 0).padStart(16)}\n`;
    text += `================================\n`;
    text += `  Terima Kasih Telah Berkunjung!\n`;
    text += `     Follow IG: @diazicecream\n`;
    text += `       Simpan struk ini sebagai\n`;
    text += `         bukti pembayaran sah\n`;
    text += `================================\n\n`;

    return text;
  }

  // Connect to Bluetooth Thermal Printer (Web Bluetooth API)
  async connectBluetooth() {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth tidak didukung pada browser ini. Gunakan Google Chrome pada Android/Desktop.');
    }

    try {
      this.bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Common printer service UUID
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455'
        ]
      });

      const server = await this.bluetoothDevice.gatt.connect();
      // Look for write characteristic
      const services = await server.getPrimaryServices();
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            this.characteristic = char;
            return {
              success: true,
              deviceName: this.bluetoothDevice.name || 'Printer Bluetooth'
            };
          }
        }
      }
      return { success: true, deviceName: this.bluetoothDevice.name || 'Printer Bluetooth' };
    } catch (err) {
      console.warn('Bluetooth connection cancelled or failed', err);
      throw err;
    }
  }

  // Generate ESC/POS byte sequence
  encodeEscPos(order, settings) {
    const encoder = new TextEncoder();
    const rawText = this.generateTextReceipt(order, settings);
    
    // ESC @ (Initialize), ESC a 1 (Center align), text, GS V 66 0 (Paper cut)
    const initCmd = new Uint8Array([0x1B, 0x40]);
    const cutCmd = new Uint8Array([0x1D, 0x56, 0x41, 0x10, 0x0A, 0x0A]);
    const bodyBytes = encoder.encode(rawText);

    const fullBuffer = new Uint8Array(initCmd.length + bodyBytes.length + cutCmd.length);
    fullBuffer.set(initCmd, 0);
    fullBuffer.set(bodyBytes, initCmd.length);
    fullBuffer.set(cutCmd, initCmd.length + bodyBytes.length);

    return fullBuffer;
  }

  // Print via Web Bluetooth if connected
  async printViaBluetooth(order, settings) {
    if (!this.characteristic) {
      await this.connectBluetooth();
    }
    if (this.characteristic) {
      const bytes = this.encodeEscPos(order, settings);
      // Chunk sending to prevent BLE buffer overflow
      const chunkSize = 100;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        await this.characteristic.writeValue(chunk);
      }
      return true;
    }
    return false;
  }

  // Share receipt via Web Share API or WhatsApp clipboard
  async shareReceipt(order, settings) {
    const text = this.generateTextReceipt(order, settings);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Struk Diaz Ice Cream #${order.id}`,
          text: text
        });
        return { shared: true, method: 'web-share' };
      } catch (e) {
        // Fallback to clipboard if user dismissed share dialog
        console.log('Share dismissed or failed, fallback to copy', e);
      }
    }
    
    // Fallback: Copy to clipboard and open WhatsApp
    await navigator.clipboard.writeText(text);
    return { shared: true, method: 'clipboard' };
  }
}

export const printer = new PrinterService();
