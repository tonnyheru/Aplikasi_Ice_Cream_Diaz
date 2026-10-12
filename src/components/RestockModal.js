// Diaz Ice Cream POS - Restock from Supplier Modal Component
export function renderRestockModal(preselectedIngredientId, db) {
  const ingredients = db.getIngredients();
  const suppliers = db.getSuppliers();
  const targetIng = ingredients.find(i => i.id === preselectedIngredientId) || ingredients[0];

  return `
    <div class="bottom-sheet" id="restock-sheet" style="max-height: 85vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <h3>+ Tambah Stok Masuk (Restock Supplier)</h3>
        <button class="sheet-close-btn" id="btn-close-restock">&times;</button>
      </div>

      <div class="sheet-body">
        <form id="form-restock-submit" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Pilih Bahan Baku *</label>
            <select class="form-select" id="restock-ingredient-id" required>
              ${ingredients.map(ing => `
                <option value="${ing.id}" ${ing.id === targetIng?.id ? 'selected' : ''}>
                  ${ing.name} (Sisa: ${ing.stock} ${ing.unit})
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="form-group">
              <label class="form-label">Jumlah Tambahan *</label>
              <input 
                type="number" 
                step="0.1" 
                class="form-input" 
                id="restock-qty" 
                required 
                placeholder="Contoh: 50" 
              />
            </div>

            <div class="form-group">
              <label class="form-label">Harga Beli / Satuan (Rp)</label>
              <input 
                type="number" 
                class="form-input" 
                id="restock-price" 
                placeholder="2500" 
                value="${targetIng?.costPrice || ''}"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Supplier Pengirim</label>
            <select class="form-select" id="restock-supplier-name">
              <option value="">-- Pilih Supplier --</option>
              ${suppliers.map(s => `
                <option value="${s.name}">${s.name}</option>
              `).join('')}
              <option value="Toko Pasar / Swalayan">Toko Pasar / Swalayan</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Catatan Pembelian / No. Faktur</label>
            <input 
              type="text" 
              class="form-input" 
              id="restock-notes" 
              placeholder="Contoh: Faktur PO-9081 / Restock mingguan"
            />
          </div>

          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 10px; border-radius: var(--radius-md); font-size: 11px; color: #1E40AF;">
            💡 <strong>Otomatisasi:</strong> Stok bahan baku akan bertambah, mutasi tercatat di audit log, dan total pembelian akan otomatis dibukukan ke modul Pengeluaran Toko.
          </div>
        </form>
      </div>

      <div class="sheet-footer">
        <button class="btn-primary" id="btn-submit-restock">
          <span>Konfirmasi Tambah Stok</span>
        </button>
      </div>
    </div>
  `;
}
