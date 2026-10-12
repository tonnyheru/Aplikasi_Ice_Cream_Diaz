// Diaz Ice Cream POS - Promos and Discounts Component
export function renderPromoModal(db) {
  const promos = db.getPromos();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  return `
    <div class="bottom-sheet" id="promo-sheet-content" style="max-height: 88vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Promo, Diskon & Voucher</h3>
          <span style="font-size: 11px; color: var(--text-muted);">${promos.length} voucher aktif</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-promo">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- FORM TAMBAH PROMO -->
        <form id="form-add-promo" style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 12px; font-weight: 800;">+ Buat Kode Promo Baru</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <input type="text" class="form-input" id="prm-code" placeholder="KODE (cth: MANIS15)" style="text-transform: uppercase;" required />
            <select class="form-select" id="prm-type">
              <option value="percent">Persentase (%)</option>
              <option value="nominal">Nominal Rupiah (Rp)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <input type="number" class="form-input" id="prm-val" placeholder="Nilai (cth: 10 atau 5000)" required />
            <input type="number" class="form-input" id="prm-min" placeholder="Min. Belanja (cth: 20000)" />
          </div>
          <button class="btn-primary" type="submit" style="padding: 10px; font-size: 11px;">
            Simpan Kode Promo
          </button>
        </form>

        <!-- DAFTAR PROMO AKTIF -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${promos.map(p => `
            <div style="background: var(--bg-surface); border: 1px dashed var(--primary); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 14px; font-weight: 900; color: var(--primary); font-family: var(--font-mono);">
                  🏷️ ${p.code}
                </div>
                <div style="font-size: 11px; font-weight: 700; margin-top: 2px;">${p.name || 'Diskon Belanja'}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                  Min. Belanja: ${formatRp(p.minOrder || 0)}
                </div>
              </div>

              <div style="text-align: right;">
                <span class="tag-badge success">
                  ${p.type === 'percent' ? p.value + '%' : formatRp(p.value)} OFF
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
