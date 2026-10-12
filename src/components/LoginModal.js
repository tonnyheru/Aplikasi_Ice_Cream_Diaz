// Diaz Ice Cream POS - User Authentication & Switch PIN Modal
export function renderLoginModal(db) {
  const users = db.getUsers();
  const currentUser = db.getCurrentUser();

  return `
    <div class="bottom-sheet" id="login-sheet-content" style="max-height: 85vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Ganti Pengguna & Hak Akses</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Pilih akun kasir atau masukkan PIN Supervisor</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-login">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- USER LIST SELECTOR -->
        <div class="option-group-title">Pilih Profil Akun</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${users.map(u => `
            <div 
              class="user-select-row ${currentUser?.id === u.id ? 'active' : ''}" 
              data-user-id="${u.id}"
              style="background: var(--bg-surface); border: 2px solid ${currentUser?.id === u.id ? 'var(--primary)' : 'var(--border-color)'}; border-radius: var(--radius-md); padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;"
            >
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">${u.avatar || '👤'}</span>
                <div>
                  <div style="font-size: 13px; font-weight: 800;">${u.name}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">${u.title || u.role}</div>
                </div>
              </div>

              <span class="tag-badge ${u.role === 'admin' ? 'warning' : 'info'}">
                ${u.role === 'admin' ? '👑 Owner' : '🍨 Kasir'}
              </span>
            </div>
          `).join('')}
        </div>

        <!-- PIN INPUT -->
        <div style="margin-top: 14px; background: var(--bg-surface-subtle); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div class="form-group">
            <label class="form-label" style="text-align: center;">Masukkan 4 Digit PIN Keamanan</label>
            <input 
              type="password" 
              class="form-input" 
              id="input-user-pin" 
              maxlength="4" 
              placeholder="••••"
              style="font-size: 24px; text-align: center; letter-spacing: 8px; font-weight: 900; font-family: var(--font-mono);"
            />
            <div style="font-size: 10.5px; color: var(--text-muted); text-align: center; margin-top: 4px;">
              PIN Demo: Owner/Admin: <strong>1234</strong> | Kasir 1: <strong>1111</strong> | Kasir 2: <strong>2222</strong>
            </div>
          </div>

          <button class="btn-primary" id="btn-submit-pin-login" style="margin-top: 12px;">
            <span>Verifikasi & Ganti Pengguna</span>
          </button>

          <button type="button" class="btn-secondary" id="btn-modal-logout" style="margin-top: 8px; border-color: #FCA5A5; color: #DC2626; background: #FEF2F2; font-weight: 700;">
            <span>🔒 Kunci Layar Kasir (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
