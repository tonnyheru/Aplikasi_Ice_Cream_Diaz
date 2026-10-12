// Diaz Ice Cream POS - Dashboard View
export function renderDashboardView(db) {
  const stats = db.getDashboardStats();
  const settings = db.getSettings();
  const activeShift = db.getActiveShift();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const lowStock = stats.lowStockIngredients;
  const topProducts = stats.topProducts.slice(0, 5);

  return `
    <div class="view-container">
      <!-- Hero Card -->
      <div class="hero-greeting-card">
        <div class="hero-header-row">
          <div class="hero-title">
            <h2>Hai, ${db.getCurrentUser()?.name || 'Kasir Diaz'}! 🍨</h2>
            <p>${settings?.store?.tagline || 'Sensasi Kelezatan Es Krim Segar'}</p>
          </div>
          <div class="shift-pill-badge" id="btn-dashboard-shift" style="cursor: pointer;">
            <span>⏱️</span>
            <span>${activeShift ? 'Shift Aktif' : 'Shift Tutup'}</span>
          </div>
        </div>

        <div class="hero-stats-grid">
          <div class="hero-stat-box">
            <div class="label">Penjualan Hari Ini</div>
            <div class="val">${formatRp(stats.todaySales)}</div>
          </div>
          <div class="hero-stat-box">
            <div class="label">Keuntungan Bersih Est.</div>
            <div class="val" style="color: #FEF08A;">${formatRp(stats.todayNetProfit)}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="quick-actions-bar">
        <div class="section-heading">
          <span>Aksi Cepat</span>
          <span class="action-link" id="btn-quick-new-order">Buka Kasir &rarr;</span>
        </div>
        <div class="quick-buttons-row">
          <div class="quick-btn" id="qa-new-tx">
            <div class="btn-icon" style="background: #FFE4EC; color: #FF5376;">🛒</div>
            <span class="btn-text">Transaksi Baru</span>
          </div>
          <div class="quick-btn" id="qa-add-prod">
            <div class="btn-icon" style="background: #FEF3C7; color: #D97706;">🍦</div>
            <span class="btn-text">Tambah Menu</span>
          </div>
          <div class="quick-btn" id="qa-add-stock">
            <div class="btn-icon" style="background: #ECFDF5; color: #059669;">📦</div>
            <span class="btn-text">Tambah Stok</span>
          </div>
          <div class="quick-btn" id="qa-expense">
            <div class="btn-icon" style="background: #FEE2E2; color: #DC2626;">💸</div>
            <span class="btn-text">Pengeluaran</span>
          </div>
          <div class="quick-btn" id="qa-reports">
            <div class="btn-icon" style="background: #EFF6FF; color: #2563EB;">📈</div>
            <span class="btn-text">Laporan</span>
          </div>
          <div class="quick-btn" id="qa-qris">
            <div class="btn-icon" style="background: #F3E8FF; color: #7C3AED;">📱</div>
            <span class="btn-text">Scan QRIS</span>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert Banner -->
      ${lowStock.length > 0 ? `
        <div class="alert-banner" id="banner-low-stock" style="cursor: pointer;">
          <div style="font-size: 20px;">⚠️</div>
          <div class="alert-content">
            <div class="alert-title">Peringatan: ${lowStock.length} Bahan Baku Menipis!</div>
            <div class="alert-desc">
              ${lowStock.map(i => `${i.name} (Sisa: ${i.stock} ${i.unit})`).join(', ')}. Segera lakukan restock ke supplier.
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Metric KPI Cards -->
      <div class="metric-cards-grid">
        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-card-title">TOTAL TRANSAKSI</span>
            <span style="font-size: 16px;">🧾</span>
          </div>
          <div class="metric-card-val">${stats.todayTransactionsCount} Transaksi</div>
          <div class="metric-card-sub">
            <span>Rata-rata: ${stats.todayTransactionsCount ? formatRp(Math.round(stats.todaySales / stats.todayTransactionsCount)) : 'Rp 0'}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-card-title">PENGELUARAN HARI INI</span>
            <span style="font-size: 16px;">📉</span>
          </div>
          <div class="metric-card-val" style="color: #DC2626;">${formatRp(stats.todayExpenses)}</div>
          <div class="metric-card-sub">
            <span>Operasional & Bahan</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-card-title">PENJUALAN TUNAI (CASH)</span>
            <span style="font-size: 16px;">💵</span>
          </div>
          <div class="metric-card-val" style="color: #059669;">${formatRp(stats.todayCash)}</div>
          <div class="metric-card-sub">
            <span>${stats.todaySales ? Math.round((stats.todayCash / stats.todaySales) * 100) : 0}% dari total</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-card-title">PENJUALAN QRIS</span>
            <span style="font-size: 16px;">📲</span>
          </div>
          <div class="metric-card-val" style="color: #2563EB;">${formatRp(stats.todayQris)}</div>
          <div class="metric-card-sub">
            <span>${stats.todaySales ? Math.round((stats.todayQris / stats.todaySales) * 100) : 0}% dari total</span>
          </div>
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="section-heading" style="margin: 0;">
            <span>Tren Penjualan Toko</span>
          </div>
          <div class="chart-tabs">
            <button class="chart-tab-btn active" id="btn-chart-7d">7 Hari</button>
            <button class="chart-tab-btn" id="btn-chart-30d">30 Hari</button>
          </div>
        </div>
        <div style="height: 190px; position: relative;">
          <canvas id="salesChartCanvas"></canvas>
        </div>
      </div>

      <!-- Top Selling Products -->
      <div class="top-selling-section">
        <div class="section-heading" style="margin-bottom: 10px;">
          <span>Produk Paling Laku (Best Seller)</span>
          <span class="action-link" id="btn-view-all-products">Lihat Semua Menu</span>
        </div>
        <div class="top-products-scroll">
          ${topProducts.length > 0 ? topProducts.map((p, idx) => `
            <div class="top-product-chip">
              <div class="top-product-rank">#${idx + 1}</div>
              <div>
                <div style="font-size: 12px; font-weight: 700;">${p.name}</div>
                <div style="font-size: 11px; color: var(--primary); font-weight: 800;">
                  ${p.qty} Terjual • ${formatRp(p.totalRevenue)}
                </div>
              </div>
            </div>
          `).join('') : '<div style="font-size: 12px; color: var(--text-muted); padding: 8px;">Belum ada penjualan tercatat.</div>'}
        </div>
      </div>
    </div>
  `;
}
