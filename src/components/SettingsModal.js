// Diaz Ice Cream POS - Store Settings Modal Component
export function renderSettingsModal(db) {
  const settings = db.getSettings()?.store || {};

  return `
    <div class="bottom-sheet" id="settings-sheet-content" style="max-height: 90vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Pengaturan Toko & Printer</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Konfigurasi Toko & Perangkat Kasir</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-settings">&times;</button>
      </div>

      <div class="sheet-body">
        <form id="form-save-settings" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Nama Toko *</label>
            <input type="text" class="form-input" id="set-store-name" value="${settings.name || 'Diaz Ice Cream'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Slogan / Tagline Toko</label>
            <input type="text" class="form-input" id="set-store-tagline" value="${settings.tagline || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap Toko</label>
            <textarea class="form-textarea" id="set-store-address" rows="2">${settings.address || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="form-group">
              <label class="form-label">Nomor Telepon</label>
              <input type="text" class="form-input" id="set-store-phone" value="${settings.phone || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Akun Instagram</label>
              <input type="text" class="form-input" id="set-store-ig" value="${settings.instagram || ''}" />
            </div>
          </div>

          <!-- Pajak PB1 -->
          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 12px; font-weight: 800;">Aktifkan Pajak Restoran (PB1)</div>
              <div style="font-size: 10px; color: var(--text-muted);">Tarif default standar 10%</div>
            </div>
            <input type="checkbox" id="set-tax-enabled" ${settings.taxEnabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--primary);" />
          </div>

          <!-- Konfigurasi Printer -->
          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 12px; font-weight: 800; margin-bottom: 6px;">🖨️ Format Kertas Printer Thermal</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700;">
                <input type="radio" name="printer-size" value="58mm" ${settings.paperSize === '58mm' ? 'checked' : ''} />
                58mm (Kecil/Standar)
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700;">
                <input type="radio" name="printer-size" value="80mm" ${settings.paperSize === '80mm' ? 'checked' : ''} />
                80mm (Lebar)
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">NMID QRIS Toko</label>
            <input type="text" class="form-input" id="set-qris-nmid" value="${settings.qrisNmid || 'ID1020349812480'}" />
          </div>

          <div class="form-group">
            <label class="form-label">Pesan Penutup Struk (Footer)</label>
            <input type="text" class="form-input" id="set-receipt-footer" value="${settings.footerMessage || ''}" />
          </div>

          <button class="btn-primary" type="submit" style="margin-top: 8px;">
            <span>💾 Simpan Pengaturan</span>
          </button>
        </form>
      </div>
    </div>
  `;
}
