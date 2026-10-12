// Diaz Ice Cream POS - Data Export Service (CSV / Excel format)

export class ExportService {
  // Convert array of objects to CSV string and trigger download
  exportToCsv(filename, headers, rows) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(val => {
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      )
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export transactions report
  exportTransactions(transactions) {
    const headers = [
      'ID Transaksi',
      'Tanggal & Waktu',
      'Kasir',
      'Tipe Pesanan',
      'Meja',
      'Pelanggan',
      'Total Item',
      'Subtotal',
      'Diskon',
      'Pajak',
      'Total Akhir',
      'Metode Bayar',
      'Status'
    ];

    const rows = transactions.map(t => [
      t.id,
      new Date(t.createdAt).toLocaleString('id-ID'),
      t.cashierName || '-',
      t.orderType || 'Dine In',
      t.tableNo || '-',
      t.customerName || 'Umum',
      (t.items || []).reduce((sum, it) => sum + it.qty, 0),
      t.subtotal,
      t.discount,
      t.tax,
      t.total,
      t.paymentMethod,
      t.status
    ]);

    this.exportToCsv('Laporan_Penjualan_Diaz_IceCream', headers, rows);
  }

  // Export inventory and stock movements
  exportStock(ingredients, movements) {
    const headers = [
      'ID Bahan',
      'Nama Bahan',
      'Kategori',
      'Stok Saat Ini',
      'Stok Minimum',
      'Satuan',
      'Harga Modal',
      'Total Nilai Aset',
      'Supplier',
      'Status Stok'
    ];

    const rows = ingredients.map(ing => [
      ing.id,
      ing.name,
      ing.category,
      ing.stock,
      ing.minStock,
      ing.unit,
      ing.costPrice,
      ing.stock * ing.costPrice,
      ing.supplierName || '-',
      ing.stock <= 0 ? 'Habis' : (ing.stock <= ing.minStock ? 'Menipis' : 'Aman')
    ]);

    this.exportToCsv('Laporan_Stok_Bahan_Diaz_IceCream', headers, rows);
  }

  // Export expenses
  exportExpenses(expenses) {
    const headers = [
      'ID Pengeluaran',
      'Tanggal',
      'Kategori',
      'Keterangan',
      'Nominal',
      'Dicatat Oleh'
    ];

    const rows = expenses.map(e => [
      e.id,
      new Date(e.date).toLocaleDateString('id-ID'),
      e.category,
      e.note,
      e.amount,
      e.recordedBy || 'Admin'
    ]);

    this.exportToCsv('Laporan_Pengeluaran_Diaz_IceCream', headers, rows);
  }
}

export const exportService = new ExportService();
