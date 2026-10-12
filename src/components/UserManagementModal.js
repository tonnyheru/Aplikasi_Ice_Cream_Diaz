// Diaz Ice Cream POS - Kasir & User Management Modal
export function renderUserManagementModal(db) {
  const users = db.getUsers();
  const currentUser = db.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const avatarOptions = ['🍨', '🍦', '🍧', '🧇', '🥤', '👑', '🍫', '🍓', '🥭', '🍒'];

  return `
    <div class="bottom-sheet" id="users-sheet-content" style="max-height: 90vh;">
      <div class="sheet-handle-bar"></div>
      
      <div class="sheet-header">
        <div>
          <h3>👥 Manajemen Akun Kasir & Staf</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Kelola staf kasir toko, hak akses, dan PIN keamanan</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-users-modal">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- Current Cashier List -->
        <div class="option-group-title">Daftar Akun Kasir (${users.length})</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          ${users.map(u => `
            <div 
              style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;"
            >
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 22px;">
                  ${u.avatar || '👤'}
                </div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                    ${u.name}
                    ${currentUser?.id === u.id ? '<span style="font-size: 10px; background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px;">Sedang Aktif</span>' : ''}
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                    ${u.title || (u.role === 'admin' ? 'Owner / Manager' : 'Kasir')} • PIN: <strong>••••</strong> ${isAdmin ? `<span style="color: var(--primary); font-family: var(--font-mono); font-size: 10px;">(${u.pin})</span>` : ''}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="tag-badge ${u.role === 'admin' ? 'warning' : 'info'}">
                  ${u.role === 'admin' ? '👑 Owner' : '🍨 Kasir'}
                </span>
                ${isAdmin && users.length > 1 && currentUser?.id !== u.id ? `
                  <button 
                    type="button"
                    class="btn-delete-user" 
                    data-user-id="${u.id}" 
                    data-user-name="${u.name}"
                    style="background: #FEE2E2; color: #DC2626; border: none; border-radius: var(--radius-sm); padding: 6px 10px; font-size: 12px; cursor: pointer;"
                    title="Hapus Kasir"
                  >
                    🗑️
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Add New Cashier Form -->
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div class="option-group-title" style="margin-bottom: 10px;">➕ Tambah Akun Kasir Baru</div>
          
          <form id="form-add-new-user" style="display: flex; flex-direction: column; gap: 10px;">
            <div class="form-group">
              <label class="form-label">Nama Lengkap Kasir / Staf</label>
              <input 
                type="text" 
                class="form-input" 
                id="input-new-user-name" 
                placeholder="Contoh: Rian Pratama" 
                required 
              />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="form-group">
                <label class="form-label">Peran / Role</label>
                <select class="form-input" id="input-new-user-role">
                  <option value="cashier">🍨 Kasir</option>
                  <option value="admin">👑 Owner / Supervisor</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">4-Digit PIN Masuk</label>
                <input 
                  type="password" 
                  class="form-input" 
                  id="input-new-user-pin" 
                  placeholder="Contoh: 3333" 
                  maxlength="4" 
                  inputmode="numeric" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Pilih Avatar Staf</label>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${avatarOptions.map((emoji, idx) => `
                  <label style="cursor: pointer;">
                    <input 
                      type="radio" 
                      name="new_user_avatar" 
                      value="${emoji}" 
                      ${idx === 0 ? 'checked' : ''} 
                      style="display: none;" 
                    />
                    <span 
                      class="avatar-option-pill"
                      style="display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--border-color); font-size: 18px; background: var(--bg-surface);"
                    >
                      ${emoji}
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 6px;">
              <span>Simpan & Tambahkan Kasir</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}
