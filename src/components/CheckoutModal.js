// Diaz Ice Cream POS - Checkout & Payment Modal
export function renderCheckoutModal(orderSummary, state) {
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  const selectedMethod = state.paymentMethod || 'CASH'; // 'CASH' or 'QRIS'
  const total = orderSummary.total || 0;
  const cashTendered = state.cashTendered !== undefined ? state.cashTendered : total;
  const change = Math.max(0, cashTendered - total);
  const qrisStatus = state.qrisStatus || 'pending'; // 'pending', 'verifying', 'success', 'failed'

  // Quick denomination suggestions based on total
  const quickSuggestions = [
    { label: 'Uang Pas', amount: total },
    { label: '20.000', amount: 20000 },
    { label: '50.000', amount: 50000 },
    { label: '100.000', amount: 100000 },
    { label: '200.000', amount: 200000 }
  ].filter(s => s.amount >= total || s.label === 'Uang Pas');

  return `
    <div class="bottom-sheet" id="checkout-sheet-content" style="max-height: 90vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Pembayaran Pesanan</h3>
          <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
            Total Tagihan: <strong style="color: var(--primary); font-size: 13px;">${formatRp(total)}</strong>
          </span>
        </div>
        <button class="sheet-close-btn" id="btn-close-checkout">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- Payment Method Tabs -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button 
            class="option-select-pill ${selectedMethod === 'CASH' ? 'selected' : ''}" 
            id="tab-pay-cash"
            style="justify-content: center; padding: 12px; font-size: 14px;"
          >
            💵 Tunai (CASH)
          </button>
          <button 
            class="option-select-pill ${selectedMethod === 'QRIS' ? 'selected' : ''}" 
            id="tab-pay-qris"
            style="justify-content: center; padding: 12px; font-size: 14px;"
          >
            📲 QRIS Dinamis
          </button>
        </div>

        <!-- CASH FLOW -->
        ${selectedMethod === 'CASH' ? `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Uang Tunai Diterima (Rp)</label>
              <input 
                type="number" 
                class="form-input" 
                id="input-cash-tendered" 
                value="${cashTendered}"
                style="font-size: 18px; font-weight: 800; font-family: var(--font-mono);"
              />
            </div>

            <!-- Quick Denominations -->
            <div>
              <div class="option-group-title">Pilihan Uang Cepat</div>
              <div class="options-pill-grid">
                ${quickSuggestions.map(s => `
                  <button 
                    class="option-select-pill ${cashTendered === s.amount ? 'selected' : ''}"
                    data-quick-cash="${s.amount}"
                  >
                    ${s.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Change Calculation Card -->
            <div style="background: ${cashTendered >= total ? '#ECFDF5' : '#FEF2F2'}; border: 1px solid ${cashTendered >= total ? '#A7F3D0' : '#FECACA'}; border-radius: var(--radius-md); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; font-weight: 700; color: ${cashTendered >= total ? '#065F46' : '#991B1B'};">
                  ${cashTendered >= total ? 'KEMBALIAN PELANGGAN' : 'UANG KURANG'}
                </span>
                <span style="font-size: 20px; font-weight: 900; font-family: var(--font-mono); color: ${cashTendered >= total ? '#059669' : '#DC2626'};">
                  ${cashTendered >= total ? formatRp(change) : '-' + formatRp(total - cashTendered)}
                </span>
              </div>
            </div>
          </div>
        ` : `
          <!-- QRIS FLOW -->
          <div class="qris-display-card">
            <div class="qris-header-logos">
              <div class="qris-logo-text">QRIS</div>
              <div class="qris-aspi-badge">ASPI • GPN • BI</div>
            </div>

            <div style="font-size: 13px; font-weight: 800; color: var(--text-main);">
              DIAZ ICE CREAM JAKARTA
            </div>
            <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">
              NMID: ID1020349812480
            </div>

            <div class="qris-canvas-wrapper">
              <canvas id="qrisCanvas" width="220" height="220"></canvas>
            </div>

            <div style="font-size: 18px; font-weight: 900; color: var(--primary); font-family: var(--font-mono);">
              ${formatRp(total)}
            </div>

            <div class="qris-timer-box">
              <span>⏳</span>
              <span id="qris-countdown-text">04:59</span>
              <span>sisa waktu</span>
            </div>

            <!-- Status Indicator -->
            <div class="qris-status-box">
              ${qrisStatus === 'pending' ? `
                <div class="qris-status-badge pending">
                  <span class="online-dot" style="background: #2563EB;"></span>
                  <span>Menunggu Pembayaran Pelanggan...</span>
                </div>
              ` : qrisStatus === 'verifying' ? `
                <div class="qris-status-badge info">
                  <span>🔄 Memverifikasi Transaksi Gateway...</span>
                </div>
              ` : qrisStatus === 'success' ? `
                <div class="qris-status-badge success">
                  <span>✅ Pembayaran QRIS Sukses Diterima!</span>
                </div>
              ` : `
                <div class="qris-status-badge failed">
                  <span>❌ Pembayaran Dibatalkan / Gagal</span>
                </div>
              `}
            </div>

            <!-- Gateway Simulator Button -->
            ${qrisStatus === 'pending' ? `
              <div style="width: 100%; display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                <button class="btn-secondary" id="btn-simulate-qris-scan" style="background: #F0FDF4; border-color: #86EFAC; color: #166534;">
                  <span>📲 Simulasi Pelanggan Scan & Bayar</span>
                </button>
                <button class="btn-secondary" id="btn-cancel-qris" style="color: #EF4444; border-color: #FECACA;">
                  Batalkan Pembayaran
                </button>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div class="sheet-footer">
        ${selectedMethod === 'CASH' ? `
          <button 
            class="btn-primary" 
            id="btn-confirm-cash-payment"
            ${cashTendered < total ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
          >
            <span>Selesaikan Transaksi Tunai</span>
            <span>&rarr;</span>
          </button>
        ` : `
          ${qrisStatus === 'success' ? `
            <button class="btn-primary" id="btn-finish-qris-success" style="background: #059669;">
              <span>Cetak Struk & Selesai</span>
              <span>&rarr;</span>
            </button>
          ` : `
            <button class="btn-secondary" id="btn-check-qris-status">
              <span>🔄 Cek Status Pembayaran</span>
            </button>
          `}
        `}
      </div>
    </div>
  `;
}
