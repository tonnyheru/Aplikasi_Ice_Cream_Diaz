// Diaz Ice Cream POS - Dynamic QRIS Payment Service
import QRCode from 'qrcode';

export class QrisService {
  constructor() {
    this.merchantName = 'DIAZ ICE CREAM';
    this.merchantCity = 'JAKARTA';
    this.nmid = 'ID1020349812480';
    this.postalCode = '12340';
  }

  // Format dynamic QRIS string according to EMVCo / ASPI QRIS standard
  generatePayload(amount, orderId) {
    const formattedAmount = Math.round(amount).toString();
    const cleanOrderId = orderId.replace(/[^A-Za-z0-9]/g, '').slice(-12);

    // Standard Indonesian QRIS TLV (Type-Length-Value) payload
    // Payload Format Indicator (00), Point of Initiation Method (01: 12 dynamic)
    let payload = "000201010212";
    
    // Merchant Account Information (26): ID.CO.QRIS.WWW + NMID
    const maiSub26 = `0014ID.CO.QRIS.WWW0115${this.nmid}0215ID1020349812480`;
    payload += `26${maiSub26.length.toString().padStart(2, '0')}${maiSub26}`;
    
    // Merchant Category Code (52: 5814 Fast Food/Ice Cream)
    payload += "52045814";
    // Transaction Currency (53: 360 IDR)
    payload += "5303360";
    // Transaction Amount (54)
    payload += `54${formattedAmount.length.toString().padStart(2, '0')}${formattedAmount}`;
    // Tip or Convenience Indicator (55: 02)
    payload += "5802ID";
    // Merchant Name (59)
    payload += `59${this.merchantName.length.toString().padStart(2, '0')}${this.merchantName}`;
    // Merchant City (60)
    payload += `60${this.merchantCity.length.toString().padStart(2, '0')}${this.merchantCity}`;
    // Postal Code (61)
    payload += `61${this.postalCode.length.toString().padStart(2, '0')}${this.postalCode}`;
    // Additional Data Field Template (62) - Reference label / Invoice
    const sub62 = `01${cleanOrderId.length.toString().padStart(2, '0')}${cleanOrderId}`;
    payload += `62${sub62.length.toString().padStart(2, '0')}${sub62}`;
    
    // CRC placeholder
    payload += "6304";
    const crc = this.calculateCRC16(payload);
    return payload + crc;
  }

  calculateCRC16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  // Render QR Code directly into canvas element
  async renderToCanvas(canvasElement, amount, orderId) {
    const payload = this.generatePayload(amount, orderId);
    await QRCode.toCanvas(canvasElement, payload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return payload;
  }
}

export const qris = new QrisService();
