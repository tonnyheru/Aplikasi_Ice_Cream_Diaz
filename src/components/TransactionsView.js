// Diaz Ice Cream POS - Transactions History Component
export function renderTransactionsView(state, db) {
  const transactions = db.getTransactions();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const searchQuery = (state.txSearch || '').toLowerCase();
  const methodFilter = state.txMethodFilter || 'all';
  const statusFilter = state.txStatusFilter || 'all';
  const dateFilter = state.txDateFilter || 'all';

  const todayStr = new Date().toDateString();

  const filtered = transactions.filter(t => {
    const matchSearch = !searchQuery || 
      t.id.toLowerCase().includes(searchQuery) ||
      (t.cashierName && t.cashierName.toLowerCase().includes(searchQuery)) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery));

    const matchMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;

    let matchDate = true;
    if (dateFilter === 'today') {
      matchDate = new Date(t.createdAt).toDateString() === todayStr;
    } else if (dateFilter === '7d') {
      matchDate = (Date.now() - new Date(t.createdAt).getTime()) <= 7 * 24 * 3600 * 1000;
    }

    return matchSearch && matchMethod && matchStatus && matchDate;
  });

  return `
    <div class="view-container">
      <div>
        <h2 style="font-size: 18px; font-weight: 800; font-family: var(--font-display);">Riwayat Transaksi</h2>
        <p style="font-size: 11px; color: var(--text-muted);">${transactions.length} total transaksi tersimpan</p>
      </div>

      <!-- Search bar -->
      <div class="pos-search-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            id="input-tx-search" 
            placeholder="Cari ID transaksi, nama kasir, pelanggan..."
            value="${state.txSearch || ''}"
          />
        </div>
      </div>

      <!-- Filter pills -->
      <div class="category-pills-bar">
        <button class="category-pill ${dateFilter === 'all' ? 'active' : ''}" data-tx-date="all">Semua Waktu</button>
        <button class="category-pill ${dateFilter === 'today' ? 'active' : ''}" data-tx-date="today">Hari Ini</button>
        <button class="category-pill ${dateFilter === '7d' ? 'active' : ''}" data-tx-date="7d">7 Hari</button>
        <button class="category-pill ${methodFilter === 'CASH' ? 'active' : ''}" data-tx-method="CASH">💵 Cash</button>
        <button class="category-pill ${methodFilter === 'QRIS' ? 'active' : ''}" data-tx-method="QRIS">📲 QRIS</button>
      </div>

      <!-- Transactions List -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${filtered.length > 0 ? filtered.map(t => {
          const isCancelled = t.status === 'cancelled';
          const itemsCount = (t.items || []).reduce((s, it) => s + it.qty, 0);

          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-family: var(--font-mono); font-weight: 800; font-size: 13px;">${t.id}</span>
                    <span class="tag-badge ${t.paymentMethod === 'QRIS' ? 'info' : 'success'}">${t.paymentMethod}</span>
                  </div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                    ${new Date(t.createdAt).toLocaleString('id-ID')} • Kasir: ${t.cashierName || 'Siti'}
                  </div>
                </div>

                <span class="tag-badge ${isCancelled ? 'danger' : 'success'}">
                  ${isCancelled ? 'Dibatalkan' : 'Selesai'}
                </span>
              </div>

              <!-- Items snippet -->
              <div style="font-size: 11px; color: var(--text-main); background: var(--bg-surface-subtle); padding: 8px; border-radius: var(--radius-sm);">
                ${(t.items || []).map(it => `${it.qty}x ${it.name} (${it.size || 'Reg'})`).join(', ')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px; border-top: 1px dashed var(--border-color);">
                <div style="font-size: 15px; font-weight: 900; font-family: var(--font-mono); color: ${isCancelled ? 'var(--text-muted)' : 'var(--primary)'};">
                  ${formatRp(t.total)}
                </div>

                <div style="display: flex; gap: 6px;">
                  <button class="btn-secondary" data-reprint-tx="${t.id}" style="width: auto; padding: 6px 12px; font-size: 11px;">
                    🖨️ Cetak Struk
                  </button>
                  ${!isCancelled ? `
                    <button class="btn-secondary" data-void-tx="${t.id}" style="width: auto; padding: 6px 10px; font-size: 11px; color: #EF4444; border-color: #FECACA;" title="Batalkan Transaksi & Kembalikan Stok">
                      Batalkan
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('') : `
          <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
            <div style="font-size: 32px; margin-bottom: 6px;">🧾</div>
            <div style="font-weight: 700;">Tidak ada riwayat transaksi ditemukan</div>
          </div>
        `}
      </div>
    </div>
  `;
}
