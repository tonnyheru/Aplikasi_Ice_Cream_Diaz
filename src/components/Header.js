// Diaz Ice Cream POS - App Header Component
export function renderHeader(state, actions) {
  const settings = state.settings?.store || {};
  const currentUser = state.currentUser || {};
  const activeShift = state.activeShift;

  return `
    <header class="app-header">
      <div class="brand-wrapper" id="btn-brand-home">
        <div class="brand-logo-badge">🍦</div>
        <div class="brand-info">
          <h1>${settings.name || 'Diaz Ice Cream'}</h1>
          <span>
            <span class="online-dot"></span>
            ${activeShift ? 'Shift Aktif' : 'Shift Belum Buka'} • ${currentUser.role === 'admin' ? 'Owner' : 'Kasir'}
          </span>
        </div>
      </div>

      <div class="header-actions">
        <!-- Toggle Phone Mockup / Fullscreen -->
        <button class="header-btn" id="btn-toggle-frame" title="Toggle Mode HP / Fullscreen">
          ${state.isFullscreen ? '📱' : '🖥️'}
        </button>

        <!-- Dark Mode Toggle -->
        <button class="header-btn" id="btn-toggle-theme" title="Mode Gelap / Terang">
          ${state.isDarkMode ? '☀️' : '🌙'}
        </button>

        <!-- User Role Badge / Switch User -->
        <div class="user-badge-pill" id="btn-switch-user" title="Ganti Kasir / Login Admin">
          <span>${currentUser.avatar || '👤'}</span>
          <span>${currentUser.name?.split(' ')[0] || 'Kasir'}</span>
        </div>

        <!-- Lock / Logout Kasir -->
        <button class="header-btn" id="btn-header-lock" title="Kunci Kasir / Logout" style="background: var(--primary-light); color: var(--primary); font-size: 13px;">
          🔒
        </button>
      </div>
    </header>
  `;
}
