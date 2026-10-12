// Diaz Ice Cream POS - Inventory & Raw Materials Component
export function renderInventoryView(state, db) {
  const ingredients = db.getIngredients();
  const movements = db.getStockMovements();
  const activeTab = state.inventoryTab || 'stock'; // 'stock' or 'movements'
  const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const lowStockCount = ingredients.filter(i => i.stock <= i.minStock).length;
  const totalStockValue = ingredients.reduce((sum, i) => sum + (i.stock * (i.costPrice || 0)), 0);

  return `
    <div class="view-container">
      <!-- Header bar with summary & action -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 18px; font-weight: 800; font-family: var(--font-display);">Inventaris & Bahan Baku</h2>
          <p style="font-size: 11px; color: var(--text-muted);">
            Nilai Aset: <strong>${formatRp(totalStockValue)}</strong> • ${lowStockCount} Menipis
          </p>
        </div>
        <button class="btn-primary" id="btn-open-restock-modal" style="width: auto; padding: 10px 14px; font-size: 12px;">
          + Restock Masuk
        </button>
      </div>

      <!-- Navigation Tabs: Stok vs Mutasi -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; background: var(--bg-surface-subtle); padding: 4px; border-radius: var(--radius-md);">
        <button class="chart-tab-btn ${activeTab === 'stock' ? 'active' : ''}" data-inv-tab="stock">
          📦 Stok Bahan Baku (${ingredients.length})
        </button>
        <button class="chart-tab-btn ${activeTab === 'movements' ? 'active' : ''}" data-inv-tab="movements">
          🔄 Riwayat Mutasi Stok
        </button>
      </div>

      ${activeTab === 'stock' ? `
        <!-- Ingredients Stock List -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${ingredients.map(ing => {
            const isCritical = ing.stock <= 0;
            const isWarning = ing.stock <= ing.minStock;
            const statusClass = isCritical ? 'danger' : (isWarning ? 'warning' : 'success');
            const statusText = isCritical ? 'Habis' : (isWarning ? 'Menipis' : 'Aman');

            return `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h4 style="font-size: 13px; font-weight: 800;">${ing.name}</h4>
                    <span style="font-size: 10px; color: var(--text-muted);">
                      Kategori: ${ing.category} • Supplier: ${ing.supplierName || 'Umum'}
                    </span>
                  </div>
                  <span class="tag-badge ${statusClass}">
                    ${statusText}
                  </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: baseline; background: var(--bg-surface-subtle); padding: 8px 10px; border-radius: var(--radius-sm);">
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted);">Sisa Stok:</span>
                    <span style="font-size: 16px; font-weight: 900; font-family: var(--font-mono); margin-left: 4px; color: ${isWarning ? '#DC2626' : 'var(--text-main)'};">
                      ${ing.stock} ${ing.unit}
                    </span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted);">
                    Min. Stok: <strong>${ing.minStock} ${ing.unit}</strong> • Modal: ${formatRp(ing.costPrice)}/${ing.unit}
                  </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px;">
                  <button class="btn-secondary" data-quick-restock-ing="${ing.id}" style="width: auto; padding: 6px 12px; font-size: 11px;">
                    + Tambah Stok
                  </button>
                  <button class="btn-secondary" data-adjust-ing="${ing.id}" style="width: auto; padding: 6px 12px; font-size: 11px; color: var(--text-muted);">
                    ⚙️ Koreksi Fisik
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- Stock Movements Audit History -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${movements.length > 0 ? movements.map(m => {
            const isIn = m.type === 'in';
            return `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isIn ? '#ECFDF5' : '#FEF2F2'}; color: ${isIn ? '#059669' : '#DC2626'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">
                    ${isIn ? '↓' : '↑'}
                  </div>
                  <div>
                    <div style="font-size: 12px; font-weight: 800;">${m.ingredientName}</div>
                    <div style="font-size: 10px; color: var(--text-muted);">
                      ${m.reference || 'Mutasi'} • ${new Date(m.date).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 14px; font-weight: 800; font-family: var(--font-mono); color: ${isIn ? '#059669' : '#DC2626'};">
                    ${isIn ? '+' : '-'}${m.qty} ${m.unit}
                  </div>
                  <div style="font-size: 9px; color: var(--text-muted);">${m.userName || 'Sistem'}</div>
                </div>
              </div>
            `;
          }).join('') : `
            <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
              Belum ada pergerakan stok tercatat.
            </div>
          `}
        </div>
      `}
    </div>
  `;
}
