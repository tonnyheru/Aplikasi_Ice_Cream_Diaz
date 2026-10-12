// Diaz Ice Cream POS - Android Bottom Navigation Component
export function renderBottomNav(currentTab, lowStockCount = 0) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pos', label: 'Kasir', icon: '🍨' },
    { id: 'products', label: 'Produk', icon: '🧁' },
    { id: 'inventory', label: 'Stok', icon: '📦', badge: lowStockCount > 0 },
    { id: 'reports', label: 'Laporan', icon: '📈' },
    { id: 'more', label: 'Lainnya', icon: '⚙️' }
  ];

  return `
    <nav class="bottom-nav">
      ${tabs.map(tab => `
        <button class="nav-item ${currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
          <span class="nav-icon">${tab.icon}</span>
          <span class="nav-label">${tab.label}</span>
          ${tab.badge ? '<span class="badge-dot"></span>' : ''}
        </button>
      `).join('')}
    </nav>
  `;
}
