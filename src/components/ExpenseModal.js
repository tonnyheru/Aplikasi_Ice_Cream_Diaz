// Diaz Ice Cream POS - Expenses Logger Component
export function renderExpenseModal(db) {
  const expenses = db.getExpenses();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const categories = [
    'Bahan Baku',
    'Kemasan & Cup',
    'Operasional & Listrik',
    'Air & Kebersihan',
    'Transportasi & Logistik',
    'Gaji & Uang Makan',
    'Perawatan & Maintenance Mesin',
    'Pengeluaran Lainnya'
  ];

  return `
    <div class="bottom-sheet" id="expense-sheet-content" style="max-height: 90vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Catat Pengeluaran Toko</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Biaya Operasional & Pembelian Kas</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-expense">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- FORM TAMBAH PENGELUARAN -->
        <form id="form-add-expense" style="display: flex; flex-direction: column; gap: 12px; background: var(--bg-surface-subtle); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div class="form-group">
            <label class="form-label">Kategori Biaya *</label>
            <select class="form-select" id="exp-category" required>
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Nominal Pengeluaran (Rp) *</label>
            <input 
              type="number" 
              class="form-input" 
              id="exp-amount" 
              required 
              placeholder="Contoh: 150000"
              style="font-size: 16px; font-weight: 800; font-family: var(--font-mono);"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan / Keperluan *</label>
            <input 
              type="text" 
              class="form-input" 
              id="exp-note" 
              required 
              placeholder="Contoh: Beli es batu kristal 2 karung & spons cuci"
            />
          </div>

          <button class="btn-primary" id="btn-submit-expense" type="submit" style="padding: 10px; font-size: 12px;">
            <span>+ Catat Pengeluaran Sekarang</span>
          </button>
        </form>

        <!-- RIWAYAT PENGELUARAN TERBARU -->
        <div>
          <div class="option-group-title">Riwayat Pengeluaran Terbaru</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${expenses.length > 0 ? expenses.slice(0, 8).map(exp => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 12px; font-weight: 800;">${exp.note}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">
                    ${exp.category} • ${new Date(exp.date).toLocaleDateString('id-ID')} (${exp.recordedBy || 'Admin'})
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 13px; font-weight: 900; color: #DC2626; font-family: var(--font-mono);">
                    -${formatRp(exp.amount)}
                  </div>
                  <button class="btn-delete-expense" data-expense-id="${exp.id}" style="border: none; background: none; color: #94A3B8; font-size: 10px; cursor: pointer; margin-top: 2px;">
                    Hapus
                  </button>
                </div>
              </div>
            `).join('') : '<div style="font-size: 11px; color: var(--text-muted); text-align: center;">Belum ada catatan pengeluaran.</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}
