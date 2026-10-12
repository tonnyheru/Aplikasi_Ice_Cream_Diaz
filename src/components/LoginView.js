// Diaz Ice Cream POS - Fullscreen Kasir & Owner Login Screen
export function renderLoginView(db, selectedUserId = null, currentPin = '', errorMessage = '') {
  const users = db.getUsers();
  const settings = db.getSettings()?.store || {};
  
  // Default to first user or selected user
  const activeUser = users.find(u => u.id === selectedUserId) || users[0];
  const pinLength = (currentPin || '').length;

  return `
    <div class="login-view-container" id="login-view-root">
      <!-- Top Decorative Glow -->
      <div class="login-glow-bg"></div>

      <!-- Brand Header -->
      <div class="login-header">
        <div class="login-logo-badge">
          <span class="login-logo-icon">🍦</span>
          <span class="login-logo-sparkle">✨</span>
        </div>
        <h1 class="login-title">${settings.name || 'Diaz Ice Cream'}</h1>
        <p class="login-subtitle">Sistem Kasir Pintar & Penjualan POS</p>
        
        <div class="login-clock-badge" id="login-live-clock">
          🕒 Memuat jam...
        </div>
      </div>

      <!-- User Profile Selector -->
      <div class="login-section-title">
        <span>PILIH PROFIL KASIR / OWNER</span>
      </div>

      <div class="login-users-grid" id="login-users-list">
        ${users.map(u => {
          const isSelected = activeUser && activeUser.id === u.id;
          return `
            <button 
              type="button"
              class="login-user-card ${isSelected ? 'active' : ''}" 
              data-user-id="${u.id}"
              data-user-name="${u.name}"
              data-user-pin="${u.pin}"
              data-user-role="${u.role}"
            >
              <div class="login-user-avatar-wrap">
                <span class="login-user-avatar">${u.avatar || '👤'}</span>
                ${isSelected ? '<span class="login-user-check">✓</span>' : ''}
              </div>
              <div class="login-user-meta">
                <span class="login-user-name">${u.name}</span>
                <span class="login-user-role-badge ${u.role === 'admin' ? 'admin' : 'cashier'}">
                  ${u.role === 'admin' ? '👑 Owner' : '🍨 Kasir'}
                </span>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- PIN Input Section -->
      <div class="login-pin-card">
        <div class="login-pin-greeting">
          Halo, <strong>${activeUser ? activeUser.name : 'Kasir'}</strong>!
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px;">
            Masukkan 4 digit PIN keamanan Anda
          </div>
        </div>

        <!-- 4-Dot PIN Indicator -->
        <div class="login-pin-dots" id="login-pin-dots-display">
          <span class="pin-dot ${pinLength >= 1 ? 'filled' : ''}"></span>
          <span class="pin-dot ${pinLength >= 2 ? 'filled' : ''}"></span>
          <span class="pin-dot ${pinLength >= 3 ? 'filled' : ''}"></span>
          <span class="pin-dot ${pinLength >= 4 ? 'filled' : ''}"></span>
        </div>

        <!-- Hidden input for mobile keyboard / screen reader compatibility -->
        <input 
          type="password" 
          id="login-hidden-pin-input" 
          maxlength="4" 
          inputmode="numeric" 
          pattern="[0-9]*" 
          value="${currentPin || ''}" 
          style="position: absolute; opacity: 0; pointer-events: none; width: 1px; height: 1px;" 
        />

        <!-- Error Feedback Banner -->
        <div class="login-error-banner ${errorMessage ? 'visible' : ''}" id="login-error-msg">
          <span>⚠️</span>
          <span>${errorMessage || 'PIN yang Anda masukkan salah!'}</span>
        </div>

        <!-- Virtual Touch Numpad (Optimized for Android Touchscreen POS) -->
        <div class="login-numpad" id="login-numpad">
          <button type="button" class="numpad-key" data-key="1">1</button>
          <button type="button" class="numpad-key" data-key="2">2</button>
          <button type="button" class="numpad-key" data-key="3">3</button>
          <button type="button" class="numpad-key" data-key="4">4</button>
          <button type="button" class="numpad-key" data-key="5">5</button>
          <button type="button" class="numpad-key" data-key="6">6</button>
          <button type="button" class="numpad-key" data-key="7">7</button>
          <button type="button" class="numpad-key" data-key="8">8</button>
          <button type="button" class="numpad-key" data-key="9">9</button>
          <button type="button" class="numpad-key action-clear" data-key="CLEAR" title="Hapus Semua">C</button>
          <button type="button" class="numpad-key" data-key="0">0</button>
          <button type="button" class="numpad-key action-backspace" data-key="BACKSPACE" title="Hapus 1 Angka">⌫</button>
        </div>

        <!-- Submit Button -->
        <button type="button" class="btn-primary login-submit-btn" id="btn-login-submit">
          <span>🔓 Buka Kasir & Mulai Penjualan</span>
        </button>

        <!-- Quick Demo Login Bar -->
        <div class="login-demo-shortcuts">
          <div class="login-demo-title">⚡ Akses Demo Cepat (1-Klik):</div>
          <div class="login-demo-pills">
            ${users.map(u => `
              <button 
                type="button"
                class="demo-pill-btn" 
                data-demo-user-id="${u.id}" 
                data-demo-pin="${u.pin}"
                title="Klik untuk langsung login sebagai ${u.name}"
              >
                ${u.avatar || '👤'} ${u.name.split(' ')[0]} <span class="pill-pin">(${u.pin})</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="login-footer">
        <span>Diaz Ice Cream POS • Offline First & PWA Ready</span>
      </div>
    </div>
  `;
}
