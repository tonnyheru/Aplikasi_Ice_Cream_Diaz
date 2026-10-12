// Diaz Ice Cream POS - Variant & Toppings Customizer Modal
export function renderVariantModal(product, db, currentSelection) {
  if (!product) return '';

  const flavors = db.getFlavors();
  const sizes = db.getSizes();
  const toppings = db.getToppings();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const selectedSize = currentSelection?.size || sizes[0];
  const selectedFlavors = currentSelection?.flavors || [flavors[0]];
  const selectedToppings = currentSelection?.toppings || [];
  const currentQty = currentSelection?.qty || 1;
  const currentNote = currentSelection?.note || '';

  // Calculate unit price
  const sizeOffset = selectedSize.priceOffset || 0;
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0);
  const unitPrice = product.basePrice + sizeOffset + toppingTotal;
  const grandItemTotal = unitPrice * currentQty;

  return `
    <div class="bottom-sheet" id="variant-sheet-content">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>${product.name}</h3>
          <span style="font-size: 11px; color: var(--text-muted);">${product.category.toUpperCase()} • Resep Terintegrasi</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-variant-modal">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- Product Thumbnail & Quick Info -->
        <div style="display: flex; gap: 12px; align-items: center; background: var(--bg-surface-subtle); padding: 10px; border-radius: var(--radius-md);">
          <img 
            src="${product.image || '/images/sundae_chocolate.jpg'}" 
            style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover;" 
            onerror="this.src='/images/sundae_chocolate.jpg'"
          />
          <div style="flex: 1;">
            <div style="font-size: 11px; color: var(--text-muted); line-height: 1.3;">${product.description || 'Pilihan es krim favorit diaz.'}</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--primary); font-family: var(--font-mono); margin-top: 4px;">
              Harga Dasar: ${formatRp(product.basePrice)}
            </div>
          </div>
        </div>

        <!-- 1. Size Selection -->
        <div>
          <div class="option-group-title">1. Pilih Ukuran Porsi</div>
          <div class="options-pill-grid">
            ${sizes.map(size => `
              <div 
                class="option-select-pill size-option ${selectedSize.id === size.id ? 'selected' : ''}" 
                data-size-id="${size.id}"
              >
                <span>${size.name}</span>
                ${size.priceOffset > 0 ? `<span style="font-size: 10px; opacity: 0.8;">(+${formatRp(size.priceOffset)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. Flavor Selection -->
        <div>
          <div class="option-group-title">2. Pilih Varian Rasa Es Krim</div>
          <div class="options-pill-grid">
            ${flavors.map(flavor => {
              const isSelected = selectedFlavors.some(f => f.id === flavor.id);
              return `
                <div 
                  class="option-select-pill flavor-option ${isSelected ? 'selected' : ''}" 
                  data-flavor-id="${flavor.id}"
                >
                  <span class="flavor-dot" style="background: ${flavor.color};"></span>
                  <span>${flavor.name}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. Topping Selection -->
        <div>
          <div class="option-group-title">3. Topping Tambahan (Opsional)</div>
          <div class="options-pill-grid">
            ${toppings.map(topping => {
              const isSelected = selectedToppings.some(t => t.id === topping.id);
              return `
                <div 
                  class="option-select-pill topping-option ${isSelected ? 'selected' : ''}" 
                  data-topping-id="${topping.id}"
                >
                  <span>${topping.icon}</span>
                  <span>${topping.name}</span>
                  <span style="font-size: 10px; color: var(--primary); font-weight: 800;">+${formatRp(topping.price)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. Notes & Special Requests -->
        <div class="form-group">
          <label class="form-label">Catatan Pesanan Khusus</label>
          <input 
            type="text" 
            class="form-input" 
            id="variant-order-note" 
            placeholder="Contoh: Saus dipisah, sendok 2, kurangi manis..."
            value="${currentNote}"
          />
        </div>

        <!-- 5. Quantity Stepper -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0;">
          <span style="font-weight: 700; font-size: 13px;">Jumlah Item:</span>
          <div class="cart-qty-stepper">
            <button class="qty-step-btn" id="btn-qty-minus">&minus;</button>
            <span class="qty-val" id="variant-qty-val">${currentQty}</span>
            <button class="qty-step-btn" id="btn-qty-plus">&plus;</button>
          </div>
        </div>
      </div>

      <div class="sheet-footer">
        <button class="btn-primary" id="btn-add-to-cart-confirmed">
          <span>Tambah ke Pesanan</span>
          <span>•</span>
          <span id="variant-btn-total">${formatRp(grandItemTotal)}</span>
        </button>
      </div>
    </div>
  `;
}
