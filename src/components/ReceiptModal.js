// Diaz Ice Cream POS - Thermal Receipt Modal Component
export function renderReceiptModal(order, settings) {
  if (!order) return '';

  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  const store = settings?.store || {
    name: 'Diaz Ice Cream',
    tagline: 'Sensasi Kelezatan Es Krim Segar',
    address: 'Jl. Senopati No. 88, Jakarta Selatan',
    phone: '0812-9876-5432',
    instagram: '@diazicecream.jkt',
    footerMessage: 'Terima kasih atas kunjungan Anda!'
  };

  return `
    <div class="bottom-sheet" id="receipt-sheet-content" style="max-height: 94vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Struk Pembayaran Berhasil 🎉</h3>
          <span style="font-size: 11px; color: #059669; font-weight: 700;">Transaksi Selesai & Stok Berkurang</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-receipt">&times;</button>
      </div>

      <div class="sheet-body" style="background: #F1F5F9; padding: 16px 12px; display: flex; flex-direction: column; align-items: center;">
        
        <!-- Thermal Receipt Paper Preview -->
        <div class="receipt-paper" id="thermal-receipt-printable">
          <div class="r-center">
            <div style="font-size: 18px; font-weight: 900; margin-bottom: 2px;">🍦 ${store.name.toUpperCase()}</div>
            <div style="font-size: 10px; margin-bottom: 2px;">${store.tagline}</div>
            <div style="font-size: 10px;">${store.address}</div>
            <div style="font-size: 10px;">Telp: ${store.phone}</div>
          </div>

          <div class="r-divider"></div>

          <div>
            <div class="r-row">
              <span>No. Transaksi:</span>
              <span class="r-bold">${order.id}</span>
            </div>
            <div class="r-row">
              <span>Waktu:</span>
              <span>${new Date(order.createdAt).toLocaleDateString('id-ID')} ${new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="r-row">
              <span>Kasir:</span>
              <span>${order.cashierName || 'Siti Rahma'}</span>
            </div>
            <div class="r-row">
              <span>Tipe:</span>
              <span>${order.orderType || 'Dine In'}${order.tableNo ? ' (Meja: ' + order.tableNo + ')' : ''}</span>
            </div>
            ${order.customerName ? `
              <div class="r-row">
                <span>Pelanggan:</span>
                <span>${order.customerName}</span>
              </div>
            ` : ''}
          </div>

          <div class="r-divider"></div>

          <!-- Items list -->
          <div>
            ${(order.items || []).map(item => `
              <div style="margin-bottom: 6px;">
                <div class="r-bold">${item.name} (${item.size || 'Regular'})</div>
                ${item.variants?.length ? `
                  <div style="font-size: 9.5px; color: #334155;">- Rasa: ${item.variants.join(', ')}</div>
                ` : ''}
                ${item.toppings?.length ? `
                  <div style="font-size: 9.5px; color: #334155;">- Top: ${item.toppings.map(t => t.name || t).join(', ')}</div>
                ` : ''}
                ${item.note ? `
                  <div style="font-size: 9.5px; font-style: italic;">* Note: ${item.note}</div>
                ` : ''}
                <div class="r-row" style="margin-top: 2px;">
                  <span>${item.qty} x ${formatRp(item.price)}</span>
                  <span class="r-bold">${formatRp(item.qty * item.price)}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="r-divider"></div>

          <!-- Calculations -->
          <div>
            <div class="r-row">
              <span>Subtotal:</span>
              <span>${formatRp(order.subtotal)}</span>
            </div>
            ${order.discount > 0 ? `
              <div class="r-row" style="color: #000;">
                <span>Diskon (${order.discountLabel || 'Promo'}):</span>
                <span>-${formatRp(order.discount)}</span>
              </div>
            ` : ''}
            ${order.tax > 0 ? `
              <div class="r-row">
                <span>Pajak Resto (${order.taxRate || 10}%):</span>
                <span>${formatRp(order.tax)}</span>
              </div>
            ` : ''}
            <div class="r-divider"></div>
            <div class="r-row" style="font-size: 13px; font-weight: 900;">
              <span>TOTAL:</span>
              <span>${formatRp(order.total)}</span>
            </div>
            <div class="r-row" style="margin-top: 4px;">
              <span>Metode:</span>
              <span class="r-bold">${(order.paymentMethod || 'CASH').toUpperCase()}</span>
            </div>
            <div class="r-row">
              <span>Bayar:</span>
              <span>${formatRp(order.cashTendered || order.total)}</span>
            </div>
            <div class="r-row">
              <span>Kembalian:</span>
              <span>${formatRp(order.change || 0)}</span>
            </div>
          </div>

          <div class="r-divider"></div>

          <!-- Footer & QR -->
          <div class="r-center" style="margin-top: 8px;">
            <div style="font-size: 10px; font-weight: 700;">${store.footerMessage}</div>
            <div style="font-size: 9.5px; margin-top: 2px;">Instagram: ${store.instagram}</div>
            <div style="font-size: 9px; margin-top: 4px; color: #475569;">Struk ini sah sebagai bukti pembayaran</div>
            <div style="margin-top: 8px; font-family: monospace; font-size: 11px; letter-spacing: 2px;">
              * * * * DIAZ POS * * * *
            </div>
          </div>
        </div>
      </div>

      <!-- Receipt Action Buttons -->
      <div class="sheet-footer" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button class="btn-primary" id="btn-print-receipt-window">
            🖨️ Cetak Struk
          </button>
          <button class="btn-secondary" id="btn-print-bluetooth">
            📶 Bluetooth ESC/POS
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button class="btn-secondary" id="btn-share-receipt">
            📲 Bagikan Struk
          </button>
          <button class="btn-secondary" id="btn-download-pdf-receipt">
            💾 Unduh File
          </button>
        </div>

        <button class="btn-secondary" id="btn-finish-receipt-flow" style="background: #F1F5F9; border-color: #CBD5E1; font-weight: 800;">
          ✨ Transaksi Baru Selesai
        </button>
      </div>
    </div>
  `;
}
