// Diaz Ice Cream POS - Database & State Storage Engine
import {
  initialStoreSettings,
  initialUsers,
  initialCategories,
  initialFlavors,
  initialSizes,
  initialToppings,
  initialIngredients,
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialPromos,
  initialExpenses,
  initialStockMovements,
  getInitialTransactions,
  initialActiveShift
} from './initialData.js';

const STORAGE_KEYS = {
  SETTINGS: 'diaz_pos_settings',
  USERS: 'diaz_pos_users',
  CURRENT_USER: 'diaz_pos_current_user',
  CATEGORIES: 'diaz_pos_categories',
  FLAVORS: 'diaz_pos_flavors',
  SIZES: 'diaz_pos_sizes',
  TOPPINGS: 'diaz_pos_toppings',
  INGREDIENTS: 'diaz_pos_ingredients',
  PRODUCTS: 'diaz_pos_products',
  CUSTOMERS: 'diaz_pos_customers',
  SUPPLIERS: 'diaz_pos_suppliers',
  PROMOS: 'diaz_pos_promos',
  EXPENSES: 'diaz_pos_expenses',
  STOCK_MOVEMENTS: 'diaz_pos_stock_movements',
  TRANSACTIONS: 'diaz_pos_transactions',
  ACTIVE_SHIFT: 'diaz_pos_active_shift',
  SHIFT_HISTORY: 'diaz_pos_shift_history',
  HOLD_ORDERS: 'diaz_pos_hold_orders'
};

class PosDatabase {
  constructor() {
    this.listeners = new Set();
    this.initDatabase();
  }

  // Load from local storage or fallback to default dataset
  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error(`Error saving key ${key} to storage:`, e);
    }
  }

  // Event listener subscription for reactive UI updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  // Initialize DB with seed data if fresh install
  initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetToDefault();
    }
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialStoreSettings));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(null)); // Requires login
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(initialFlavors));
    localStorage.setItem(STORAGE_KEYS.SIZES, JSON.stringify(initialSizes));
    localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(initialToppings));
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(initialIngredients));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(initialSuppliers));
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(initialPromos));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(initialStockMovements));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(getInitialTransactions()));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SHIFT, JSON.stringify(initialActiveShift));
    localStorage.setItem(STORAGE_KEYS.SHIFT_HISTORY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.HOLD_ORDERS, JSON.stringify([]));
    this.notify();
  }

  // --- Settings ---
  getSettings() {
    return this.load(STORAGE_KEYS.SETTINGS, initialStoreSettings);
  }

  updateSettings(newSettings) {
    this.save(STORAGE_KEYS.SETTINGS, newSettings);
  }

  // --- Users & Auth ---
  getUsers() {
    return this.load(STORAGE_KEYS.USERS, initialUsers);
  }

  getCurrentUser() {
    return this.load(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user) {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  logout() {
    this.save(STORAGE_KEYS.CURRENT_USER, null);
  }

  login(pin, userId = null) {
    const users = this.getUsers();
    let user = null;
    if (userId) {
      user = users.find(u => u.id === userId && u.pin === pin);
    } else {
      user = users.find(u => u.pin === pin);
    }
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'PIN Kasir/Admin salah!' };
  }

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name || 'Kasir Baru',
      role: userData.role || 'cashier',
      pin: userData.pin || '1111',
      title: userData.title || (userData.role === 'admin' ? 'Store Manager' : 'Kasir Toko'),
      avatar: userData.avatar || '🍨'
    };
    users.push(newUser);
    this.save(STORAGE_KEYS.USERS, users);
    return { success: true, user: newUser };
  }

  updateUser(userData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userData.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...userData };
      this.save(STORAGE_KEYS.USERS, users);
      const curr = this.getCurrentUser();
      if (curr && curr.id === userData.id) {
        this.setCurrentUser(users[index]);
      }
      return { success: true, user: users[index] };
    }
    return { success: false, message: 'User tidak ditemukan' };
  }

  deleteUser(userId) {
    let users = this.getUsers();
    if (users.length <= 1) {
      return { success: false, message: 'Minimal harus ada 1 akun kasir/admin!' };
    }
    users = users.filter(u => u.id !== userId);
    this.save(STORAGE_KEYS.USERS, users);
    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      this.logout();
    }
    return { success: true };
  }

  // --- Products ---
  getProducts() {
    return this.load(STORAGE_KEYS.PRODUCTS, initialProducts);
  }

  saveProduct(product) {
    const list = this.getProducts();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.push(product);
    }
    this.save(STORAGE_KEYS.PRODUCTS, list);
  }

  deleteProduct(productId) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== productId);
    this.save(STORAGE_KEYS.PRODUCTS, list);
  }

  // --- Categories, Flavors, Sizes, Toppings ---
  getCategories() {
    return this.load(STORAGE_KEYS.CATEGORIES, initialCategories);
  }

  getFlavors() {
    return this.load(STORAGE_KEYS.FLAVORS, initialFlavors);
  }

  getSizes() {
    return this.load(STORAGE_KEYS.SIZES, initialSizes);
  }

  getToppings() {
    return this.load(STORAGE_KEYS.TOPPINGS, initialToppings);
  }

  // --- Ingredients & Recipe / BOM Management ---
  getIngredients() {
    return this.load(STORAGE_KEYS.INGREDIENTS, initialIngredients);
  }

  saveIngredient(ingredient) {
    const list = this.getIngredients();
    const index = list.findIndex(i => i.id === ingredient.id);
    if (index >= 0) {
      list[index] = ingredient;
    } else {
      list.push(ingredient);
    }
    this.save(STORAGE_KEYS.INGREDIENTS, list);
  }

  deleteIngredient(ingredientId) {
    let list = this.getIngredients();
    list = list.filter(i => i.id !== ingredientId);
    this.save(STORAGE_KEYS.INGREDIENTS, list);
  }

  // Stock In / Restock from Supplier
  restockIngredient(ingredientId, addedQty, unitPrice, supplierName, notes) {
    const ingredients = this.getIngredients();
    const ing = ingredients.find(i => i.id === ingredientId);
    if (!ing) return false;

    ing.stock = Number(ing.stock || 0) + Number(addedQty);
    if (unitPrice > 0) {
      ing.costPrice = Number(unitPrice);
    }
    this.save(STORAGE_KEYS.INGREDIENTS, ingredients);

    const currentUser = this.getCurrentUser();
    this.addStockMovement({
      ingredientId: ing.id,
      ingredientName: ing.name,
      type: 'in',
      qty: Number(addedQty),
      unit: ing.unit,
      reference: supplierName ? `PO: ${supplierName}` : 'Restock Manual',
      note: notes || 'Penambahan stok bahan baku',
      userId: currentUser?.id,
      userName: currentUser?.name
    });

    // Also optionally record as expense
    if (unitPrice > 0 && addedQty > 0) {
      const expenseAmount = addedQty * unitPrice;
      this.addExpense({
        category: 'Bahan Baku',
        amount: expenseAmount,
        note: `Pembelian stok ${ing.name} (${addedQty} ${ing.unit}) - ${supplierName || 'Supplier'}`,
        recordedBy: currentUser?.name || 'Kasir'
      });
    }

    return true;
  }

  // Adjust stock (waste / adjustment)
  adjustStock(ingredientId, newQty, reason) {
    const ingredients = this.getIngredients();
    const ing = ingredients.find(i => i.id === ingredientId);
    if (!ing) return false;

    const diff = Number(newQty) - Number(ing.stock);
    ing.stock = Number(newQty);
    this.save(STORAGE_KEYS.INGREDIENTS, ingredients);

    const currentUser = this.getCurrentUser();
    this.addStockMovement({
      ingredientId: ing.id,
      ingredientName: ing.name,
      type: diff >= 0 ? 'in' : 'out',
      qty: Math.abs(diff),
      unit: ing.unit,
      reference: 'Penyesuaian Manual',
      note: reason || 'Koreksi stok fisik / waste',
      userId: currentUser?.id,
      userName: currentUser?.name
    });

    return true;
  }

  // --- Stock Movements ---
  getStockMovements() {
    return this.load(STORAGE_KEYS.STOCK_MOVEMENTS, initialStockMovements);
  }

  addStockMovement(movement) {
    const list = this.getStockMovements();
    const record = {
      id: 'mov_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
      ...movement
    };
    list.unshift(record);
    this.save(STORAGE_KEYS.STOCK_MOVEMENTS, list);
  }

  // --- Transactions (Checkout & Stock Deduction) ---
  getTransactions() {
    return this.load(STORAGE_KEYS.TRANSACTIONS, []);
  }

  createTransaction(orderData) {
    const transactions = this.getTransactions();
    const products = this.getProducts();
    const ingredients = this.getIngredients();
    const currentUser = this.getCurrentUser();

    // 1. Generate Transaction ID
    const settings = this.getSettings();
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const seq = (transactions.length + 1).toString().padStart(3, '0');
    const transactionId = `${settings?.store?.receiptPrefix || 'DIAZ-'}${dateStr}-${seq}`;

    const newTransaction = {
      id: transactionId,
      createdAt: new Date().toISOString(),
      cashierId: currentUser?.id,
      cashierName: currentUser?.name,
      status: 'completed',
      ...orderData
    };

    // 2. Automated Ingredient Deduction based on Recipe/BOM
    const deductionLogs = [];
    (orderData.items || []).forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (product && product.recipe && Array.isArray(product.recipe)) {
        product.recipe.forEach(recipeItem => {
          const ing = ingredients.find(i => i.id === recipeItem.ingredientId);
          if (ing) {
            const deductedAmount = Number(recipeItem.qty) * Number(cartItem.qty);
            ing.stock = Math.max(0, Number(ing.stock || 0) - deductedAmount);

            deductionLogs.push({
              ingredientId: ing.id,
              ingredientName: ing.name,
              type: 'out',
              qty: deductedAmount,
              unit: ing.unit,
              reference: `Transaksi #${transactionId}`,
              note: `Terjual: ${cartItem.qty}x ${cartItem.name}`,
              userId: currentUser?.id,
              userName: currentUser?.name
            });
          }
        });
      }
    });

    // Save updated ingredient stock
    this.save(STORAGE_KEYS.INGREDIENTS, ingredients);

    // Save stock movements
    deductionLogs.forEach(log => this.addStockMovement(log));

    // 3. Update customer loyalty points if customer exists
    if (orderData.customerId) {
      const customers = this.getCustomers();
      const customer = customers.find(c => c.id === orderData.customerId);
      if (customer) {
        // 1 point per 1.000 IDR
        const earnedPoints = Math.floor(orderData.total / 1000);
        customer.points = (customer.points || 0) + earnedPoints;
        customer.totalSpent = (customer.totalSpent || 0) + orderData.total;
        customer.totalOrders = (customer.totalOrders || 0) + 1;
        this.save(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }

    // 4. Save transaction
    transactions.unshift(newTransaction);
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);

    return newTransaction;
  }

  // Cancel / Void Transaction (Returns stock back to inventory)
  voidTransaction(transactionId, reason = 'Pembatalan Transaksi Kasir') {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.status === 'cancelled') return false;

    tx.status = 'cancelled';
    tx.cancelReason = reason;
    tx.cancelledAt = new Date().toISOString();

    // Revert ingredients stock
    const products = this.getProducts();
    const ingredients = this.getIngredients();
    const currentUser = this.getCurrentUser();

    (tx.items || []).forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (product && product.recipe) {
        product.recipe.forEach(recipeItem => {
          const ing = ingredients.find(i => i.id === recipeItem.ingredientId);
          if (ing) {
            const returnQty = Number(recipeItem.qty) * Number(cartItem.qty);
            ing.stock = Number(ing.stock || 0) + returnQty;
            this.addStockMovement({
              ingredientId: ing.id,
              ingredientName: ing.name,
              type: 'in',
              qty: returnQty,
              unit: ing.unit,
              reference: `Void Transaksi #${transactionId}`,
              note: `Pengembalian stok pembatalan pesanan`,
              userId: currentUser?.id,
              userName: currentUser?.name
            });
          }
        });
      }
    });

    this.save(STORAGE_KEYS.INGREDIENTS, ingredients);
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
    return true;
  }

  // --- Hold Orders (Simpan Pesanan Sementara) ---
  getHoldOrders() {
    return this.load(STORAGE_KEYS.HOLD_ORDERS, []);
  }

  saveHoldOrder(order) {
    const list = this.getHoldOrders();
    const newHold = {
      id: 'hold_' + Date.now(),
      savedAt: new Date().toISOString(),
      ...order
    };
    list.unshift(newHold);
    this.save(STORAGE_KEYS.HOLD_ORDERS, list);
    return newHold;
  }

  removeHoldOrder(holdId) {
    let list = this.getHoldOrders();
    list = list.filter(h => h.id !== holdId);
    this.save(STORAGE_KEYS.HOLD_ORDERS, list);
  }

  // --- Expenses (Pengeluaran) ---
  getExpenses() {
    return this.load(STORAGE_KEYS.EXPENSES, initialExpenses);
  }

  addExpense(expense) {
    const list = this.getExpenses();
    const newExp = {
      id: 'exp_' + Date.now(),
      date: new Date().toISOString(),
      ...expense
    };
    list.unshift(newExp);
    this.save(STORAGE_KEYS.EXPENSES, list);
    return newExp;
  }

  deleteExpense(id) {
    let list = this.getExpenses();
    list = list.filter(e => e.id !== id);
    this.save(STORAGE_KEYS.EXPENSES, list);
  }

  // --- Customers & Loyalty ---
  getCustomers() {
    return this.load(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }

  saveCustomer(customer) {
    const list = this.getCustomers();
    const index = list.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      list[index] = customer;
    } else {
      list.push({
        id: 'cust_' + Date.now(),
        createdAt: new Date().toISOString(),
        points: 0,
        totalSpent: 0,
        totalOrders: 0,
        ...customer
      });
    }
    this.save(STORAGE_KEYS.CUSTOMERS, list);
  }

  redeemCustomerPoints(customerId, pointsRedeemed, discountAmount) {
    const customers = this.getCustomers();
    const cust = customers.find(c => c.id === customerId);
    if (!cust || (cust.points || 0) < pointsRedeemed) return false;
    cust.points = (cust.points || 0) - pointsRedeemed;
    this.save(STORAGE_KEYS.CUSTOMERS, customers);
    return true;
  }

  // --- Suppliers ---
  getSuppliers() {
    return this.load(STORAGE_KEYS.SUPPLIERS, initialSuppliers);
  }

  saveSupplier(supplier) {
    const list = this.getSuppliers();
    const index = list.findIndex(s => s.id === supplier.id);
    if (index >= 0) {
      list[index] = supplier;
    } else {
      list.push({
        id: 'sup_' + Date.now(),
        ...supplier
      });
    }
    this.save(STORAGE_KEYS.SUPPLIERS, list);
  }

  // --- Promos & Vouchers ---
  getPromos() {
    return this.load(STORAGE_KEYS.PROMOS, initialPromos);
  }

  savePromo(promo) {
    const list = this.getPromos();
    const index = list.findIndex(p => p.id === promo.id);
    if (index >= 0) {
      list[index] = promo;
    } else {
      list.push({
        id: 'prm_' + Date.now(),
        ...promo
      });
    }
    this.save(STORAGE_KEYS.PROMOS, list);
  }

  // --- Shift Management ---
  getActiveShift() {
    return this.load(STORAGE_KEYS.ACTIVE_SHIFT, null);
  }

  getShiftHistory() {
    return this.load(STORAGE_KEYS.SHIFT_HISTORY, []);
  }

  openShift(startingCash, notes = '') {
    const currentUser = this.getCurrentUser();
    const newShift = {
      id: 'shift_' + Date.now(),
      cashierId: currentUser?.id,
      cashierName: currentUser?.name,
      openedAt: new Date().toISOString(),
      startingCash: Number(startingCash || 0),
      closedAt: null,
      status: 'open',
      notes
    };
    this.save(STORAGE_KEYS.ACTIVE_SHIFT, newShift);
    return newShift;
  }

  closeShift(actualCashEntered, closingNotes = '') {
    const activeShift = this.getActiveShift();
    if (!activeShift) return null;

    // Calculate sales during this shift
    const transactions = this.getTransactions().filter(t => 
      t.status === 'completed' &&
      new Date(t.createdAt) >= new Date(activeShift.openedAt)
    );

    const cashSales = transactions
      .filter(t => t.paymentMethod === 'CASH')
      .reduce((sum, t) => sum + Number(t.total), 0);

    const qrisSales = transactions
      .filter(t => t.paymentMethod === 'QRIS')
      .reduce((sum, t) => sum + Number(t.total), 0);

    const expensesDuringShift = this.getExpenses()
      .filter(e => new Date(e.date) >= new Date(activeShift.openedAt))
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const expectedCashInDrawer = Number(activeShift.startingCash) + cashSales - expensesDuringShift;
    const actualCash = Number(actualCashEntered || 0);
    const variance = actualCash - expectedCashInDrawer;

    const closedShift = {
      ...activeShift,
      closedAt: new Date().toISOString(),
      status: 'closed',
      totalTransactions: transactions.length,
      cashSales,
      qrisSales,
      totalSales: cashSales + qrisSales,
      expensesDuringShift,
      expectedCashInDrawer,
      actualClosingCash: actualCash,
      cashVariance: variance,
      closingNotes
    };

    // Save to history and clear active shift
    const history = this.getShiftHistory();
    history.unshift(closedShift);
    this.save(STORAGE_KEYS.SHIFT_HISTORY, history);
    this.save(STORAGE_KEYS.ACTIVE_SHIFT, null);

    return closedShift;
  }

  // --- Financial Statistics & Calculations ---
  getDashboardStats() {
    const transactions = this.getTransactions();
    const expenses = this.getExpenses();
    const ingredients = this.getIngredients();
    const products = this.getProducts();

    const todayStr = new Date().toDateString();

    const todayTx = transactions.filter(t => 
      t.status === 'completed' &&
      new Date(t.createdAt).toDateString() === todayStr
    );

    const todaySales = todayTx.reduce((sum, t) => sum + Number(t.total), 0);
    const todayTransactionsCount = todayTx.length;

    const todayExpenses = expenses
      .filter(e => new Date(e.date).toDateString() === todayStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalSalesAllTime = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.total), 0);

    const totalExpensesAllTime = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Calculate product sales rank
    const productSalesMap = {};
    transactions
      .filter(t => t.status === 'completed')
      .forEach(t => {
        (t.items || []).forEach(item => {
          if (!productSalesMap[item.id]) {
            productSalesMap[item.id] = {
              id: item.id,
              name: item.name,
              qty: 0,
              totalRevenue: 0
            };
          }
          productSalesMap[item.id].qty += item.qty;
          productSalesMap[item.id].totalRevenue += item.qty * item.price;
        });
      });

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

    // Low stock warnings
    const lowStockIngredients = ingredients.filter(i => Number(i.stock) <= Number(i.minStock));

    // Cash vs QRIS today
    const todayCash = todayTx
      .filter(t => t.paymentMethod === 'CASH')
      .reduce((sum, t) => sum + Number(t.total), 0);

    const todayQris = todayTx
      .filter(t => t.paymentMethod === 'QRIS')
      .reduce((sum, t) => sum + Number(t.total), 0);

    // Estimated net profit today (Sales - COGS - Expenses)
    // Estimate gross margin around ~65% for ice cream
    const todayGrossProfit = Math.round(todaySales * 0.65);
    const todayNetProfit = todayGrossProfit - todayExpenses;

    return {
      todaySales,
      todayTransactionsCount,
      todayExpenses,
      todayNetProfit,
      totalSalesAllTime,
      totalExpensesAllTime,
      topProducts,
      lowStockIngredients,
      todayCash,
      todayQris,
      todayTx
    };
  }

  // Backup & Restore Database to JSON
  exportDatabaseJSON() {
    const dump = {};
    for (const key of Object.values(STORAGE_KEYS)) {
      dump[key] = this.load(key, null);
    }
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Diaz_IceCream_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  importDatabaseJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      for (const [key, val] of Object.entries(data)) {
        if (val !== null && val !== undefined) {
          localStorage.setItem(key, JSON.stringify(val));
        }
      }
      this.notify();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const db = new PosDatabase();
