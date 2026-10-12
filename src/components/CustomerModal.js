// Diaz Ice Cream POS - Customers CRM & Loyalty Component
export function renderCustomerModal(db) {
  const customers = db.getCustomers();
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  return `
    <div class="bottom-sheet" id="customer-sheet-content" style="max-height: 90vh;">
      <div class="sheet-handle-bar"></div>
      <div class="sheet-header">
        <div>
          <h3>Pelanggan & Poin Loyalitas</h3>
          <span style="font-size: 11px; color: var(--text-muted);">${customers.length} member terdaftar</span>
        </div>
        <button class="sheet-close-btn" id="btn-close-customer">&times;</button>
      </div>

      <div class="sheet-body">
        <!-- FORM DAFTAR PELANGGAN BARU -->
        <form id="form-add-customer" style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 12px; font-weight: 800; color: var(--text-main);">+ Registrasi Member Baru</div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <input 
              type="text" 
              class="form-input" 
              id="cust-new-name" 
              placeholder="Nama Pelanggan *" 
              required
            />
            <input 
              type="tel" 
              class="form-input" 
              id="cust-new-phone" 
              placeholder="No. WhatsApp/HP *" 
              required
            />
          </div>

          <input 
            type="email" 
            class="form-input" 
            id="cust-new-email" 
            placeholder="Email (Opsional)"
          />

          <button class="btn-primary" type="submit" style="padding: 10px; font-size: 11px;">
            <span>Simpan Member Baru</span>
          </button>
        </form>

        <!-- LIST PELANGGAN -->
        <div>
          <div class="option-group-title">Daftar Member & Saldo Poin</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${customers.map(cust => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                    <span>⭐ ${cust.name}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                    📱 ${cust.phone} • ${cust.totalOrders || 0}x Order (${formatRp(cust.totalSpent || 0)})
                  </div>
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 14px; font-weight: 900; color: var(--primary); font-family: var(--font-mono);">
                    ${cust.points || 0} Poin
                  </div>
                  <div style="font-size: 9px; color: var(--text-muted);">
                    Nilai: ${formatRp((cust.points || 0) * 100)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
