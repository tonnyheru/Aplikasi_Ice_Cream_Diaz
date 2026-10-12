// Diaz Ice Cream POS - Shift Kasir Modal Component
export function renderShiftModal(db) {
  const activeShift = db.getActiveShift();
  const currentUser = db.getCurrentUser();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  let cashSales = 0;
  let qrisSales = 0;
  let expensesShift = 0;
  let expectedCash = 0;

  if (activeShift) {
    const transactions = db.getTransactions().filter(t => 
      t.status === 'completed' &&
      new Date(t.createdAt) >= new Date(activeShift.openedAt)
    );

    cashSales = transactions
      .filter(t => t.paymentMethod === 'CASH')
      .reduce((sum, t) => sum + Number(t.total || 0), 0);

    qrisSales = transactions
      .filter(t => t.paymentMethod === 'QRIS')
      .reduce((sum, t) => sum + Number(t.total || 0), 0);

    expensesShift = db.getExpenses()
      .filter(e => new Date(e.date) >= new Date(activeShift.openedAt))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    expectedCash = Number(activeShift.startingCash || 0) + cashSales - expensesShift;
  }

  return `
    <div class="bottom-sheet" id="shift-sheet-content" style="max-height: 88vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Manajemen Shift Kasir</h3>
          <span style="font-size: 11px; color: var(--text-muted);">
            Kasir Bertugas: <strong>${currentUser?.name}</strong>
          </span>
        </div>
        <button class="sheet-close-btn" id="btn-close-shift">&times;</button>
      </div>

      <div class="sheet-body">
        ${!activeShift ? `
          <!-- FORM BUKA SHIFT -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 12px; border-radius: var(--radius-md); font-size: 12px; color: #92400E;">
              ⚠️ <strong>Shift Saat Ini Ditutup:</strong> Silakan buka shift baru sebelum memulai transaksi penjualan di kasir.
            </div>

            <div class="form-group">
              <label class="form-label">Modal Awal Kas Tunai (Float) *</label>
              <input 
                type="number" 
                class="form-input" 
                id="input-start-cash" 
                value="200000" 
                placeholder="200000"
                style="font-size: 16px; font-weight: 800; font-family: var(--font-mono);"
              />
              <span style="font-size: 10px; color: var(--text-muted);">Uang kembalian awal di laci kas</span>
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Buka Shift (Opsional)</label>
              <input 
                type="text" 
                class="form-input" 
                id="input-shift-note" 
                placeholder="Shift Pagi / Shift Sore..."
              />
            </div>

            <button class="btn-primary" id="btn-confirm-open-shift" style="margin-top: 10px;">
              <span>🚀 Buka Shift & Mulai Transaksi</span>
            </button>
          </div>
        ` : `
          <!-- DETAIL SHIFT AKTIF & TUTUP SHIFT -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 10px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="tag-badge success">Shift Aktif</span>
                <div style="font-size: 11px; color: #065F46; margin-top: 4px;">
                  Dibuka: ${new Date(activeShift.openedAt).toLocaleTimeString('id-ID')} (${activeShift.cashierName})
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 10px; color: #065F46;">Modal Awal:</div>
                <div style="font-size: 14px; font-weight: 800; font-family: var(--font-mono); color: #065F46;">
                  ${formatRp(activeShift.startingCash)}
                </div>
              </div>
            </div>

            <!-- Kalkulasi Sistem -->
            <div class="calc-summary-card">
              <div class="calc-row">
                <span>Modal Awal Kas:</span>
                <span>${formatRp(activeShift.startingCash)}</span>
              </div>
              <div class="calc-row">
                <span>Penjualan Tunai (Cash):</span>
                <span style="color: #059669; font-weight: 700;">+${formatRp(cashSales)}</span>
              </div>
              <div class="calc-row">
                <span>Penjualan QRIS (Non-Tunai):</span>
                <span>${formatRp(qrisSales)}</span>
              </div>
              <div class="calc-row">
                <span>Pengeluaran Kas Tunai:</span>
                <span style="color: #DC2626; font-weight: 700;">-${formatRp(expensesShift)}</span>
              </div>
              <div class="calc-row total-row">
                <span>SEHARUSNYA KAS DI LACI:</span>
                <span class="price">${formatRp(expectedCash)}</span>
              </div>
            </div>

            <!-- Input Hitungan Kas Fisik -->
            <div class="form-group">
              <label class="form-label">Hitungan Fisik Uang Kas di Laci (Rp) *</label>
              <input 
                type="number" 
                class="form-input" 
                id="input-actual-cash" 
                placeholder="Masukkan jumlah uang fisik di laci"
                value="${expectedCash}"
                style="font-size: 16px; font-weight: 800; font-family: var(--font-mono);"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Penutupan Shift</label>
              <input 
                type="text" 
                class="form-input" 
                id="input-close-note" 
                placeholder="Catatan kendala / serah terima..."
              />
            </div>

            <button class="btn-primary" id="btn-confirm-close-shift" style="background: #DC2626; margin-top: 6px;">
              <span>🔒 Tutup Shift & Simpan Laporan</span>
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}
