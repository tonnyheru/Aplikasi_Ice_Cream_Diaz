// Diaz Ice Cream POS - Main Application Controller
import confetti from 'canvas-confetti';
import { db } from './db/storage.js';
import { sound } from './services/audio.js';
import { qris } from './services/qris.js';
import { printer } from './services/printer.js';
import { exportService } from './services/export.js';

import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderDashboardView } from './components/DashboardView.js';
import { initSalesChart } from './components/DashboardChart.js';
import { renderPosView } from './components/PosView.js';
import { renderVariantModal } from './components/VariantModal.js';
import { renderCartSheet } from './components/CartSheet.js';
import { renderCheckoutModal } from './components/CheckoutModal.js';
import { renderReceiptModal } from './components/ReceiptModal.js';
import { renderProductsView } from './components/ProductsView.js';
import { renderProductFormModal } from './components/ProductFormModal.js';
import { renderInventoryView } from './components/InventoryView.js';
import { renderRestockModal } from './components/RestockModal.js';
import { renderTransactionsView } from './components/TransactionsView.js';
import { renderReportsView } from './components/ReportsView.js';
import { renderMoreView } from './components/MoreView.js';
import { renderShiftModal } from './components/ShiftModal.js';
import { renderExpenseModal } from './components/ExpenseModal.js';
import { renderCustomerModal } from './components/CustomerModal.js';
import { renderSupplierModal } from './components/SupplierModal.js';
import { renderPromoModal } from './components/PromoModal.js';
import { renderSettingsModal } from './components/SettingsModal.js';
import { renderLoginModal } from './components/LoginModal.js';
import { renderLoginView } from './components/LoginView.js';
import { renderUserManagementModal } from './components/UserManagementModal.js';

class PosApp {
  constructor() {
    this.state = {
      currentTab: 'dashboard',
      isFullscreen: false,
      isDarkMode: false,
      cart: [],
      orderType: 'Dine In',
      tableNo: '',
      orderCustomer: '',
      appliedPromoCode: '',
      appliedDiscount: 0,
      activeModal: null, // 'variant', 'cart', 'checkout', 'receipt', 'product_form', 'restock', 'shift', 'expense', 'customer', 'supplier', 'promo', 'settings', 'login', 'manage_users'
      loginSelectedUserId: null,
      loginPinInput: '',
      loginErrorMessage: '',
      selectedProductForVariant: null,
      variantConfig: {
        size: null,
        flavors: [],
        toppings: [],
        note: '',
        qty: 1
      },
      checkoutSummary: null,
      paymentMethod: 'CASH',
      cashTendered: 0,
      qrisStatus: 'pending',
      qrisTimerInterval: null,
      qrisSecondsLeft: 300,
      lastCompletedOrder: null,
      editingProduct: null,
      restockingIngredientId: null,
      searchQuery: '',
      selectedCategory: 'all',
      productSearch: '',
      productCatFilter: 'all',
      inventoryTab: 'stock',
      txSearch: '',
      txDateFilter: 'all',
      txMethodFilter: 'all',
      txStatusFilter: 'all',
      reportPeriod: '7d'
    };

    this.init();
  }

  init() {
    // Subscribe to DB changes
    db.subscribe(() => this.render());

    // Set default selected user for login screen
    const users = db.getUsers();
    if (users.length > 0 && !this.state.loginSelectedUserId) {
      this.state.loginSelectedUserId = users[0].id;
    }

    // Initial render
    this.render();

    // Setup live clock in Android status bar & login screen
    setInterval(() => {
      this.updateStatusBarTime();
      if (!db.getCurrentUser()) {
        this.updateLoginClock();
      }
    }, 1000);
    this.updateStatusBarTime();
  }

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  updateStatusBarTime() {
    const timeEl = document.getElementById('status-bar-time');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Calculate cart summary
  calculateCartSummary() {
    const settings = db.getSettings();
    const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = Number(this.state.appliedDiscount || 0);
    const taxRate = settings?.store?.taxEnabled ? (settings?.store?.taxRate || 10) : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * (taxRate / 100));
    const total = taxableAmount + tax;

    return {
      subtotal,
      discount,
      discountLabel: this.state.appliedPromoCode,
      taxRate,
      tax,
      total,
      items: [...this.state.cart],
      orderType: this.state.orderType,
      tableNo: this.state.tableNo,
      customerId: this.state.orderCustomer,
      customerName: this.state.orderCustomer ? db.getCustomers().find(c => c.id === this.state.orderCustomer)?.name : 'Pelanggan Umum'
    };
  }

  render() {
    const root = document.getElementById('app');
    if (!root) return;

    const currentUser = db.getCurrentUser();

    // IF NOT LOGGED IN -> RENDER FULLSCREEN KASIR LOGIN SCREEN
    if (!currentUser) {
      root.innerHTML = `
        <div class="app-viewport-wrapper">
          <div class="phone-frame ${this.state.isFullscreen ? 'fullscreen' : ''}">
            
            <!-- Android Status Bar -->
            <div class="android-status-bar">
              <span id="status-bar-time">16:20</span>
              <div class="android-notch"></div>
              <div class="status-icons">
                <span>📶 5G</span>
                <span>🔋 98%</span>
              </div>
            </div>

            <!-- Fullscreen Kasir Login Screen -->
            ${renderLoginView(db, this.state.loginSelectedUserId, this.state.loginPinInput, this.state.loginErrorMessage)}
          </div>
        </div>
      `;

      this.bindLoginEvents();
      this.updateLoginClock();
      return;
    }

    const stats = db.getDashboardStats();
    const lowStockCount = stats.lowStockIngredients.length;

    root.innerHTML = `
      <div class="app-viewport-wrapper">
        <div class="phone-frame ${this.state.isFullscreen ? 'fullscreen' : ''}">
          
          <!-- Android Status Bar -->
          <div class="android-status-bar">
            <span id="status-bar-time">16:20</span>
            <div class="android-notch"></div>
            <div class="status-icons">
              <span>📶 5G</span>
              <span>🔋 98%</span>
            </div>
          </div>

          <!-- App Header -->
          ${renderHeader({
            settings: db.getSettings(),
            currentUser: db.getCurrentUser(),
            activeShift: db.getActiveShift(),
            isFullscreen: this.state.isFullscreen,
            isDarkMode: this.state.isDarkMode
          })}

          <!-- Main Content Scroll Area -->
          <main class="app-content" id="main-content">
            ${this.renderCurrentView()}
          </main>

          <!-- Android Bottom Navigation -->
          ${renderBottomNav(this.state.currentTab, lowStockCount)}

          <!-- Active Modal Bottom Sheet Container -->
          <div class="modal-overlay ${this.state.activeModal ? 'active' : ''}" id="app-modal-overlay">
            ${this.renderActiveModal()}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.postRender();
  }

  renderCurrentView() {
    switch (this.state.currentTab) {
      case 'dashboard':
        return renderDashboardView(db);
      case 'pos':
        return renderPosView(this.state, db);
      case 'products':
        return renderProductsView(this.state, db);
      case 'inventory':
        return renderInventoryView(this.state, db);
      case 'reports':
        return renderReportsView(this.state, db);
      case 'more':
        return renderMoreView(this.state, db);
      default:
        return renderDashboardView(db);
    }
  }

  renderActiveModal() {
    switch (this.state.activeModal) {
      case 'variant':
        return renderVariantModal(this.state.selectedProductForVariant, db, this.state.variantConfig);
      case 'cart':
        return renderCartSheet(this.state, db);
      case 'checkout':
        return renderCheckoutModal(this.state.checkoutSummary || this.calculateCartSummary(), this.state);
      case 'receipt':
        return renderReceiptModal(this.state.lastCompletedOrder, db.getSettings());
      case 'product_form':
        return renderProductFormModal(this.state.editingProduct, db);
      case 'restock':
        return renderRestockModal(this.state.restockingIngredientId, db);
      case 'shift':
        return renderShiftModal(db);
      case 'expense':
        return renderExpenseModal(db);
      case 'customer':
        return renderCustomerModal(db);
      case 'supplier':
        return renderSupplierModal(db);
      case 'promo':
        return renderPromoModal(db);
      case 'settings':
        return renderSettingsModal(db);
      case 'login':
        return renderLoginModal(db);
      case 'manage_users':
        return renderUserManagementModal(db);
      default:
        return '';
    }
  }

  postRender() {
    // If Dashboard is active, initialize sales chart
    if (this.state.currentTab === 'dashboard') {
      const canvas = document.getElementById('salesChartCanvas');
      if (canvas) {
        initSalesChart(canvas, '7d', db.getTransactions());
      }
    }

    // If QRIS checkout is active and pending, render real QR canvas
    if (this.state.activeModal === 'checkout' && this.state.paymentMethod === 'QRIS') {
      const qrisCanvas = document.getElementById('qrisCanvas');
      if (qrisCanvas) {
        const total = this.state.checkoutSummary?.total || 10000;
        const tempId = 'DIAZ-TEMP-' + Date.now();
        qris.renderToCanvas(qrisCanvas, total, tempId).catch(console.error);
      }
    }
  }

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab) {
          sound.playBeep();
          this.state.currentTab = tab;
          this.state.activeModal = null;
          this.render();
        }
      });
    });

    // Brand logo home
    const brandHome = document.getElementById('btn-brand-home');
    if (brandHome) {
      brandHome.addEventListener('click', () => {
        this.state.currentTab = 'dashboard';
        this.render();
      });
    }

    // Toggle Frame (Phone simulator vs Fullscreen)
    const toggleFrameBtn = document.getElementById('btn-toggle-frame');
    if (toggleFrameBtn) {
      toggleFrameBtn.addEventListener('click', () => {
        this.state.isFullscreen = !this.state.isFullscreen;
        this.render();
      });
    }

    // Toggle Dark Mode
    const toggleThemeBtn = document.getElementById('btn-toggle-theme');
    if (toggleThemeBtn) {
      toggleThemeBtn.addEventListener('click', () => {
        this.state.isDarkMode = !this.state.isDarkMode;
        document.body.classList.toggle('dark-mode', this.state.isDarkMode);
        this.render();
      });
    }

    // Switch User / Login
    const switchUserBtn = document.getElementById('btn-switch-user');
    if (switchUserBtn) {
      switchUserBtn.addEventListener('click', () => {
        this.state.activeModal = 'login';
        this.render();
      });
    }

    // Header Lock Kasir / Logout
    const headerLockBtn = document.getElementById('btn-header-lock');
    if (headerLockBtn) {
      headerLockBtn.addEventListener('click', () => {
        sound.playBeep();
        db.logout();
        this.state.activeModal = null;
        this.state.loginPinInput = '';
        this.state.loginErrorMessage = '';
        this.showToast('Terminal kasir dikunci. Masukkan PIN untuk membuka.', 'info');
        this.render();
      });
    }

    // Modal overlay click outside to close
    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          // If in QRIS payment, do not close by accident without confirm
          if (this.state.activeModal === 'checkout' && this.state.paymentMethod === 'QRIS') {
            return;
          }
          this.state.activeModal = null;
          this.render();
        }
      });
    }

    // Bind Dashboard Events
    this.bindDashboardEvents();

    // Bind POS Events
    this.bindPosEvents();

    // Bind Modal Events
    this.bindModalEvents();
  }

  bindDashboardEvents() {
    // Quick action buttons on Dashboard
    const qaNewTx = document.getElementById('qa-new-tx');
    if (qaNewTx) {
      qaNewTx.addEventListener('click', () => {
        sound.playBeep();
        this.state.currentTab = 'pos';
        this.render();
      });
    }

    const qaAddProd = document.getElementById('qa-add-prod');
    if (qaAddProd) {
      qaAddProd.addEventListener('click', () => {
        sound.playBeep();
        this.state.editingProduct = null;
        this.state.activeModal = 'product_form';
        this.render();
      });
    }

    const qaAddStock = document.getElementById('qa-add-stock');
    if (qaAddStock) {
      qaAddStock.addEventListener('click', () => {
        sound.playBeep();
        this.state.restockingIngredientId = null;
        this.state.activeModal = 'restock';
        this.render();
      });
    }

    const qaExpense = document.getElementById('qa-expense');
    if (qaExpense) {
      qaExpense.addEventListener('click', () => {
        sound.playBeep();
        this.state.activeModal = 'expense';
        this.render();
      });
    }

    const qaReports = document.getElementById('qa-reports');
    if (qaReports) {
      qaReports.addEventListener('click', () => {
        sound.playBeep();
        this.state.currentTab = 'reports';
        this.render();
      });
    }

    const qaQris = document.getElementById('qa-qris');
    if (qaQris) {
      qaQris.addEventListener('click', () => {
        sound.playBeep();
        this.state.currentTab = 'pos';
        this.render();
        this.showToast('Pilih menu es krim untuk membayar via QRIS', 'info');
      });
    }

    const lowStockBanner = document.getElementById('banner-low-stock');
    if (lowStockBanner) {
      lowStockBanner.addEventListener('click', () => {
        this.state.currentTab = 'inventory';
        this.render();
      });
    }

    const quickNewOrderLink = document.getElementById('btn-quick-new-order');
    if (quickNewOrderLink) {
      quickNewOrderLink.addEventListener('click', () => {
        this.state.currentTab = 'pos';
        this.render();
      });
    }

    const viewAllProdLink = document.getElementById('btn-view-all-products');
    if (viewAllProdLink) {
      viewAllProdLink.addEventListener('click', () => {
        this.state.currentTab = 'products';
        this.render();
      });
    }

    const dashShiftBtn = document.getElementById('btn-dashboard-shift');
    if (dashShiftBtn) {
      dashShiftBtn.addEventListener('click', () => {
        this.state.activeModal = 'shift';
        this.render();
      });
    }

    // Chart Tabs (7d vs 30d)
    const chart7d = document.getElementById('btn-chart-7d');
    const chart30d = document.getElementById('btn-chart-30d');
    if (chart7d && chart30d) {
      chart7d.addEventListener('click', () => {
        chart7d.classList.add('active');
        chart30d.classList.remove('active');
        const canvas = document.getElementById('salesChartCanvas');
        initSalesChart(canvas, '7d', db.getTransactions());
      });
      chart30d.addEventListener('click', () => {
        chart30d.classList.add('active');
        chart7d.classList.remove('active');
        const canvas = document.getElementById('salesChartCanvas');
        initSalesChart(canvas, '30d', db.getTransactions());
      });
    }
  }

  bindPosEvents() {
    // POS Search Input
    const searchInput = document.getElementById('pos-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
          // Re-render just POS view
          this.render();
          const reSearch = document.getElementById('pos-search-input');
          if (reSearch) {
            reSearch.focus();
            reSearch.setSelectionRange(reSearch.value.length, reSearch.value.length);
          }
        }
      });
    }

    // Barcode scanner simulator
    const barcodeBtn = document.getElementById('btn-scan-barcode');
    if (barcodeBtn) {
      barcodeBtn.addEventListener('click', () => {
        sound.playBeep();
        const products = db.getProducts();
        // Pick random product to simulate scan
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        this.showToast(`📷 Barcode Terdeteksi: ${randomProduct.name} (${randomProduct.barcode || '8991001001'})`, 'info');
        this.openVariantCustomizer(randomProduct);
      });
    }

    // Category Pills click
    document.querySelectorAll('.category-pill[data-category-id]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        sound.playBeep();
        this.state.selectedCategory = e.currentTarget.dataset.categoryId;
        this.render();
      });
    });

    // Click Product Card -> Open Variant Customizer
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If quick add "+" button clicked
        if (e.target.closest('[data-quick-add]')) {
          e.stopPropagation();
          const prodId = e.target.closest('[data-quick-add]').dataset.quickAdd;
          const product = db.getProducts().find(p => p.id === prodId);
          if (product) {
            this.quickAddToCart(product);
          }
          return;
        }

        const prodId = card.dataset.productId;
        const product = db.getProducts().find(p => p.id === prodId);
        if (product) {
          sound.playBeep();
          this.openVariantCustomizer(product);
        }
      });
    });

    // Floating Cart Button click -> Open Cart Sheet
    const openCartBtn = document.getElementById('btn-open-cart');
    if (openCartBtn) {
      openCartBtn.addEventListener('click', () => {
        sound.playBeep();
        this.state.activeModal = 'cart';
        this.render();
      });
    }
  }

  openVariantCustomizer(product) {
    const flavors = db.getFlavors();
    const sizes = db.getSizes();

    this.state.selectedProductForVariant = product;
    this.state.variantConfig = {
      size: sizes[0],
      flavors: [flavors[0]],
      toppings: [],
      note: '',
      qty: 1
    };
    this.state.activeModal = 'variant';
    this.render();
  }

  quickAddToCart(product) {
    sound.playBeep();
    const flavors = db.getFlavors();
    const sizes = db.getSizes();

    const existingIdx = this.state.cart.findIndex(i => 
      i.id === product.id &&
      i.size === sizes[0].name &&
      (!i.toppings || i.toppings.length === 0)
    );

    if (existingIdx >= 0) {
      this.state.cart[existingIdx].qty += 1;
    } else {
      this.state.cart.push({
        id: product.id,
        name: product.name,
        size: sizes[0].name,
        price: product.basePrice,
        qty: 1,
        variants: [flavors[0].name],
        toppings: [],
        note: ''
      });
    }

    this.showToast(`${product.name} ditambahkan!`, 'success');
    this.render();
  }

  bindModalEvents() {
    // VARIANT MODAL EVENTS
    const closeVariantBtn = document.getElementById('btn-close-variant-modal');
    if (closeVariantBtn) {
      closeVariantBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    // Size selection
    document.querySelectorAll('.size-option').forEach(el => {
      el.addEventListener('click', (e) => {
        const sizeId = e.currentTarget.dataset.sizeId;
        const size = db.getSizes().find(s => s.id === sizeId);
        if (size) {
          this.state.variantConfig.size = size;
          this.updateVariantModalCalculations();
        }
      });
    });

    // Flavor selection
    document.querySelectorAll('.flavor-option').forEach(el => {
      el.addEventListener('click', (e) => {
        const flavorId = e.currentTarget.dataset.flavorId;
        const flavor = db.getFlavors().find(f => f.id === flavorId);
        if (flavor) {
          const exists = this.state.variantConfig.flavors.some(f => f.id === flavor.id);
          if (exists) {
            if (this.state.variantConfig.flavors.length > 1) {
              this.state.variantConfig.flavors = this.state.variantConfig.flavors.filter(f => f.id !== flavor.id);
            }
          } else {
            this.state.variantConfig.flavors.push(flavor);
          }
          this.updateVariantModalCalculations();
        }
      });
    });

    // Topping selection
    document.querySelectorAll('.topping-option').forEach(el => {
      el.addEventListener('click', (e) => {
        const topId = e.currentTarget.dataset.toppingId;
        const topping = db.getToppings().find(t => t.id === topId);
        if (topping) {
          const exists = this.state.variantConfig.toppings.some(t => t.id === topping.id);
          if (exists) {
            this.state.variantConfig.toppings = this.state.variantConfig.toppings.filter(t => t.id !== topping.id);
          } else {
            this.state.variantConfig.toppings.push(topping);
          }
          this.updateVariantModalCalculations();
        }
      });
    });

    // Qty minus / plus in variant modal
    const btnQtyMinus = document.getElementById('btn-qty-minus');
    const btnQtyPlus = document.getElementById('btn-qty-plus');
    if (btnQtyMinus && btnQtyPlus) {
      btnQtyMinus.addEventListener('click', () => {
        if (this.state.variantConfig.qty > 1) {
          this.state.variantConfig.qty -= 1;
          this.updateVariantModalCalculations();
        }
      });
      btnQtyPlus.addEventListener('click', () => {
        this.state.variantConfig.qty += 1;
        this.updateVariantModalCalculations();
      });
    }

    // Add to cart confirmed button
    const btnAddConfirmed = document.getElementById('btn-add-to-cart-confirmed');
    if (btnAddConfirmed) {
      btnAddConfirmed.addEventListener('click', () => {
        const product = this.state.selectedProductForVariant;
        if (!product) return;

        const noteInput = document.getElementById('variant-order-note');
        const note = noteInput ? noteInput.value.trim() : '';

        const size = this.state.variantConfig.size || db.getSizes()[0];
        const flavors = this.state.variantConfig.flavors;
        const toppings = this.state.variantConfig.toppings;
        const qty = this.state.variantConfig.qty;

        const unitPrice = product.basePrice + (size.priceOffset || 0) + toppings.reduce((s, t) => s + (t.price || 0), 0);

        this.state.cart.push({
          id: product.id,
          name: product.name,
          size: size.name,
          variants: flavors.map(f => f.name),
          toppings: toppings.map(t => ({ name: t.name, price: t.price })),
          price: unitPrice,
          qty: qty,
          note: note
        });

        sound.playBeep();
        this.showToast(`${qty}x ${product.name} ditambahkan ke pesanan!`, 'success');
        this.state.activeModal = null;
        this.render();
      });
    }

    // CART SHEET EVENTS
    const closeCartBtn = document.getElementById('btn-close-cart-sheet');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    // Clear cart
    const clearCartBtn = document.getElementById('btn-clear-cart');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        if (confirm('Kosongkan semua item di keranjang?')) {
          this.state.cart = [];
          this.state.appliedDiscount = 0;
          this.state.appliedPromoCode = '';
          this.render();
        }
      });
    }

    // Order type tabs in Cart
    document.querySelectorAll('[data-order-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.orderType = e.currentTarget.dataset.orderType;
        this.render();
      });
    });

    // Table no input
    const tableInput = document.getElementById('input-table-no');
    if (tableInput) {
      tableInput.addEventListener('input', (e) => {
        this.state.tableNo = e.target.value;
      });
    }

    // Select customer in Cart
    const customerSelect = document.getElementById('select-customer');
    if (customerSelect) {
      customerSelect.addEventListener('change', (e) => {
        this.state.orderCustomer = e.target.value;
        this.render();
      });
    }

    // Redeem loyalty points
    const redeemPointsBtn = document.getElementById('btn-redeem-points');
    if (redeemPointsBtn) {
      redeemPointsBtn.addEventListener('click', () => {
        this.state.appliedDiscount = 5000;
        this.state.appliedPromoCode = 'POIN MEMBER (-Rp 5.000)';
        this.showToast('50 Poin member berhasil ditukar dengan diskon Rp 5.000!', 'success');
        this.render();
      });
    }

    // Voucher apply
    const applyVoucherBtn = document.getElementById('btn-apply-voucher');
    if (applyVoucherBtn) {
      applyVoucherBtn.addEventListener('click', () => {
        const input = document.getElementById('input-voucher-code');
        const code = input ? input.value.trim().toUpperCase() : '';
        if (!code) return;

        const promos = db.getPromos();
        const promo = promos.find(p => p.code === code && p.isActive !== false);

        if (!promo) {
          sound.playAlert();
          this.showToast('Kode voucher tidak ditemukan atau kadaluarsa!', 'error');
          return;
        }

        const subtotal = this.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        if (promo.minOrder && subtotal < promo.minOrder) {
          sound.playAlert();
          this.showToast(`Minimal belanja Rp ${promo.minOrder.toLocaleString('id-ID')} untuk voucher ini!`, 'error');
          return;
        }

        let discAmount = 0;
        if (promo.type === 'percent') {
          discAmount = Math.round(subtotal * (promo.value / 100));
          if (promo.maxDiscount) discAmount = Math.min(discAmount, promo.maxDiscount);
        } else {
          discAmount = promo.value;
        }

        this.state.appliedDiscount = discAmount;
        this.state.appliedPromoCode = `${promo.code} (-${promo.type === 'percent' ? promo.value + '%' : 'Rp ' + discAmount.toLocaleString('id-ID')})`;
        sound.playSuccess();
        this.showToast(`Voucher ${promo.code} berhasil dipasang!`, 'success');
        this.render();
      });
    }

    // Cart Steppers (- / +)
    document.querySelectorAll('[data-cart-minus]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.cartMinus, 10);
        if (this.state.cart[idx].qty > 1) {
          this.state.cart[idx].qty -= 1;
        } else {
          this.state.cart.splice(idx, 1);
        }
        this.render();
      });
    });

    document.querySelectorAll('[data-cart-plus]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.cartPlus, 10);
        this.state.cart[idx].qty += 1;
        this.render();
      });
    });

    document.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.cartRemove, 10);
        this.state.cart.splice(idx, 1);
        this.render();
      });
    });

    // Hold Order (Simpan Pesanan Sementara)
    const holdOrderBtn = document.getElementById('btn-hold-order');
    if (holdOrderBtn) {
      holdOrderBtn.addEventListener('click', () => {
        if (this.state.cart.length === 0) return;
        const hold = db.saveHoldOrder({
          cart: [...this.state.cart],
          orderType: this.state.orderType,
          tableNo: this.state.tableNo,
          orderCustomer: this.state.orderCustomer
        });
        sound.playBeep();
        this.showToast('Pesanan berhasil disimpan sementara!', 'info');
        this.state.cart = [];
        this.state.activeModal = null;
        this.render();
      });
    }

    // Proceed to Checkout
    const proceedCheckoutBtn = document.getElementById('btn-proceed-checkout');
    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener('click', () => {
        // Check active shift
        const activeShift = db.getActiveShift();
        if (!activeShift) {
          sound.playAlert();
          this.showToast('Shift kasir belum dibuka! Silakan buka shift terlebih dahulu.', 'error');
          this.state.activeModal = 'shift';
          this.render();
          return;
        }

        sound.playBeep();
        const summary = this.calculateCartSummary();
        this.state.checkoutSummary = summary;
        this.state.paymentMethod = 'CASH';
        this.state.cashTendered = summary.total;
        this.state.qrisStatus = 'pending';
        this.state.activeModal = 'checkout';
        this.render();
      });
    }

    // CHECKOUT MODAL EVENTS
    this.bindCheckoutEvents();

    // RECEIPT MODAL EVENTS
    this.bindReceiptEvents();

    // PRODUCTS, INVENTORY & OTHER SUBMODULES
    this.bindSubmodulesEvents();
  }

  updateVariantModalCalculations() {
    const product = this.state.selectedProductForVariant;
    if (!product) return;

    const size = this.state.variantConfig.size || db.getSizes()[0];
    const toppings = this.state.variantConfig.toppings || [];
    const qty = this.state.variantConfig.qty || 1;

    // Update active UI classes
    document.querySelectorAll('.size-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.sizeId === size.id);
    });

    document.querySelectorAll('.flavor-option').forEach(el => {
      const isSel = this.state.variantConfig.flavors.some(f => f.id === el.dataset.flavorId);
      el.classList.toggle('selected', isSel);
    });

    document.querySelectorAll('.topping-option').forEach(el => {
      const isSel = toppings.some(t => t.id === el.dataset.toppingId);
      el.classList.toggle('selected', isSel);
    });

    const qtyValEl = document.getElementById('variant-qty-val');
    if (qtyValEl) qtyValEl.textContent = qty;

    const unitPrice = product.basePrice + (size.priceOffset || 0) + toppings.reduce((s, t) => s + (t.price || 0), 0);
    const grandItemTotal = unitPrice * qty;

    const totalEl = document.getElementById('variant-btn-total');
    if (totalEl) totalEl.textContent = 'Rp ' + grandItemTotal.toLocaleString('id-ID');
  }

  bindCheckoutEvents() {
    const closeCheckoutBtn = document.getElementById('btn-close-checkout');
    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', () => {
        this.state.activeModal = 'cart';
        this.render();
      });
    }

    // Switch payment tabs (CASH vs QRIS)
    const tabPayCash = document.getElementById('tab-pay-cash');
    const tabPayQris = document.getElementById('tab-pay-qris');
    if (tabPayCash && tabPayQris) {
      tabPayCash.addEventListener('click', () => {
        sound.playBeep();
        this.state.paymentMethod = 'CASH';
        this.render();
      });

      tabPayQris.addEventListener('click', () => {
        sound.playBeep();
        this.state.paymentMethod = 'QRIS';
        this.state.qrisStatus = 'pending';
        this.state.qrisSecondsLeft = 300;
        this.render();
        this.startQrisTimer();
      });
    }

    // Quick cash buttons
    document.querySelectorAll('[data-quick-cash]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playBeep();
        const amount = Number(e.currentTarget.dataset.quickCash);
        this.state.cashTendered = amount;
        this.render();
      });
    });

    // Cash tendered input
    const cashInput = document.getElementById('input-cash-tendered');
    if (cashInput) {
      cashInput.addEventListener('input', (e) => {
        this.state.cashTendered = Number(e.target.value || 0);
        this.render();
        const reInput = document.getElementById('input-cash-tendered');
        if (reInput) {
          reInput.focus();
        }
      });
    }

    // Complete Cash Payment
    const confirmCashBtn = document.getElementById('btn-confirm-cash-payment');
    if (confirmCashBtn) {
      confirmCashBtn.addEventListener('click', () => {
        const summary = this.state.checkoutSummary || this.calculateCartSummary();
        const tendered = this.state.cashTendered;
        if (tendered < summary.total) {
          sound.playAlert();
          this.showToast('Nominal uang tunai kurang dari total bayar!', 'error');
          return;
        }

        const change = tendered - summary.total;

        // Process Transaction in DB
        const transaction = db.createTransaction({
          ...summary,
          paymentMethod: 'CASH',
          cashTendered: tendered,
          change: change
        });

        sound.playCash();
        sound.playSuccess();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });

        this.showToast('Pembayaran Tunai Berhasil!', 'success');
        this.state.lastCompletedOrder = transaction;
        this.state.cart = [];
        this.state.appliedDiscount = 0;
        this.state.appliedPromoCode = '';
        this.state.activeModal = 'receipt';
        this.render();
      });
    }

    // QRIS Simulator Buttons
    const simulateQrisBtn = document.getElementById('btn-simulate-qris-scan');
    if (simulateQrisBtn) {
      simulateQrisBtn.addEventListener('click', () => {
        this.state.qrisStatus = 'verifying';
        this.render();
        sound.playBeep();

        setTimeout(() => {
          this.state.qrisStatus = 'success';
          sound.playSuccess();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

          // Auto-save transaction
          const summary = this.state.checkoutSummary || this.calculateCartSummary();
          const tx = db.createTransaction({
            ...summary,
            paymentMethod: 'QRIS',
            cashTendered: summary.total,
            change: 0,
            qrisRef: 'QRIS-' + Math.floor(1000000000 + Math.random() * 9000000000)
          });

          this.state.lastCompletedOrder = tx;
          this.state.cart = [];
          this.state.appliedDiscount = 0;
          this.state.appliedPromoCode = '';
          this.render();
        }, 1200);
      });
    }

    // Cancel QRIS
    const cancelQrisBtn = document.getElementById('btn-cancel-qris');
    if (cancelQrisBtn) {
      cancelQrisBtn.addEventListener('click', () => {
        sound.playAlert();
        this.state.qrisStatus = 'failed';
        this.showToast('Pembayaran QRIS dibatalkan.', 'info');
        setTimeout(() => {
          this.state.activeModal = 'cart';
          this.render();
        }, 800);
      });
    }

    // Finish QRIS Success Flow
    const finishQrisBtn = document.getElementById('btn-finish-qris-success');
    if (finishQrisBtn) {
      finishQrisBtn.addEventListener('click', () => {
        this.state.activeModal = 'receipt';
        this.render();
      });
    }
  }

  startQrisTimer() {
    if (this.state.qrisTimerInterval) clearInterval(this.state.qrisTimerInterval);

    this.state.qrisTimerInterval = setInterval(() => {
      if (this.state.qrisSecondsLeft > 0) {
        this.state.qrisSecondsLeft -= 1;
        const m = Math.floor(this.state.qrisSecondsLeft / 60).toString().padStart(2, '0');
        const s = (this.state.qrisSecondsLeft % 60).toString().padStart(2, '0');
        const el = document.getElementById('qris-countdown-text');
        if (el) el.textContent = `${m}:${s}`;
      } else {
        clearInterval(this.state.qrisTimerInterval);
        this.state.qrisStatus = 'failed';
        this.render();
      }
    }, 1000);
  }

  bindReceiptEvents() {
    const closeReceiptBtn = document.getElementById('btn-close-receipt');
    if (closeReceiptBtn) {
      closeReceiptBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.state.currentTab = 'pos';
        this.render();
      });
    }

    const finishReceiptFlow = document.getElementById('btn-finish-receipt-flow');
    if (finishReceiptFlow) {
      finishReceiptFlow.addEventListener('click', () => {
        sound.playBeep();
        this.state.activeModal = null;
        this.state.currentTab = 'pos';
        this.render();
      });
    }

    // Window Print
    const printWindowBtn = document.getElementById('btn-print-receipt-window');
    if (printWindowBtn) {
      printWindowBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Bluetooth print
    const printBtBtn = document.getElementById('btn-print-bluetooth');
    if (printBtBtn) {
      printBtBtn.addEventListener('click', async () => {
        try {
          this.showToast('Menghubungkan ke Bluetooth Printer...', 'info');
          const res = await printer.printViaBluetooth(this.state.lastCompletedOrder, db.getSettings());
          if (res) {
            this.showToast('Struk terkirim ke Thermal Printer!', 'success');
          }
        } catch (e) {
          this.showToast('Gagal Bluetooth: ' + (e.message || 'Perangkat dibatalkan'), 'error');
        }
      });
    }

    // Share receipt
    const shareBtn = document.getElementById('btn-share-receipt');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const res = await printer.shareReceipt(this.state.lastCompletedOrder, db.getSettings());
        if (res.method === 'clipboard') {
          this.showToast('Teks struk berhasil disalin ke clipboard!', 'success');
        } else {
          this.showToast('Struk berhasil dibagikan!', 'success');
        }
      });
    }

    // Download text receipt
    const dlBtn = document.getElementById('btn-download-pdf-receipt');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const text = printer.generateTextReceipt(this.state.lastCompletedOrder, db.getSettings());
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Struk_${this.state.lastCompletedOrder?.id || 'Diaz'}.txt`;
        a.click();
        this.showToast('Struk berhasil diunduh!', 'success');
      });
    }
  }

  bindSubmodulesEvents() {
    // PRODUCTS MANAGEMENT
    const openAddProdBtn = document.getElementById('btn-open-add-product');
    if (openAddProdBtn) {
      openAddProdBtn.addEventListener('click', () => {
        this.state.editingProduct = null;
        this.state.activeModal = 'product_form';
        this.render();
      });
    }

    const closeProdForm = document.getElementById('btn-close-product-form');
    if (closeProdForm) {
      closeProdForm.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    // Edit Product
    document.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.currentTarget.dataset.editProduct;
        const p = db.getProducts().find(prod => prod.id === pid);
        if (p) {
          this.state.editingProduct = p;
          this.state.activeModal = 'product_form';
          this.render();
        }
      });
    });

    // Delete Product
    document.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const currentUser = db.getCurrentUser();
        if (currentUser?.role !== 'admin') {
          sound.playAlert();
          this.showToast('Hanya Owner/Admin yang dapat menghapus menu produk!', 'error');
          return;
        }

        const pid = e.currentTarget.dataset.deleteProduct;
        if (confirm('Yakin ingin menghapus menu produk ini?')) {
          db.deleteProduct(pid);
          this.showToast('Menu produk berhasil dihapus!', 'info');
          this.render();
        }
      });
    });

    // Add recipe row in product form
    const addRecipeRowBtn = document.getElementById('btn-add-recipe-row');
    if (addRecipeRowBtn) {
      addRecipeRowBtn.addEventListener('click', () => {
        const container = document.getElementById('recipe-items-container');
        const ingredients = db.getIngredients();
        if (container) {
          const row = document.createElement('div');
          row.className = 'recipe-row';
          row.style.cssText = 'display: flex; gap: 6px; align-items: center;';
          row.innerHTML = `
            <select class="form-select recipe-ing-select" style="flex: 2; font-size: 11px;">
              ${ingredients.map(ing => `<option value="${ing.id}">${ing.name} (${ing.unit})</option>`).join('')}
            </select>
            <input type="number" step="0.1" class="form-input recipe-qty-input" style="flex: 1; font-size: 12px; padding: 6px;" value="1" placeholder="Qty" />
            <button type="button" class="btn-remove-recipe-row" style="background: none; border: none; color: #EF4444; font-size: 16px; cursor: pointer;">&times;</button>
          `;
          container.appendChild(row);

          row.querySelector('.btn-remove-recipe-row').addEventListener('click', () => row.remove());
        }
      });
    }

    // Submit Product Form
    const submitProdFormBtn = document.getElementById('btn-submit-product-form');
    if (submitProdFormBtn) {
      submitProdFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = document.getElementById('prod-id')?.value || ('prod_' + Date.now());
        const name = document.getElementById('prod-name')?.value?.trim();
        const category = document.getElementById('prod-category')?.value;
        const code = document.getElementById('prod-code')?.value?.trim();
        const price = Number(document.getElementById('prod-price')?.value || 0);
        const cost = Number(document.getElementById('prod-cost')?.value || 0);
        const barcode = document.getElementById('prod-barcode')?.value?.trim();
        const image = document.getElementById('prod-image-select')?.value;
        const desc = document.getElementById('prod-desc')?.value?.trim();

        if (!name || price <= 0) {
          this.showToast('Harap lengkapi nama produk dan harga jual!', 'error');
          return;
        }

        // Build recipes
        const recipeRows = document.querySelectorAll('.recipe-row');
        const recipe = [];
        recipeRows.forEach(row => {
          const ingId = row.querySelector('.recipe-ing-select')?.value;
          const qty = Number(row.querySelector('.recipe-qty-input')?.value || 1);
          if (ingId) recipe.push({ ingredientId: ingId, qty: qty });
        });

        db.saveProduct({
          id,
          name,
          category,
          code,
          barcode,
          basePrice: price,
          costPrice: cost,
          image,
          description: desc,
          isAvailable: true,
          recipe
        });

        sound.playSuccess();
        this.showToast(`Menu "${name}" berhasil disimpan!`, 'success');
        this.state.activeModal = null;
        this.render();
      });
    }

    // INVENTORY RESTOCK & ADJUST
    const openRestockBtn = document.getElementById('btn-open-restock-modal');
    if (openRestockBtn) {
      openRestockBtn.addEventListener('click', () => {
        this.state.restockingIngredientId = null;
        this.state.activeModal = 'restock';
        this.render();
      });
    }

    const closeRestockBtn = document.getElementById('btn-close-restock');
    if (closeRestockBtn) {
      closeRestockBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    // Quick restock button on ingredient card
    document.querySelectorAll('[data-quick-restock-ing]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.restockingIngredientId = e.currentTarget.dataset.quickRestockIng;
        this.state.activeModal = 'restock';
        this.render();
      });
    });

    // Manual physical adjustment
    document.querySelectorAll('[data-adjust-ing]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ingId = e.currentTarget.dataset.adjustIng;
        const ing = db.getIngredients().find(i => i.id === ingId);
        if (ing) {
          const newQty = prompt(`Koreksi stok fisik untuk "${ing.name}" (Saat ini: ${ing.stock} ${ing.unit}):`, ing.stock);
          if (newQty !== null && !isNaN(newQty)) {
            const reason = prompt('Alasan penyesuaian (cth: Koreksi opname, tumpah/rusak):', 'Opname Fisik');
            db.adjustStock(ingId, Number(newQty), reason);
            sound.playBeep();
            this.showToast(`Stok ${ing.name} diperbarui menjadi ${newQty} ${ing.unit}`, 'info');
            this.render();
          }
        }
      });
    });

    // Submit Restock Form
    const submitRestockBtn = document.getElementById('btn-submit-restock');
    if (submitRestockBtn) {
      submitRestockBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const ingId = document.getElementById('restock-ingredient-id')?.value;
        const qty = Number(document.getElementById('restock-qty')?.value || 0);
        const price = Number(document.getElementById('restock-price')?.value || 0);
        const supplier = document.getElementById('restock-supplier-name')?.value;
        const notes = document.getElementById('restock-notes')?.value;

        if (!ingId || qty <= 0) {
          this.showToast('Harap masukkan jumlah stok yang valid!', 'error');
          return;
        }

        db.restockIngredient(ingId, qty, price, supplier, notes);
        sound.playSuccess();
        this.showToast('Restock berhasil dicatat dan stok bertambah!', 'success');
        this.state.activeModal = null;
        this.render();
      });
    }

    // Inventory tabs (Stok vs Mutasi)
    document.querySelectorAll('[data-inv-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.inventoryTab = e.currentTarget.dataset.invTab;
        this.render();
      });
    });

    // TRANSACTIONS ACTIONS (Reprint & Void)
    document.querySelectorAll('[data-reprint-tx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const txId = e.currentTarget.dataset.reprintTx;
        const tx = db.getTransactions().find(t => t.id === txId);
        if (tx) {
          this.state.lastCompletedOrder = tx;
          this.state.activeModal = 'receipt';
          this.render();
        }
      });
    });

    document.querySelectorAll('[data-void-tx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const txId = e.currentTarget.dataset.voidTx;
        const currentUser = db.getCurrentUser();
        if (currentUser?.role !== 'admin') {
          sound.playAlert();
          this.showToast('Batalkan transaksi membutuhkan izin Owner/Admin!', 'error');
          return;
        }

        if (confirm(`Yakin ingin membatalkan transaksi ${txId}? Stok bahan baku akan dikembalikan otomatis ke inventaris.`)) {
          const reason = prompt('Masukkan alasan pembatalan:', 'Kesalahan input kasir');
          db.voidTransaction(txId, reason || 'Dibatalkan kasir');
          sound.playBeep();
          this.showToast(`Transaksi ${txId} dibatalkan & stok dikembalikan!`, 'info');
          this.render();
        }
      });
    });

    // REPORTS ACTIONS
    document.querySelectorAll('[data-report-period]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.reportPeriod = e.currentTarget.dataset.reportPeriod;
        this.render();
      });
    });

    const exportSalesBtn = document.getElementById('btn-export-sales-csv');
    if (exportSalesBtn) {
      exportSalesBtn.addEventListener('click', () => {
        exportService.exportTransactions(db.getTransactions());
        this.showToast('Laporan penjualan diunduh!', 'success');
      });
    }

    const exportStockBtn = document.getElementById('btn-export-stock-csv');
    if (exportStockBtn) {
      exportStockBtn.addEventListener('click', () => {
        exportService.exportStock(db.getIngredients(), db.getStockMovements());
        this.showToast('Laporan stok diunduh!', 'success');
      });
    }

    const exportExpBtn = document.getElementById('btn-export-expenses-csv');
    if (exportExpBtn) {
      exportExpBtn.addEventListener('click', () => {
        exportService.exportExpenses(db.getExpenses());
        this.showToast('Laporan pengeluaran diunduh!', 'success');
      });
    }

    // MORE MENU NAVIGATION
    this.bindMoreSubmodules();
  }

  bindMoreSubmodules() {
    // Menu items in More View
    const menuShift = document.getElementById('menu-shift');
    if (menuShift) {
      menuShift.addEventListener('click', () => {
        this.state.activeModal = 'shift';
        this.render();
      });
    }

    const menuExpenses = document.getElementById('menu-expenses');
    if (menuExpenses) {
      menuExpenses.addEventListener('click', () => {
        this.state.activeModal = 'expense';
        this.render();
      });
    }

    const menuPromos = document.getElementById('menu-promos');
    if (menuPromos) {
      menuPromos.addEventListener('click', () => {
        this.state.activeModal = 'promo';
        this.render();
      });
    }

    const menuCustomers = document.getElementById('menu-customers');
    if (menuCustomers) {
      menuCustomers.addEventListener('click', () => {
        this.state.activeModal = 'customer';
        this.render();
      });
    }

    const menuSuppliers = document.getElementById('menu-suppliers');
    if (menuSuppliers) {
      menuSuppliers.addEventListener('click', () => {
        this.state.activeModal = 'supplier';
        this.render();
      });
    }

    const menuSettings = document.getElementById('menu-settings');
    if (menuSettings) {
      menuSettings.addEventListener('click', () => {
        this.state.activeModal = 'settings';
        this.render();
      });
    }

    const menuBackup = document.getElementById('menu-backup');
    if (menuBackup) {
      menuBackup.addEventListener('click', () => {
        db.exportDatabaseJSON();
        this.showToast('File backup database JSON berhasil diunduh!', 'success');
      });
    }

    const menuManageUsers = document.getElementById('menu-manage-users');
    if (menuManageUsers) {
      menuManageUsers.addEventListener('click', () => {
        this.state.activeModal = 'manage_users';
        this.render();
      });
    }

    const menuLockScreen = document.getElementById('menu-lock-screen');
    if (menuLockScreen) {
      menuLockScreen.addEventListener('click', () => {
        sound.playBeep();
        db.logout();
        this.state.activeModal = null;
        this.showToast('Terminal kasir berhasil dikunci.', 'info');
        this.render();
      });
    }

    const menuSwitchUser = document.getElementById('menu-switch-user');
    const quickLogout = document.getElementById('btn-quick-logout');
    if (menuSwitchUser) {
      menuSwitchUser.addEventListener('click', () => {
        this.state.activeModal = 'login';
        this.render();
      });
    }
    if (quickLogout) {
      quickLogout.addEventListener('click', () => {
        sound.playBeep();
        db.logout();
        this.state.activeModal = null;
        this.showToast('Berhasil keluar / logout kasir.', 'info');
        this.render();
      });
    }

    // SHIFT MODAL ACTIONS
    const closeShiftBtn = document.getElementById('btn-close-shift');
    if (closeShiftBtn) {
      closeShiftBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const openShiftBtn = document.getElementById('btn-confirm-open-shift');
    if (openShiftBtn) {
      openShiftBtn.addEventListener('click', () => {
        const cash = Number(document.getElementById('input-start-cash')?.value || 0);
        const note = document.getElementById('input-shift-note')?.value || '';
        db.openShift(cash, note);
        sound.playSuccess();
        this.showToast(`Shift kasir berhasil dibuka dengan modal awal Rp ${cash.toLocaleString('id-ID')}!`, 'success');
        this.state.activeModal = null;
        this.render();
      });
    }

    const closeShiftBtnAction = document.getElementById('btn-confirm-close-shift');
    if (closeShiftBtnAction) {
      closeShiftBtnAction.addEventListener('click', () => {
        const actualCash = Number(document.getElementById('input-actual-cash')?.value || 0);
        const note = document.getElementById('input-close-note')?.value || '';
        const closed = db.closeShift(actualCash, note);
        sound.playCash();
        const diffText = closed.cashVariance === 0 ? 'Kas Pas!' : (closed.cashVariance > 0 ? `Lebih Rp ${closed.cashVariance.toLocaleString('id-ID')}` : `Kurang Rp ${Math.abs(closed.cashVariance).toLocaleString('id-ID')}`);
        this.showToast(`Shift ditutup. Selisih kas: ${diffText}`, 'info');
        this.state.activeModal = null;
        this.render();
      });
    }

    // EXPENSE MODAL ACTIONS
    const closeExpBtn = document.getElementById('btn-close-expense');
    if (closeExpBtn) {
      closeExpBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formExpense = document.getElementById('form-add-expense');
    if (formExpense) {
      formExpense.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('exp-category')?.value;
        const amt = Number(document.getElementById('exp-amount')?.value || 0);
        const note = document.getElementById('exp-note')?.value?.trim();
        if (amt <= 0 || !note) return;

        db.addExpense({
          category: cat,
          amount: amt,
          note: note,
          recordedBy: db.getCurrentUser()?.name || 'Kasir'
        });

        sound.playCash();
        this.showToast('Pengeluaran berhasil dicatat!', 'success');
        this.render();
      });
    }

    document.querySelectorAll('.btn-delete-expense').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const expId = e.currentTarget.dataset.expenseId;
        db.deleteExpense(expId);
        this.render();
      });
    });

    // CUSTOMER MODAL ACTIONS
    const closeCustBtn = document.getElementById('btn-close-customer');
    if (closeCustBtn) {
      closeCustBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formCust = document.getElementById('form-add-customer');
    if (formCust) {
      formCust.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cust-new-name')?.value?.trim();
        const phone = document.getElementById('cust-new-phone')?.value?.trim();
        const email = document.getElementById('cust-new-email')?.value?.trim();
        if (!name || !phone) return;

        db.saveCustomer({ name, phone, email });
        sound.playSuccess();
        this.showToast(`Member "${name}" berhasil didaftarkan!`, 'success');
        this.render();
      });
    }

    // SUPPLIER MODAL ACTIONS
    const closeSupBtn = document.getElementById('btn-close-supplier');
    if (closeSupBtn) {
      closeSupBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formSup = document.getElementById('form-add-supplier');
    if (formSup) {
      formSup.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sup-name')?.value?.trim();
        const phone = document.getElementById('sup-phone')?.value?.trim();
        const items = document.getElementById('sup-items')?.value?.trim();
        const address = document.getElementById('sup-address')?.value?.trim();
        if (!name || !phone) return;

        db.saveSupplier({ name, phone, itemsSupplied: items, address });
        sound.playSuccess();
        this.showToast(`Supplier "${name}" berhasil disimpan!`, 'success');
        this.render();
      });
    }

    // PROMO MODAL ACTIONS
    const closePromoBtn = document.getElementById('btn-close-promo');
    if (closePromoBtn) {
      closePromoBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formPromo = document.getElementById('form-add-promo');
    if (formPromo) {
      formPromo.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('prm-code')?.value?.trim().toUpperCase();
        const type = document.getElementById('prm-type')?.value;
        const val = Number(document.getElementById('prm-val')?.value || 0);
        const min = Number(document.getElementById('prm-min')?.value || 0);
        if (!code || val <= 0) return;

        db.savePromo({
          code,
          type,
          value: val,
          minOrder: min,
          name: `Promo Spesial ${code}`,
          isActive: true
        });

        sound.playSuccess();
        this.showToast(`Kode voucher ${code} berhasil dibuat!`, 'success');
        this.render();
      });
    }

    // SETTINGS MODAL ACTIONS
    const closeSetBtn = document.getElementById('btn-close-settings');
    if (closeSetBtn) {
      closeSetBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formSettings = document.getElementById('form-save-settings');
    if (formSettings) {
      formSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('set-store-name')?.value;
        const tagline = document.getElementById('set-store-tagline')?.value;
        const address = document.getElementById('set-store-address')?.value;
        const phone = document.getElementById('set-store-phone')?.value;
        const ig = document.getElementById('set-store-ig')?.value;
        const taxEnabled = document.getElementById('set-tax-enabled')?.checked;
        const paperSize = document.querySelector('input[name="printer-size"]:checked')?.value || '58mm';
        const qrisNmid = document.getElementById('set-qris-nmid')?.value;
        const footer = document.getElementById('set-receipt-footer')?.value;

        db.updateSettings({
          store: {
            name,
            tagline,
            address,
            phone,
            instagram: ig,
            taxEnabled,
            taxRate: 10,
            paperSize,
            qrisNmid,
            footerMessage: footer,
            currency: 'Rp',
            receiptPrefix: 'DIAZ-'
          }
        });

        sound.playSuccess();
        this.showToast('Pengaturan toko & printer berhasil diperbarui!', 'success');
        this.state.activeModal = null;
        this.render();
      });
    }

    // LOGIN & PIN ACTIONS
    const closeLoginBtn = document.getElementById('btn-close-login');
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const modalLogout = document.getElementById('btn-modal-logout');
    if (modalLogout) {
      modalLogout.addEventListener('click', () => {
        sound.playBeep();
        db.logout();
        this.state.activeModal = null;
        this.showToast('Berhasil keluar / logout kasir.', 'info');
        this.render();
      });
    }

    document.querySelectorAll('.user-select-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const uid = e.currentTarget.dataset.userId;
        const user = db.getUsers().find(u => u.id === uid);
        if (user) {
          const pinInput = document.getElementById('input-user-pin');
          if (pinInput) {
            pinInput.value = user.pin;
            pinInput.focus();
          }
        }
      });
    });

    const submitPinBtn = document.getElementById('btn-submit-pin-login');
    if (submitPinBtn) {
      submitPinBtn.addEventListener('click', () => {
        const pin = document.getElementById('input-user-pin')?.value?.trim();
        const res = db.login(pin);
        if (res.success) {
          sound.playSuccess();
          this.showToast(`Login berhasil sebagai ${res.user.name} (${res.user.role})!`, 'success');
          this.state.activeModal = null;
          this.render();
        } else {
          sound.playAlert();
          this.showToast('PIN tidak sesuai! Coba: 1234 (Owner) atau 1111 (Kasir)', 'error');
        }
      });
    }

    // USER MANAGEMENT MODAL ACTIONS
    const closeUsersModalBtn = document.getElementById('btn-close-users-modal');
    if (closeUsersModalBtn) {
      closeUsersModalBtn.addEventListener('click', () => {
        this.state.activeModal = null;
        this.render();
      });
    }

    const formAddNewUser = document.getElementById('form-add-new-user');
    if (formAddNewUser) {
      formAddNewUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('input-new-user-name')?.value?.trim();
        const role = document.getElementById('input-new-user-role')?.value || 'cashier';
        const pin = document.getElementById('input-new-user-pin')?.value?.trim();
        const avatarRadio = document.querySelector('input[name="new_user_avatar"]:checked');
        const avatar = avatarRadio?.value || '🍨';

        if (!name) {
          sound.playAlert();
          this.showToast('Nama kasir tidak boleh kosong!', 'error');
          return;
        }

        if (!pin || pin.length !== 4 || isNaN(pin)) {
          sound.playAlert();
          this.showToast('PIN harus berupa 4 digit angka!', 'error');
          return;
        }

        db.addUser({ name, role, pin, avatar });
        sound.playSuccess();
        this.showToast(`Akun kasir "${name}" berhasil ditambahkan!`, 'success');
        this.render();
      });
    }

    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uid = btn.dataset.userId;
        const uname = btn.dataset.userName;
        if (confirm(`Yakin ingin menghapus akun kasir "${uname}"?`)) {
          const res = db.deleteUser(uid);
          if (res.success) {
            sound.playBeep();
            this.showToast(`Akun kasir "${uname}" berhasil dihapus.`, 'info');
            this.render();
          } else {
            sound.playAlert();
            this.showToast(res.message, 'error');
          }
        }
      });
    });
  }

  // --- Login Screen Helpers & Handlers ---
  updateLoginClock() {
    const clockEl = document.getElementById('login-live-clock');
    if (clockEl) {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dayName = days[now.getDay()];
      const dayDate = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      clockEl.innerHTML = `🕒 ${dayName}, ${dayDate} ${monthName} ${year} • ${timeStr} WIB`;
    }
  }

  shakeLoginPin() {
    const pinDots = document.getElementById('login-pin-dots-display');
    if (pinDots) {
      pinDots.style.animation = 'none';
      pinDots.offsetHeight; // force reflow
      pinDots.style.animation = 'shakePin 0.4s ease-in-out';
    }
    const errEl = document.getElementById('login-error-msg');
    if (errEl) {
      errEl.classList.add('visible');
    }
  }

  updatePinDotsDisplay() {
    const dots = document.querySelectorAll('#login-pin-dots-display .pin-dot');
    const len = this.state.loginPinInput.length;
    dots.forEach((dot, idx) => {
      if (idx < len) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });

    const hiddenInput = document.getElementById('login-hidden-pin-input');
    if (hiddenInput) {
      hiddenInput.value = this.state.loginPinInput;
    }
  }

  executeLogin(pin, userId = null) {
    const activeUser = userId 
      ? db.getUsers().find(u => u.id === userId)
      : (db.getUsers().find(u => u.id === this.state.loginSelectedUserId) || db.getUsers()[0]);

    const res = db.login(pin, activeUser?.id);
    if (res.success) {
      sound.playSuccess();
      this.state.loginPinInput = '';
      this.state.loginErrorMessage = '';
      this.showToast(`Selamat datang, ${res.user.name} (${res.user.role === 'admin' ? 'Owner' : 'Kasir'})! 🍨`, 'success');
      this.render();
    } else {
      sound.playAlert();
      this.state.loginErrorMessage = 'PIN Kasir tidak sesuai! Silakan periksa kembali.';
      this.state.loginPinInput = '';
      this.updatePinDotsDisplay();
      this.shakeLoginPin();
      const errMsg = document.getElementById('login-error-msg');
      if (errMsg) {
        const textSpan = errMsg.querySelector('span:last-child');
        if (textSpan) textSpan.textContent = this.state.loginErrorMessage;
        errMsg.classList.add('visible');
      }
    }
  }

  bindLoginEvents() {
    // 1. User selector cards
    document.querySelectorAll('.login-user-card').forEach(card => {
      card.addEventListener('click', () => {
        sound.playBeep();
        const uid = card.dataset.userId;
        this.state.loginSelectedUserId = uid;
        this.state.loginPinInput = '';
        this.state.loginErrorMessage = '';
        this.render();
      });
    });

    // 2. Virtual Touch Numpad
    document.querySelectorAll('#login-numpad .numpad-key').forEach(keyBtn => {
      keyBtn.addEventListener('click', () => {
        const key = keyBtn.dataset.key;
        if (key === 'CLEAR') {
          sound.playBeep();
          this.state.loginPinInput = '';
          this.state.loginErrorMessage = '';
          this.updatePinDotsDisplay();
          const errEl = document.getElementById('login-error-msg');
          if (errEl) errEl.classList.remove('visible');
        } else if (key === 'BACKSPACE') {
          sound.playBeep();
          if (this.state.loginPinInput.length > 0) {
            this.state.loginPinInput = this.state.loginPinInput.slice(0, -1);
            this.updatePinDotsDisplay();
          }
        } else {
          // Digits 0-9
          if (this.state.loginPinInput.length < 4) {
            sound.playBeep();
            this.state.loginPinInput += key;
            this.updatePinDotsDisplay();

            const errEl = document.getElementById('login-error-msg');
            if (errEl) errEl.classList.remove('visible');

            // Auto-submit when 4 digits reached
            if (this.state.loginPinInput.length === 4) {
              setTimeout(() => {
                this.executeLogin(this.state.loginPinInput);
              }, 120);
            }
          }
        }
      });
    });

    // 3. Submit Button
    const submitBtn = document.getElementById('btn-login-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!this.state.loginPinInput || this.state.loginPinInput.length < 4) {
          sound.playAlert();
          this.state.loginErrorMessage = 'Masukkan 4 digit PIN Anda!';
          const errMsg = document.getElementById('login-error-msg');
          if (errMsg) {
            const textSpan = errMsg.querySelector('span:last-child');
            if (textSpan) textSpan.textContent = this.state.loginErrorMessage;
            errMsg.classList.add('visible');
          }
          this.shakeLoginPin();
          return;
        }
        this.executeLogin(this.state.loginPinInput);
      });
    }

    // 4. Quick Demo Shortcuts
    document.querySelectorAll('.demo-pill-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        const uid = pill.dataset.demoUserId;
        const pin = pill.dataset.demoPin;
        this.state.loginSelectedUserId = uid;
        this.state.loginPinInput = pin;
        this.updatePinDotsDisplay();
        this.executeLogin(pin, uid);
      });
    });

    // 5. Physical keyboard handler
    if (!this._loginKeyHandler) {
      this._loginKeyHandler = (e) => {
        if (db.getCurrentUser()) return; // only listen if on login screen
        if (e.key >= '0' && e.key <= '9') {
          if (this.state.loginPinInput.length < 4) {
            sound.playBeep();
            this.state.loginPinInput += e.key;
            this.updatePinDotsDisplay();
            const errEl = document.getElementById('login-error-msg');
            if (errEl) errEl.classList.remove('visible');
            if (this.state.loginPinInput.length === 4) {
              setTimeout(() => {
                this.executeLogin(this.state.loginPinInput);
              }, 120);
            }
          }
        } else if (e.key === 'Backspace') {
          sound.playBeep();
          if (this.state.loginPinInput.length > 0) {
            this.state.loginPinInput = this.state.loginPinInput.slice(0, -1);
            this.updatePinDotsDisplay();
          }
        } else if (e.key === 'Enter') {
          if (this.state.loginPinInput.length === 4) {
            this.executeLogin(this.state.loginPinInput);
          }
        } else if (e.key === 'Escape') {
          this.state.loginPinInput = '';
          this.updatePinDotsDisplay();
        }
      };
      window.addEventListener('keydown', this._loginKeyHandler);
    }
  }
}

// Instantiate application on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.posApp = new PosApp();
});
