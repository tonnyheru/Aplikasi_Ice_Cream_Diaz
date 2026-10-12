// Diaz Ice Cream POS - Suppliers Management Component
export function renderSupplierModal(db) {
  const suppliers = db.getSuppliers();

  return `
    <div class="bottom-sheet" id="supplier-sheet-content" style="max-height: 88vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Supplier Mitra Bahan Baku</h3>
          <span style="font-size: 11px; color: var(--text-muted);">${suppliers.length} rekanan penyuplai</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-supplier">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- FORM TAMBAH SUPPLIER -->
        <form id="form-add-supplier" style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 12px; font-weight: 800;">+ Tambah Supplier Baru</div>
          <input type="text" class="form-input" id="sup-name" placeholder="Nama Perusahaan / Toko *" required />
          <input type="tel" class="form-input" id="sup-phone" placeholder="Nomor Telepon / Sales *" required />
          <input type="text" class="form-input" id="sup-items" placeholder="Barang yang disuplai (cth: Es Krim, Cup)" required />
          <input type="text" class="form-input" id="sup-address" placeholder="Alamat Kantor / Gudang" />
          <button class="btn-primary" type="submit" style="padding: 10px; font-size: 11px;">
            Simpan Supplier
          </button>
        </form>

        <!-- DAFTAR SUPPLIER -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${suppliers.map(s => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 13px; font-weight: 800;">🏢 ${s.name}</div>
                <div style="font-size: 11px; color: var(--primary); margin-top: 2px;">📦 ${s.itemsSupplied}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                  📞 ${s.phone} • ${s.address || '-'}
                </div>
              </div>
              <button class="btn-secondary" data-order-supplier="${s.name}" style="width: auto; padding: 6px 10px; font-size: 11px;">
                PO Stok
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
