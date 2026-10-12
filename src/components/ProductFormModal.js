// Diaz Ice Cream POS - Product Form Modal (Add / Edit)
export function renderProductFormModal(product, db) {
  const categories = db.getCategories().filter(c => c.id !== 'all');
  const ingredients = db.getIngredients();
  const isEdit = Boolean(product && product.id);

  const presetImages = [
    { label: 'Sundae Coklat', url: '/images/sundae_chocolate.jpg' },
    { label: 'Vanilla Cone', url: '/images/vanilla_cone.jpg' },
    { label: 'Strawberry Matcha Cup', url: '/images/strawberry_matcha.jpg' },
    { label: 'Waffle Supreme', url: '/images/waffle_icecream.jpg' }
  ];

  return `
    <div class="bottom-sheet" id="product-form-sheet" style="max-height: 92vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <h3>${isEdit ? 'Edit Menu Ice Cream' : 'Tambah Menu Baru'}</h3>
        <button class="sheet-close-btn" id="btn-close-product-form">&times;</button>
      </div>

      <div class="sheet-body">
        <form id="form-product-save" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="hidden" id="prod-id" value="${product?.id || ''}" />

          <div class="form-group">
            <label class="form-label">Nama Menu / Produk *</label>
            <input 
              type="text" 
              class="form-input" 
              id="prod-name" 
              required 
              placeholder="Contoh: Triple Chocolate Sundae" 
              value="${product?.name || ''}"
            />
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="form-group">
              <label class="form-label">Kategori *</label>
              <select class="form-select" id="prod-category" required>
                ${categories.map(c => `
                  <option value="${c.id}" ${product?.category === c.id ? 'selected' : ''}>
                    ${c.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kode SKU</label>
              <input 
                type="text" 
                class="form-input" 
                id="prod-code" 
                placeholder="IC-009" 
                value="${product?.code || ''}"
              />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="form-group">
              <label class="form-label">Harga Jual (Rp) *</label>
              <input 
                type="number" 
                class="form-input" 
                id="prod-price" 
                required 
                placeholder="25000" 
                value="${product?.basePrice || ''}"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Harga Modal / HPP (Rp)</label>
              <input 
                type="number" 
                class="form-input" 
                id="prod-cost" 
                placeholder="9500" 
                value="${product?.costPrice || ''}"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Barcode EAN / Scanner</label>
            <input 
              type="text" 
              class="form-input" 
              id="prod-barcode" 
              placeholder="8991001008" 
              value="${product?.barcode || ''}"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pilih Foto Menu</label>
            <select class="form-select" id="prod-image-select">
              ${presetImages.map(img => `
                <option value="${img.url}" ${product?.image === img.url ? 'selected' : ''}>
                  ${img.label}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Deskripsi Menu</label>
            <textarea 
              class="form-textarea" 
              id="prod-desc" 
              rows="2" 
              placeholder="Keterangan singkat rasa dan topping..."
            >${product?.description || ''}</textarea>
          </div>

          <!-- Recipe / BOM Builder Section -->
          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 800; color: #4338CA;">🧪 Resep Bill of Materials (BOM)</span>
              <span style="font-size: 10px; color: var(--text-muted);">Stok berkurang otomatis saat terjual</span>
            </div>

            <div id="recipe-items-container" style="display: flex; flex-direction: column; gap: 8px;">
              ${(product?.recipe || [
                { ingredientId: 'ing_vanilla', qty: 1, unit: 'scoop' },
                { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' }
              ]).map((rec, rIdx) => `
                <div class="recipe-row" style="display: flex; gap: 6px; align-items: center;">
                  <select class="form-select recipe-ing-select" style="flex: 2; font-size: 11px;">
                    ${ingredients.map(ing => `
                      <option value="${ing.id}" data-unit="${ing.unit}" ${rec.ingredientId === ing.id ? 'selected' : ''}>
                        ${ing.name} (${ing.unit})
                      </option>
                    `).join('')}
                  </select>
                  <input 
                    type="number" 
                    step="0.1" 
                    class="form-input recipe-qty-input" 
                    style="flex: 1; font-size: 12px; padding: 6px;" 
                    value="${rec.qty}"
                    placeholder="Qty"
                  />
                  <button type="button" class="btn-remove-recipe-row" style="background: none; border: none; color: #EF4444; font-size: 16px; cursor: pointer;">
                    &times;
                  </button>
                </div>
              `).join('')}
            </div>

            <button type="button" id="btn-add-recipe-row" class="btn-secondary" style="margin-top: 8px; padding: 6px 12px; font-size: 11px;">
              + Tambah Komponen Bahan Resep
            </button>
          </div>
        </form>
      </div>

      <div class="sheet-footer">
        <button class="btn-primary" id="btn-submit-product-form">
          <span>💾 Simpan Produk Menu</span>
        </button>
      </div>
    </div>
  `;
}
