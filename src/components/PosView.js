// Diaz Ice Cream POS - Point of Sale (Kasir) Component

export function renderPosView(state, db) {
  const products = db.getProducts();
  const categories = db.getCategories();
  const cart = state.cart || [];
  const currentCategory = state.selectedCategory || 'all';
  const searchQuery = (state.searchQuery || '').toLowerCase();

  // Filter products by category & search
  const filteredProducts = products.filter(p => {
    const matchCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) ||
      (p.code && p.code.toLowerCase().includes(searchQuery)) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchCategory && matchSearch && p.isAvailable !== false;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  return `
    <div class="view-container">
      <!-- Search & Barcode Bar -->
      <div class="pos-search-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            id="pos-search-input" 
            placeholder="Cari es krim, rasa, atau kode..." 
            value="${state.searchQuery || ''}"
          />
        </div>
        <button class="barcode-scan-btn" id="btn-scan-barcode" title="Scan Barcode / SKU">
          📷
        </button>
      </div>

      <!-- Category Pills -->
      <div class="category-pills-bar">
        ${categories.map(cat => `
          <button 
            class="category-pill ${currentCategory === cat.id ? 'active' : ''}" 
            data-category-id="${cat.id}"
          >
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Product Catalog Grid -->
      <div class="products-grid">
        ${filteredProducts.length > 0 ? filteredProducts.map(product => `
          <div class="product-card" data-product-id="${product.id}">
            <div class="product-card-img-wrap">
              <img 
                src="${product.image || '/images/sundae_chocolate.jpg'}" 
                alt="${product.name}" 
                class="product-card-img"
                loading="lazy"
                onerror="this.src='/images/sundae_chocolate.jpg'"
              />
              <span class="product-category-tag">${product.category.toUpperCase()}</span>
            </div>
            <div class="product-card-body">
              <h4 class="product-title">${product.name}</h4>
              <div class="product-price-row">
                <span class="product-price">${formatRp(product.basePrice)}</span>
                <button class="product-add-btn" data-quick-add="${product.id}" title="Tambah">+</button>
              </div>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: var(--text-muted);">
            <div style="font-size: 40px; margin-bottom: 10px;">🍨</div>
            <div style="font-weight: 700; font-size: 14px;">Tidak ada menu es krim yang cocok</div>
            <p style="font-size: 12px; margin-top: 4px;">Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        `}
      </div>
    </div>

    <!-- Floating Action Button for Cart Drawer -->
    ${cartItemsCount > 0 ? `
      <button class="floating-cart-btn" id="btn-open-cart">
        <span class="cart-count-badge">${cartItemsCount}</span>
        <span>Pesanan • ${formatRp(cartSubtotal)}</span>
        <span>&rarr;</span>
      </button>
    ` : ''}
  `;
}
