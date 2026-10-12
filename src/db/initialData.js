// Diaz Ice Cream POS - Comprehensive Realistic Initial Data

export const initialStoreSettings = {
  store: {
    name: 'Diaz Ice Cream',
    tagline: 'Sensasi Kelezatan Es Krim Segar & Premium',
    address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
    phone: '0812-9876-5432',
    email: 'halo@diazicecream.id',
    footerMessage: 'Terima kasih telah berkunjung! Semoga harimu semanis es krim Diaz!',
    instagram: '@diazicecream.jkt',
    paperSize: '58mm', // 58mm or 80mm
    taxRate: 10, // 10% PB1
    taxEnabled: true,
    currency: 'Rp',
    qrisNmid: 'ID1020349812480',
    receiptPrefix: 'DIAZ-'
  }
};

export const initialUsers = [
  {
    id: 'usr_admin',
    name: 'Diaz Pratama',
    role: 'admin',
    pin: '1234',
    title: 'Owner & Store Manager',
    avatar: '👑'
  },
  {
    id: 'usr_kasir1',
    name: 'Siti Rahma',
    role: 'cashier',
    pin: '1111',
    title: 'Senior Cashier',
    avatar: '🍨'
  },
  {
    id: 'usr_kasir2',
    name: 'Budi Santoso',
    role: 'cashier',
    pin: '2222',
    title: 'Cashier Shift Siang',
    avatar: '🍦'
  }
];

export const initialCategories = [
  { id: 'all', name: 'Semua Menu', icon: '✨' },
  { id: 'sundae', name: 'Sundae', icon: '🍨' },
  { id: 'cone', name: 'Ice Cream Cone', icon: '🍦' },
  { id: 'cup', name: 'Ice Cream Cup', icon: '🍧' },
  { id: 'waffle', name: 'Waffle Ice Cream', icon: '🧇' },
  { id: 'milkshake', name: 'Milkshake', icon: '🥤' },
  { id: 'scoop', name: 'Ice Cream Scoop', icon: '🥄' },
  { id: 'topping', name: 'Topping Ekstra', icon: '🍫' },
  { id: 'drink', name: 'Minuman Segar', icon: '🧃' },
  { id: 'combo', name: 'Paket Combo', icon: '🎁' }
];

export const initialFlavors = [
  { id: 'vanilla', name: 'Vanilla Madagascar', color: '#FDF6B2' },
  { id: 'choco', name: 'Rich Chocolate', color: '#78350F' },
  { id: 'strawberry', name: 'Fresh Strawberry', color: '#F472B6' },
  { id: 'matcha', name: 'Kyoto Matcha', color: '#84CC16' },
  { id: 'cookies', name: 'Cookies & Cream', color: '#334155' },
  { id: 'mango', name: 'Sweet Mango Puree', color: '#FBBF24' },
  { id: 'blueberry', name: 'Wild Blueberry', color: '#6366F1' }
];

export const initialSizes = [
  { id: 'regular', name: 'Regular (1 Scoop)', priceOffset: 0 },
  { id: 'medium', name: 'Medium (2 Scoops)', priceOffset: 6000 },
  { id: 'large', name: 'Large Jumbo (3 Scoops)', priceOffset: 12000 }
];

export const initialToppings = [
  { id: 'top_oreo', name: 'Oreo Crumb Biskuit', price: 3000, icon: '🍪' },
  { id: 'top_chocochip', name: 'Choco Chip Crunchy', price: 3000, icon: '🍫' },
  { id: 'top_almond', name: 'Almond Slice Sangrai', price: 5000, icon: '🥜' },
  { id: 'top_cheese', name: 'Parutan Keju Cheddar', price: 4000, icon: '🧀' },
  { id: 'top_chocosauce', name: 'Belgian Chocolate Sauce', price: 3000, icon: '🤎' },
  { id: 'top_caramel', name: 'Salted Caramel Drizzle', price: 3000, icon: '🍯' },
  { id: 'top_sprinkles', name: 'Rainbow Sprinkles', price: 2000, icon: '🌈' },
  { id: 'top_boba', name: 'Brown Sugar Boba', price: 4000, icon: '🧋' }
];

export const initialIngredients = [
  {
    id: 'ing_vanilla',
    name: 'Ice Cream Base Vanilla Madagascar',
    category: 'Ice Cream Tub',
    stock: 120,
    minStock: 25,
    unit: 'scoop',
    costPrice: 2500,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_choco',
    name: 'Ice Cream Base Belgian Dark Chocolate',
    category: 'Ice Cream Tub',
    stock: 110,
    minStock: 25,
    unit: 'scoop',
    costPrice: 2800,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_berry',
    name: 'Ice Cream Base Fresh Strawberry',
    category: 'Ice Cream Tub',
    stock: 95,
    minStock: 20,
    unit: 'scoop',
    costPrice: 2700,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_matcha',
    name: 'Ice Cream Base Kyoto Matcha',
    category: 'Ice Cream Tub',
    stock: 50,
    minStock: 15,
    unit: 'scoop',
    costPrice: 3200,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_mango',
    name: 'Ice Cream Base Sweet Mango',
    category: 'Ice Cream Tub',
    stock: 14, // Warning: Low stock!
    minStock: 20,
    unit: 'scoop',
    costPrice: 2600,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_cone',
    name: 'Waffle Cone Crispy Sugar',
    category: 'Kemasan & Cone',
    stock: 85,
    minStock: 20,
    unit: 'pcs',
    costPrice: 1200,
    supplierId: 'sup2',
    supplierName: 'PT Mitra Kemasan Nusantara'
  },
  {
    id: 'ing_cup',
    name: 'Paper Cup Diaz Custom 12oz',
    category: 'Kemasan & Cone',
    stock: 180,
    minStock: 30,
    unit: 'pcs',
    costPrice: 850,
    supplierId: 'sup2',
    supplierName: 'PT Mitra Kemasan Nusantara'
  },
  {
    id: 'ing_spoon',
    name: 'Sendok Kayu Eco Wood',
    category: 'Kemasan & Cone',
    stock: 220,
    minStock: 40,
    unit: 'pcs',
    costPrice: 250,
    supplierId: 'sup2',
    supplierName: 'PT Mitra Kemasan Nusantara'
  },
  {
    id: 'ing_oreo',
    name: 'Oreo Crumb Biskuit Asli',
    category: 'Topping & Sauce',
    stock: 70,
    minStock: 15,
    unit: 'porsi',
    costPrice: 1100,
    supplierId: 'sup3',
    supplierName: 'Toko Bahan Kue Berkah'
  },
  {
    id: 'ing_almond',
    name: 'Roasted Almond Slice',
    category: 'Topping & Sauce',
    stock: 45,
    minStock: 12,
    unit: 'porsi',
    costPrice: 2200,
    supplierId: 'sup3',
    supplierName: 'Toko Bahan Kue Berkah'
  },
  {
    id: 'ing_chocosauce',
    name: 'Belgian Chocolate Sauce Syrup',
    category: 'Topping & Sauce',
    stock: 850,
    minStock: 200,
    unit: 'ml',
    costPrice: 150,
    supplierId: 'sup3',
    supplierName: 'Toko Bahan Kue Berkah'
  },
  {
    id: 'ing_caramel',
    name: 'Salted Caramel Sauce Pure',
    category: 'Topping & Sauce',
    stock: 620,
    minStock: 150,
    unit: 'ml',
    costPrice: 150,
    supplierId: 'sup3',
    supplierName: 'Toko Bahan Kue Berkah'
  },
  {
    id: 'ing_sprinkles',
    name: 'Rainbow Candy Sprinkles',
    category: 'Topping & Sauce',
    stock: 80,
    minStock: 15,
    unit: 'porsi',
    costPrice: 600,
    supplierId: 'sup3',
    supplierName: 'Toko Bahan Kue Berkah'
  },
  {
    id: 'ing_waffle',
    name: 'Adonan Fresh Belgian Waffle Batter',
    category: 'Adonan & Roti',
    stock: 35,
    minStock: 10,
    unit: 'porsi',
    costPrice: 3800,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  },
  {
    id: 'ing_milk',
    name: 'Susu Segar UHT Full Cream',
    category: 'Bahan Minuman',
    stock: 3500,
    minStock: 1000,
    unit: 'ml',
    costPrice: 25,
    supplierId: 'sup1',
    supplierName: 'CV Sumber Susu & Dairy Sejahtera'
  }
];

export const initialProducts = [
  {
    id: 'prod_sundae_choco',
    code: 'IC-SD01',
    barcode: '8991001001',
    name: 'Sundae Chocolate Delight',
    category: 'sundae',
    basePrice: 28000,
    costPrice: 10500,
    description: 'Sundae es krim coklat mewah dengan lelehan saus coklat Belgia, oreo crumb, dan cherry manis.',
    image: '/images/sundae_chocolate.jpg',
    isAvailable: true,
    availableFlavors: ['choco', 'vanilla', 'cookies'],
    recipe: [
      { ingredientId: 'ing_choco', qty: 2, unit: 'scoop' },
      { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' },
      { ingredientId: 'ing_chocosauce', qty: 25, unit: 'ml' },
      { ingredientId: 'ing_oreo', qty: 1, unit: 'porsi' },
      { ingredientId: 'ing_spoon', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'prod_cone_classic',
    code: 'IC-CN01',
    barcode: '8991001002',
    name: 'Classic Crispy Waffle Cone',
    category: 'cone',
    basePrice: 18000,
    costPrice: 4800,
    description: 'Es krim lembut berpadu renyahnya sugar waffle cone dan taburan rainbow sprinkles.',
    image: '/images/vanilla_cone.jpg',
    isAvailable: true,
    availableFlavors: ['vanilla', 'choco', 'strawberry', 'matcha'],
    recipe: [
      { ingredientId: 'ing_vanilla', qty: 1, unit: 'scoop' },
      { ingredientId: 'ing_cone', qty: 1, unit: 'pcs' },
      { ingredientId: 'ing_sprinkles', qty: 1, unit: 'porsi' }
    ]
  },
  {
    id: 'prod_cup_duo',
    code: 'IC-CP01',
    barcode: '8991001003',
    name: 'Artisan Duo Cup (Strawberry & Matcha)',
    category: 'cup',
    basePrice: 26000,
    costPrice: 9500,
    description: 'Kombinasi harmonis stroberi segar dan teh hijau matcha Kyoto dengan taburan roasted almond.',
    image: '/images/strawberry_matcha.jpg',
    isAvailable: true,
    availableFlavors: ['strawberry', 'matcha', 'vanilla', 'mango'],
    recipe: [
      { ingredientId: 'ing_berry', qty: 1, unit: 'scoop' },
      { ingredientId: 'ing_matcha', qty: 1, unit: 'scoop' },
      { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' },
      { ingredientId: 'ing_almond', qty: 1, unit: 'porsi' },
      { ingredientId: 'ing_spoon', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'prod_waffle_supreme',
    code: 'IC-WF01',
    barcode: '8991001004',
    name: 'Belgian Waffle Supreme Ice Cream',
    category: 'waffle',
    basePrice: 35000,
    costPrice: 13500,
    description: 'Waffle hangat renyah di luar lembut di dalam, disajikan dengan 2 scoop es krim, saus karamel & coklat.',
    image: '/images/waffle_icecream.jpg',
    isAvailable: true,
    availableFlavors: ['vanilla', 'choco', 'strawberry'],
    recipe: [
      { ingredientId: 'ing_waffle', qty: 1, unit: 'porsi' },
      { ingredientId: 'ing_vanilla', qty: 2, unit: 'scoop' },
      { ingredientId: 'ing_chocosauce', qty: 20, unit: 'ml' },
      { ingredientId: 'ing_caramel', qty: 20, unit: 'ml' }
    ]
  },
  {
    id: 'prod_milkshake_creamy',
    code: 'IC-MS01',
    barcode: '8991001005',
    name: 'Diaz Thick & Creamy Milkshake',
    category: 'milkshake',
    basePrice: 24000,
    costPrice: 8500,
    description: 'Milkshake kental dengan perpaduan susu segar premium dan es krim pilihan bertekstur lembut.',
    image: '/images/strawberry_matcha.jpg',
    isAvailable: true,
    availableFlavors: ['strawberry', 'choco', 'vanilla', 'mango'],
    recipe: [
      { ingredientId: 'ing_milk', qty: 200, unit: 'ml' },
      { ingredientId: 'ing_berry', qty: 2, unit: 'scoop' },
      { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'prod_single_scoop',
    code: 'IC-SC01',
    barcode: '8991001006',
    name: 'Single Scoop Pure Ice Cream',
    category: 'scoop',
    basePrice: 12000,
    costPrice: 3600,
    description: 'Satu scoop es krim original sesuai varian favorit pilihan Anda dalam cup ramah lingkungan.',
    image: '/images/vanilla_cone.jpg',
    isAvailable: true,
    availableFlavors: ['vanilla', 'choco', 'strawberry', 'matcha', 'mango', 'cookies', 'blueberry'],
    recipe: [
      { ingredientId: 'ing_vanilla', qty: 1, unit: 'scoop' },
      { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' },
      { ingredientId: 'ing_spoon', qty: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'prod_combo_family',
    code: 'IC-CB01',
    barcode: '8991001007',
    name: 'Combo Sweet Family (2 Cone + 1 Sundae)',
    category: 'combo',
    basePrice: 58000,
    costPrice: 21000,
    description: 'Paket hemat keluarga berisi 2 Waffle Cone favorit ditambah 1 Sundae Chocolate Delight!',
    image: '/images/sundae_chocolate.jpg',
    isAvailable: true,
    availableFlavors: ['vanilla', 'choco'],
    recipe: [
      { ingredientId: 'ing_cone', qty: 2, unit: 'pcs' },
      { ingredientId: 'ing_vanilla', qty: 2, unit: 'scoop' },
      { ingredientId: 'ing_cup', qty: 1, unit: 'pcs' },
      { ingredientId: 'ing_choco', qty: 2, unit: 'scoop' },
      { ingredientId: 'ing_chocosauce', qty: 25, unit: 'ml' },
      { ingredientId: 'ing_oreo', qty: 1, unit: 'porsi' }
    ]
  }
];

export const initialCustomers = [
  {
    id: 'cust_01',
    name: 'Amanda Putri',
    phone: '0812-8888-1111',
    email: 'amanda.putri@email.com',
    points: 240,
    totalSpent: 450000,
    totalOrders: 12,
    createdAt: '2026-08-15'
  },
  {
    id: 'cust_02',
    name: 'Kevin Sanjaya',
    phone: '0813-9999-2222',
    email: 'kevin.sanjaya@email.com',
    points: 150,
    totalSpent: 310000,
    totalOrders: 8,
    createdAt: '2026-09-01'
  },
  {
    id: 'cust_03',
    name: 'Dian Sastrowardoyo',
    phone: '0811-3333-7777',
    email: 'dian.sastro@email.com',
    points: 80,
    totalSpent: 160000,
    totalOrders: 4,
    createdAt: '2026-09-20'
  }
];

export const initialSuppliers = [
  {
    id: 'sup1',
    name: 'CV Sumber Susu & Dairy Sejahtera',
    phone: '0811-2233-4455',
    address: 'Kawasan Agrowisata Cisarua No. 12, Bogor',
    itemsSupplied: 'Ice Cream Tub Base, Susu UHT, Butter Waffle'
  },
  {
    id: 'sup2',
    name: 'PT Mitra Kemasan Nusantara',
    phone: '0812-4455-6677',
    address: 'Kawasan Industri Jatake Blok C-4, Tangerang',
    itemsSupplied: 'Waffle Cone, Paper Cup 12oz, Sendok Kayu'
  },
  {
    id: 'sup3',
    name: 'Toko Bahan Kue Berkah Abadi',
    phone: '0813-7788-9900',
    address: 'Pasar Baru No. 89, Jakarta Pusat',
    itemsSupplied: 'Oreo Crumb, Almond Slice, Belgian Sauce, Sprinkles'
  }
];

export const initialPromos = [
  {
    id: 'prm_welcome',
    code: 'WELCOME10',
    name: 'Diskon Spesial 10%',
    type: 'percent',
    value: 10,
    minOrder: 20000,
    maxDiscount: 10000,
    isActive: true
  },
  {
    id: 'prm_manis5k',
    code: 'MANIS5K',
    name: 'Potongan Langsung Rp 5.000',
    type: 'nominal',
    value: 5000,
    minOrder: 30000,
    maxDiscount: 5000,
    isActive: true
  },
  {
    id: 'prm_family20k',
    code: 'HEMAT20K',
    name: 'Diskon Belanja Hemat Rp 20.000',
    type: 'nominal',
    value: 20000,
    minOrder: 75000,
    maxDiscount: 20000,
    isActive: true
  }
];

export const initialExpenses = [
  {
    id: 'exp_01',
    date: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    category: 'Bahan Baku',
    amount: 320000,
    note: 'Restock Susu Segar UHT & Butter Dairy',
    recordedBy: 'Diaz Pratama',
    proofImage: null
  },
  {
    id: 'exp_02',
    date: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    category: 'Operasional & Listrik',
    amount: 250000,
    note: 'Token Listrik Freezer Pendingin Toko',
    recordedBy: 'Diaz Pratama',
    proofImage: null
  },
  {
    id: 'exp_03',
    date: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    category: 'Kemasan',
    amount: 180000,
    note: 'Restock Paper Cup & Sendok Kayu Eco',
    recordedBy: 'Siti Rahma',
    proofImage: null
  }
];

export const initialStockMovements = [
  {
    id: 'mov_01',
    ingredientId: 'ing_vanilla',
    ingredientName: 'Ice Cream Base Vanilla Madagascar',
    type: 'in', // 'in' or 'out'
    qty: 50,
    unit: 'scoop',
    reference: 'PO Supplier CV Sumber Susu',
    note: 'Restock mingguan supplier',
    date: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    userId: 'usr_admin',
    userName: 'Diaz Pratama'
  },
  {
    id: 'mov_02',
    ingredientId: 'ing_mango',
    ingredientName: 'Ice Cream Base Sweet Mango',
    type: 'out',
    qty: 15,
    unit: 'scoop',
    reference: 'Penjualan Kasir',
    note: 'Otomatis dari transaksi kasir',
    date: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    userId: 'usr_kasir1',
    userName: 'Siti Rahma'
  }
];

// Helper to generate simulated past transactions
export function getInitialTransactions() {
  const now = Date.now();
  return [
    {
      id: 'DIAZ-261007-001',
      createdAt: new Date(now - 3600 * 1000 * 4.5).toISOString(),
      cashierId: 'usr_kasir1',
      cashierName: 'Siti Rahma',
      customerId: 'cust_01',
      customerName: 'Amanda Putri',
      orderType: 'Dine In',
      tableNo: '04',
      items: [
        {
          id: 'prod_sundae_choco',
          name: 'Sundae Chocolate Delight',
          size: 'Regular',
          variants: ['Rich Chocolate'],
          toppings: [{ name: 'Oreo Crumb Biskuit', price: 3000 }],
          price: 31000,
          qty: 1,
          note: 'Extra sendok'
        },
        {
          id: 'prod_cone_classic',
          name: 'Classic Crispy Waffle Cone',
          size: 'Regular',
          variants: ['Vanilla Madagascar'],
          toppings: [],
          price: 18000,
          qty: 1,
          note: ''
        }
      ],
      subtotal: 49000,
      discount: 4900,
      discountLabel: 'WELCOME10 (-10%)',
      taxRate: 10,
      tax: 4410,
      total: 48510,
      paymentMethod: 'QRIS',
      cashTendered: 48510,
      change: 0,
      status: 'completed',
      qrisRef: 'QRIS-8934719401'
    },
    {
      id: 'DIAZ-261007-002',
      createdAt: new Date(now - 3600 * 1000 * 3).toISOString(),
      cashierId: 'usr_kasir1',
      cashierName: 'Siti Rahma',
      customerId: null,
      customerName: 'Pelanggan Umum',
      orderType: 'Take Away',
      tableNo: '',
      items: [
        {
          id: 'prod_waffle_supreme',
          name: 'Belgian Waffle Supreme Ice Cream',
          size: 'Regular',
          variants: ['Vanilla Madagascar', 'Rich Chocolate'],
          toppings: [{ name: 'Almond Slice Sangrai', price: 5000 }],
          price: 40000,
          qty: 2,
          note: 'Dipisah sausnya'
        }
      ],
      subtotal: 80000,
      discount: 5000,
      discountLabel: 'MANIS5K (-Rp 5.000)',
      taxRate: 10,
      tax: 7500,
      total: 82500,
      paymentMethod: 'CASH',
      cashTendered: 100000,
      change: 17500,
      status: 'completed'
    },
    {
      id: 'DIAZ-261007-003',
      createdAt: new Date(now - 3600 * 1000 * 1.5).toISOString(),
      cashierId: 'usr_kasir1',
      cashierName: 'Siti Rahma',
      customerId: 'cust_02',
      customerName: 'Kevin Sanjaya',
      orderType: 'Dine In',
      tableNo: '02',
      items: [
        {
          id: 'prod_cup_duo',
          name: 'Artisan Duo Cup (Strawberry & Matcha)',
          size: 'Medium (2 Scoops)',
          variants: ['Fresh Strawberry', 'Kyoto Matcha'],
          toppings: [{ name: 'Choco Chip Crunchy', price: 3000 }],
          price: 35000,
          qty: 1,
          note: ''
        },
        {
          id: 'prod_milkshake_creamy',
          name: 'Diaz Thick & Creamy Milkshake',
          size: 'Regular',
          variants: ['Fresh Strawberry'],
          toppings: [],
          price: 24000,
          qty: 1,
          note: 'Dingin ekstra'
        }
      ],
      subtotal: 59000,
      discount: 0,
      discountLabel: '',
      taxRate: 10,
      tax: 5900,
      total: 64900,
      paymentMethod: 'QRIS',
      cashTendered: 64900,
      change: 0,
      status: 'completed',
      qrisRef: 'QRIS-9923841123'
    }
  ];
}

export const initialActiveShift = {
  id: 'shift_' + new Date().toISOString().slice(0, 10) + '_1',
  cashierId: 'usr_kasir1',
  cashierName: 'Siti Rahma',
  openedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  startingCash: 200000, // Modal awal Rp 200.000
  closedAt: null,
  status: 'open',
  actualClosingCash: 0,
  cashVariance: 0,
  notes: 'Shift Pagi - Siang toko ice cream berjalan lancar'
};
