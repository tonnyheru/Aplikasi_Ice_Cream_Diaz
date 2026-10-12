// Diaz Ice Cream POS - More Menu & Settings Navigation Component
export function renderMoreView(state, db) {
  const currentUser = db.getCurrentUser();
  const activeShift = db.getActiveShift();
  const settings = db.getSettings();

  const menuSections = [
    {
      title: 'Operasional Kasir',
      items: [
        {
          id: 'menu-shift',
          icon: '⏱️',
          label: 'Manajemen Shift Kasir',
          desc: activeShift ? 'Shift Sedang Berjalan (Buka)' : 'Buka Shift Baru',
          badge: activeShift ? 'Aktif' : 'Tutup',
          badgeClass: activeShift ? 'success' : 'warning'
        },
        {
          id: 'menu-expenses',
          icon: '💸',
          label: 'Catat Pengeluaran Operasional',
          desc: 'Bahan baku, listrik, kemasan, gaji, dll.',
          badge: null
        },
        {
          id: 'menu-promos',
          icon: '🏷️',
          label: 'Promo, Diskon & Voucher',
          desc: 'Kelola diskon belanja dan kode promo',
          badge: null
        }
      ]
    },
    {
      title: 'Relasi Bisnis & CRM',
      items: [
        {
          id: 'menu-customers',
          icon: '👥',
          label: 'Pelanggan & Poin Loyalitas',
          desc: 'Daftar member, tukar poin diskon',
          badge: null
        },
        {
          id: 'menu-suppliers',
          icon: '🏢',
          label: 'Daftar Supplier Mitra',
          desc: 'Penyuplai es krim, kemasan & topping',
          badge: null
        }
      ]
    },
    {
      title: 'Sistem & Konfigurasi',
      items: [
        {
          id: 'menu-settings',
          icon: '⚙️',
          label: 'Pengaturan Toko & Printer',
          desc: 'Nama toko, pajak PB1, format struk, bluetooth',
          badge: null
        },
        {
          id: 'menu-backup',
          icon: '💾',
          label: 'Cadangkan / Backup Data (JSON)',
          desc: 'Ekspor atau pulihkan database offline',
          badge: null
        },
        {
          id: 'menu-manage-users',
          icon: '👥',
          label: 'Kelola Akun Kasir & Hak Akses',
          desc: 'Tambah kasir baru, atur role & kelola PIN',
          badge: `${db.getUsers().length} Akun`,
          badgeClass: 'info'
        },
        {
          id: 'menu-switch-user',
          icon: '🔐',
          label: 'Ganti Kasir / Login Akun Lain',
          desc: `Sedang aktif: ${currentUser?.name || 'Kasir'} (${currentUser?.role})`,
          badge: currentUser?.role === 'admin' ? 'Owner' : 'Kasir',
          badgeClass: 'info'
        },
        {
          id: 'menu-lock-screen',
          icon: '🔒',
          label: 'Kunci Layar Kasir (Logout)',
          desc: 'Kunci aplikasi dan kembali ke halaman login PIN',
          badge: 'Logout',
          badgeClass: 'warning'
        }
      ]
    }
  ];

  return `
    <div class="view-container">
      <!-- Active User Profile Card -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: var(--shadow-sm);">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 26px;">
          ${currentUser?.avatar || '🍨'}
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 15px; font-weight: 800;">${currentUser?.name}</h3>
          <p style="font-size: 11px; color: var(--text-muted);">${currentUser?.title || 'Kasir Toko'} • Role: ${currentUser?.role?.toUpperCase()}</p>
        </div>
        <button class="btn-secondary" id="btn-quick-logout" style="width: auto; padding: 6px 14px; font-size: 11px; background: var(--primary-light); color: var(--primary); border: 1px solid var(--primary); font-weight: 700;">
          🔒 Kunci Kasir
        </button>
      </div>

      <!-- Menu Sections -->
      ${menuSections.map(section => `
        <div>
          <div class="option-group-title" style="margin-bottom: 6px;">${section.title}</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${section.items.map(item => `
              <div 
                class="more-menu-item" 
                id="${item.id}"
                style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s;"
              >
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 20px;">${item.icon}</span>
                  <div>
                    <div style="font-size: 13px; font-weight: 800;">${item.label}</div>
                    <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px;">${item.desc}</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  ${item.badge ? `<span class="tag-badge ${item.badgeClass || 'info'}">${item.badge}</span>` : ''}
                  <span style="color: var(--text-light); font-size: 14px;">&rarr;</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <!-- App Version & Offline Indicator -->
      <div style="text-align: center; padding: 16px 0; font-size: 11px; color: var(--text-muted);">
        Diaz Ice Cream POS v1.0.0 (Offline-First Ready)
        <br>
        Database Lokal Aktif • Autosave IndexedDB/LocalStorage
      </div>
    </div>
  `;
}
