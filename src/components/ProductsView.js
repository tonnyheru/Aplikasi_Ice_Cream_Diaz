// Diaz Ice Cream POS - Products Catalog Management Component
export function renderProductsView(state, db) {
  const products = db.getProducts();
  const categories = db.getCategories();
  const ingredients = db.getIngredients();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  const searchQuery = (state.productSearch || '').toLowerCase();
  const selectedCat = state.productCatFilter || 'all';

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) ||
      (p.code && p.code.toLowerCase().includes(searchQuery)) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchCat && matchSearch;
  });

  return `
    <div class="view-container">
      <!-- Header bar with Add Button -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 18px; font-weight: 800; font-family: var(--font-display);">Katalog Produk Menu</h2>
          <p style="font-size: 11px; color: var(--text-muted);">${products.length} menu aktif terdaftar</p>
        </div>
        <button class="btn-primary" id="btn-open-add-product" style="width: auto; padding: 10px 16px; font-size: 12px;">
          + Tambah Menu
        </button>
      </div>

      <!-- Search & Category Filters -->
      <div class="pos-search-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            id="input-search-products" 
            placeholder="Cari nama menu, SKU, barcode..."
            value="${state.productSearch || ''}"
          />
        </div>
      </div>

      <div class="category-pills-bar">
        ${categories.map(cat => `
          <button 
            class="category-pill ${selectedCat === cat.id ? 'active' : ''}" 
            data-prod-cat="${cat.id}"
          >
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Products List -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${filtered.length > 0 ? filtered.map(p => {
          const margin = p.basePrice > 0 ? Math.round(((p.basePrice - (p.costPrice || 0)) / p.basePrice) * 100) : 0;
          const recipeCount = p.recipe?.length || 0;

          return `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; gap: 12px; box-shadow: var(--shadow-sm);">
              <img 
                src="${p.image || '/images/sundae_chocolate.jpg'}" 
                style="width: 72px; height: 72px; border-radius: 12px; object-fit: cover; flex-shrink: 0;"
                onerror="this.src='/images/sundae_chocolate.jpg'"
              />
              <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h4 style="font-size: 13px; font-weight: 800;">${p.name}</h4>
                    <span style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">
                      SKU: ${p.code || '-'} • Barcode: ${p.barcode || '-'}
                    </span>
                  </div>
                  <span class="tag-badge ${p.isAvailable !== false ? 'success' : 'danger'}">
                    ${p.isAvailable !== false ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 2px;">
                  <span style="font-size: 14px; font-weight: 800; color: var(--primary); font-family: var(--font-mono);">
                    ${formatRp(p.basePrice)}
                  </span>
                  <span style="font-size: 10px; color: var(--text-muted);">
                    HPP: ${formatRp(p.costPrice || 0)} (Margin: ${margin}%)
                  </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 6px; border-top: 1px dashed var(--border-color);">
                  <span style="font-size: 10px; color: #4F46E5; font-weight: 700;">
                    🧪 Resep BOM: ${recipeCount} Bahan Terhubung
                  </span>
                  <div style="display: flex; gap: 6px;">
                    <button class="header-btn" data-edit-product="${p.id}" style="width: 28px; height: 28px; font-size: 12px;" title="Edit">
                      ✏️
                    </button>
                    <button class="header-btn" data-delete-product="${p.id}" style="width: 28px; height: 28px; font-size: 12px; color: #EF4444;" title="Hapus">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('') : `
          <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
            <div style="font-size: 32px; margin-bottom: 6px;">🍨</div>
            <div style="font-weight: 700;">Tidak ada produk ditemukan</div>
          </div>
        `}
      </div>
    </div>
  `;
}
