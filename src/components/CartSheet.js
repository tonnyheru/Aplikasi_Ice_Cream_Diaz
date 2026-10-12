// Diaz Ice Cream POS - Cart Bottom Sheet Component
export function renderCartSheet(state, db) {
  const cart = state.cart || [];
  const customers = db.getCustomers();
  const settings = db.getSettings();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const selectedCustomerId = state.orderCustomer || '';
  const currentCustomer = customers.find(c => c.id === selectedCustomerId);
  const orderType = state.orderType || 'Dine In';
  const tableNo = state.tableNo || '';

  // Calculate numbers
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Number(state.appliedDiscount || 0);
  const taxRate = settings?.store?.taxEnabled ? (settings?.store?.taxRate || 10) : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * (taxRate / 100));
  const grandTotal = taxableAmount + tax;

  return `
    <div class="bottom-sheet" id="cart-sheet-content">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3>Pesanan Aktif (${cart.reduce((s, i) => s + i.qty, 0)})</h3>
          ${cart.length > 0 ? `
            <button id="btn-clear-cart" style="font-size: 11px; color: #EF4444; background: none; border: none; font-weight: 700; cursor: pointer;">
              Kosongkan
            </button>
          ` : ''}
        </div>
        <button class="sheet-close-btn" id="btn-close-cart-sheet">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- 1. Order Type Selection -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: var(--bg-surface-subtle); padding: 4px; border-radius: var(--radius-md);">
          <button class="chart-tab-btn ${orderType === 'Dine In' ? 'active' : ''}" data-order-type="Dine In">
            🍽️ Dine In
          </button>
          <button class="chart-tab-btn ${orderType === 'Take Away' ? 'active' : ''}" data-order-type="Take Away">
            🥡 Take Away
          </button>
          <button class="chart-tab-btn ${orderType === 'Delivery' ? 'active' : ''}" data-order-type="Delivery">
            🛵 Delivery
          </button>
        </div>

        ${orderType === 'Dine In' ? `
          <div class="form-group" style="margin-top: -6px;">
            <input 
              type="text" 
              class="form-input" 
              id="input-table-no" 
              placeholder="Nomor Meja (Contoh: 04 / Bar)" 
              value="${tableNo}"
            />
          </div>
        ` : ''}

        <!-- 2. Customer & Loyalty Selector -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1;">
            <select class="form-select" id="select-customer">
              <option value="">👤 Pelanggan Umum (Tanpa Member)</option>
              ${customers.map(c => `
                <option value="${c.id}" ${selectedCustomerId === c.id ? 'selected' : ''}>
                  ⭐ ${c.name} (${c.points} Poin)
                </option>
              `).join('')}
            </select>
          </div>
          <button class="header-btn" id="btn-add-quick-customer" title="Tambah Pelanggan Baru">+</button>
        </div>

        ${currentCustomer ? `
          <div style="background: #EFF6FF; border: 1px solid #DBEAFE; border-radius: var(--radius-md); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 11px; color: #1E40AF;">
              <strong>${currentCustomer.name}</strong> • Saldo: <strong>${currentCustomer.points} Poin</strong>
            </div>
            ${currentCustomer.points >= 50 && discount === 0 ? `
              <button id="btn-redeem-points" style="font-size: 10px; padding: 4px 8px; background: #2563EB; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
                Tukar 50 Poin (-Rp 5.000)
              </button>
            ` : ''}
          </div>
        ` : ''}

        <!-- 3. Cart Items List -->
        ${cart.length > 0 ? `
          <div class="cart-items-list">
            ${cart.map((item, idx) => `
              <div class="cart-item-row">
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-meta">
                    Ukuran: <strong>${item.size || 'Regular'}</strong>
                    ${item.variants?.length ? ` • Rasa: ${item.variants.join(', ')}` : ''}
                    ${item.toppings?.length ? ` • Top: ${item.toppings.map(t => t.name || t).join(', ')}` : ''}
                    ${item.note ? ` • <span style="color: var(--primary);">"${item.note}"</span>` : ''}
                  </div>
                  <div class="cart-item-price">${formatRp(item.price * item.qty)}</div>
                </div>

                <div class="cart-qty-stepper">
                  <button class="qty-step-btn" data-cart-minus="${idx}">&minus;</button>
                  <span class="qty-val">${item.qty}</span>
                  <button class="qty-step-btn" data-cart-plus="${idx}">&plus;</button>
                </div>

                <button 
                  data-cart-remove="${idx}" 
                  style="border: none; background: none; color: #94A3B8; font-size: 16px; cursor: pointer; padding: 4px;"
                  title="Hapus Item"
                >
                  &times;
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
            <div style="font-size: 32px; margin-bottom: 6px;">🛒</div>
            <div style="font-weight: 700;">Keranjang Masih Kosong</div>
            <p style="font-size: 11px; margin-top: 2px;">Pilih menu es krim untuk menambahkan pesanan.</p>
          </div>
        `}

        <!-- 4. Voucher & Discount Code -->
        ${cart.length > 0 ? `
          <div style="display: flex; gap: 8px; align-items: center;">
            <input 
              type="text" 
              class="form-input" 
              id="input-voucher-code" 
              placeholder="Kode Voucher (cth: WELCOME10 / MANIS5K)"
              value="${state.appliedPromoCode || ''}"
              style="text-transform: uppercase;"
            />
            <button class="btn-secondary" id="btn-apply-voucher" style="width: auto; padding: 10px 16px; white-space: nowrap;">
              Pakai
            </button>
          </div>

          <!-- 5. Calculation Summary -->
          <div class="calc-summary-card">
            <div class="calc-row">
              <span>Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} item)</span>
              <span>${formatRp(subtotal)}</span>
            </div>
            ${discount > 0 ? `
              <div class="calc-row" style="color: #059669; font-weight: 700;">
                <span>Diskon (${state.appliedPromoCode || 'Promo'})</span>
                <span>-${formatRp(discount)}</span>
              </div>
            ` : ''}
            ${taxRate > 0 ? `
              <div class="calc-row">
                <span>Pajak Resto PB1 (${taxRate}%)</span>
                <span>${formatRp(tax)}</span>
              </div>
            ` : ''}
            <div class="calc-row total-row">
              <span>TOTAL BAYAR</span>
              <span class="price">${formatRp(grandTotal)}</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Footer Buttons -->
      ${cart.length > 0 ? `
        <div class="sheet-footer" style="display: flex; gap: 10px;">
          <button class="btn-secondary" id="btn-hold-order" style="flex: 1;" title="Simpan pesanan sementara">
            ⏸️ Simpan Order
          </button>
          <button class="btn-primary" id="btn-proceed-checkout" style="flex: 2;">
            <span>Bayar</span>
            <span>•</span>
            <span>${formatRp(grandTotal)}</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;
}
