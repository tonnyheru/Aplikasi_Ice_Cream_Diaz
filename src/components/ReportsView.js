// Diaz Ice Cream POS - Comprehensive Reports & Analytics Component
export function renderReportsView(state, db) {
  const transactions = db.getTransactions();
  const expenses = db.getExpenses();
  const ingredients = db.getIngredients();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const reportPeriod = state.reportPeriod || '7d'; // 'today', '7d', '30d', 'all'
  const now = Date.now();

  const filteredTx = transactions.filter(t => {
    if (reportPeriod === 'all') return true;
    const txTime = new Date(t.createdAt).getTime();
    if (reportPeriod === 'today') return new Date(t.createdAt).toDateString() === new Date().toDateString();
    if (reportPeriod === '7d') return (now - txTime) <= 7 * 24 * 3600 * 1000;
    if (reportPeriod === '30d') return (now - txTime) <= 30 * 24 * 3600 * 1000;
    return true;
  });

  const completedTx = filteredTx.filter(t => t.status === 'completed');
  const cancelledTx = filteredTx.filter(t => t.status === 'cancelled');

  const totalSales = completedTx.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const totalCash = completedTx.filter(t => t.paymentMethod === 'CASH').reduce((sum, t) => sum + Number(t.total || 0), 0);
  const totalQris = completedTx.filter(t => t.paymentMethod === 'QRIS').reduce((sum, t) => sum + Number(t.total || 0), 0);

  const filteredExpenses = expenses.filter(e => {
    if (reportPeriod === 'all') return true;
    const expTime = new Date(e.date).getTime();
    if (reportPeriod === 'today') return new Date(e.date).toDateString() === new Date().toDateString();
    if (reportPeriod === '7d') return (now - expTime) <= 7 * 24 * 3600 * 1000;
    if (reportPeriod === '30d') return (now - expTime) <= 30 * 24 * 3600 * 1000;
    return true;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Estimate COGS / HPP around ~35%, so gross profit ~65%
  const grossProfit = Math.round(totalSales * 0.65);
  const netProfit = grossProfit - totalExpenseAmount;

  // Product rank in this period
  const prodRankMap = {};
  completedTx.forEach(t => {
    (t.items || []).forEach(it => {
      if (!prodRankMap[it.id]) {
        prodRankMap[it.id] = { name: it.name, qty: 0, revenue: 0 };
      }
      prodRankMap[it.id].qty += it.qty;
      prodRankMap[it.id].revenue += it.qty * it.price;
    });
  });

  const rankedProducts = Object.values(prodRankMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return `
    <div class="view-container">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 18px; font-weight: 800; font-family: var(--font-display);">Laporan & Analisis Bisnis</h2>
          <p style="font-size: 11px; color: var(--text-muted);">Performa penjualan es krim & arus kas</p>
        </div>
      </div>

      <!-- Filter Period Pills -->
      <div class="category-pills-bar">
        <button class="category-pill ${reportPeriod === 'today' ? 'active' : ''}" data-report-period="today">Hari Ini</button>
        <button class="category-pill ${reportPeriod === '7d' ? 'active' : ''}" data-report-period="7d">7 Hari Terakhir</button>
        <button class="category-pill ${reportPeriod === '30d' ? 'active' : ''}" data-report-period="30d">30 Hari</button>
        <button class="category-pill ${reportPeriod === 'all' ? 'active' : ''}" data-report-period="all">Semua Data</button>
      </div>

      <!-- Summary KPI cards -->
      <div class="metric-cards-grid">
        <div class="metric-card">
          <span class="metric-card-title">TOTAL PENJUALAN</span>
          <div class="metric-card-val" style="color: var(--primary);">${formatRp(totalSales)}</div>
          <span class="metric-card-sub">${completedTx.length} Transaksi Berhasil</span>
        </div>

        <div class="metric-card">
          <span class="metric-card-title">KEUNTUNGAN BERSIH</span>
          <div class="metric-card-val" style="color: ${netProfit >= 0 ? '#059669' : '#DC2626'};">
            ${formatRp(netProfit)}
          </div>
          <span class="metric-card-sub">Margin Laba: ${totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0}%</span>
        </div>

        <div class="metric-card">
          <span class="metric-card-title">TOTAL PENGELUARAN</span>
          <div class="metric-card-val" style="color: #DC2626;">${formatRp(totalExpenseAmount)}</div>
          <span class="metric-card-sub">${filteredExpenses.length} Catatan Biaya</span>
        </div>

        <div class="metric-card">
          <span class="metric-card-title">BATAL / VOID</span>
          <div class="metric-card-val" style="color: #94A3B8;">${cancelledTx.length} Transaksi</div>
          <span class="metric-card-sub">Stok dikembalikan</span>
        </div>
      </div>

      <!-- Payment Breakdown -->
      <div class="chart-card">
        <div class="section-heading" style="margin-bottom: 10px;">
          <span>Perbandingan Metode Pembayaran</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
          <div style="flex: 1; height: 12px; background: #E2E8F0; border-radius: 6px; overflow: hidden; display: flex;">
            <div style="width: ${totalSales ? (totalCash / totalSales) * 100 : 50}%; background: #059669;" title="Cash"></div>
            <div style="width: ${totalSales ? (totalQris / totalSales) * 100 : 50}%; background: #2563EB;" title="QRIS"></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span style="color: #059669; font-weight: 700;">💵 Tunai: ${formatRp(totalCash)} (${totalSales ? Math.round((totalCash / totalSales) * 100) : 0}%)</span>
          <span style="color: #2563EB; font-weight: 700;">📲 QRIS: ${formatRp(totalQris)} (${totalSales ? Math.round((totalQris / totalSales) * 100) : 0}%)</span>
        </div>
      </div>

      <!-- Top Selling Products in this Period -->
      <div class="chart-card">
        <div class="section-heading" style="margin-bottom: 10px;">
          <span>5 Menu Terlaris di Periode Ini</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${rankedProducts.length > 0 ? rankedProducts.map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="top-product-rank">${idx + 1}</span>
                <span style="font-size: 12px; font-weight: 700;">${p.name}</span>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; font-weight: 800; font-family: var(--font-mono); color: var(--primary);">
                  ${formatRp(p.revenue)}
                </div>
                <div style="font-size: 10px; color: var(--text-muted);">${p.qty} cup terjual</div>
              </div>
            </div>
          `).join('') : '<div style="font-size: 11px; color: var(--text-muted);">Belum ada data penjualan pada periode ini.</div>'}
        </div>
      </div>

      <!-- Export Data Section -->
      <div class="chart-card">
        <div class="section-heading" style="margin-bottom: 8px;">
          <span>Ekspor Laporan (Excel / CSV)</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
          Unduh laporan terformat untuk pembukuan akuntansi dan arsip toko.
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="btn-secondary" id="btn-export-sales-csv">
            📊 Unduh Laporan Penjualan (CSV)
          </button>
          <button class="btn-secondary" id="btn-export-stock-csv">
            📦 Unduh Laporan Stok & Bahan Baku (CSV)
          </button>
          <button class="btn-secondary" id="btn-export-expenses-csv">
            💸 Unduh Laporan Pengeluaran Operasional (CSV)
          </button>
        </div>
      </div>
    </div>
  `;
}
