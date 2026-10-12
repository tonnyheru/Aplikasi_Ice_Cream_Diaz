# Diaz Ice Cream POS (Point of Sale Mobile Android) 🍦

Aplikasi Kasir (Point of Sale) modern, profesional, dan responsif yang dirancang khusus untuk toko es krim **Diaz Ice Cream**. Aplikasi ini dioptimalkan untuk penggunaan smartphone Android (nyaman satu tangan) dan dilengkapi database offline-first, simulator frame Android, manajemen stok berbasis resep (BOM), QRIS dinamis, hingga pencetakan struk printer thermal Bluetooth 58mm/80mm.

---

## 🌟 Fitur Utama & Modul Lengkap

### 1. 📊 Dashboard Bisnis & KPI
* **Ringkasan Real-Time**: Total penjualan hari ini, jumlah transaksi, estimasi keuntungan bersih (laba bersih), pemasukan & pengeluaran.
* **Grafik Penjualan Interaktif**: Visualisasi tren penjualan harian (7 hari) dan bulanan (30 hari) menggunakan Chart.js.
* **Status Shift Kasir**: Indikator shift aktif beserta nama kasir yang bertugas.
* **Peringatan Stok Menipis**: Banner otomatis yang mendeteksi bahan baku di bawah batas minimum (*low stock threshold*).
* **Menu Terlaris (Best Seller)**: Peringkat 5 produk es krim paling laku berdasarkan kuantitas & omzet.
* **Perbandingan Pembayaran**: Bar distribusi persentase pembayaran Tunai (Cash) vs QRIS.
* **Aksi Cepat (Quick Actions)**: Transaksi Baru, Tambah Menu, Restock Bahan, Catat Pengeluaran, Laporan, dan Scan QRIS.

### 2. 🍨 Modul Kasir (POS) & Transaksi
* **Katalog Es Krim Visual**: Foto menu produk es krim berkualitas tinggi, label harga, dan kategori.
* **Pencarian Cepat & Barcode Simulator**: Cari produk berdasarkan nama, kode SKU, atau scan barcode dengan simulasi kamera & efek suara beep synthesizer.
* **Kategori Menu**: Semua Menu, Sundae, Cone, Cup, Waffle Ice Cream, Milkshake, Scoop, Topping, Minuman Segar, dan Paket Combo.
* **Bottom Sheet Kustomisasi Varian & Topping**:
  * Pilihan ukuran porsi (*Regular*, *Medium 2 Scoops*, *Large Jumbo 3 Scoops*).
  * Pilihan varian rasa (*Vanilla Madagascar*, *Rich Chocolate*, *Fresh Strawberry*, *Kyoto Matcha*, *Cookies & Cream*, *Sweet Mango*, *Wild Blueberry*).
  * Pilihan topping ekstra (*Oreo Crumb*, *Choco Chip*, *Almond Slice*, *Keju Cheddar*, *Belgian Chocolate Sauce*, *Caramel Drizzle*, *Rainbow Sprinkles*, *Boba*).
  * Catatan pesanan khusus (cth: "Saus dipisah", "Sendok 2").
  * Stepper kuantitas (- / +).
* **Keranjang Pesanan (Cart Drawer)**:
  * Pilihan tipe pesanan: **Dine In** (dengan input Nomor Meja), **Take Away**, dan **Delivery**.
  * Pemilihan Member Pelanggan (menampilkan saldo poin loyalitas).
  * Tukar poin loyalitas menjadi potongan harga langsung.
  * Input kode promo/voucher (cth: `WELCOME10`, `MANIS5K`).
  * Perhitungan otomatis: Subtotal, Diskon, Pajak Resto PB1 (10%), dan Total Akhir.
  * Fitur **Hold Order (Simpan Pesanan Sementara)** jika pelanggan ingin menambah pesanan nanti.

### 3. 💳 Pembayaran Fleksibel (Cash & QRIS Dinamis)
* **Tunai (Cash)**:
  * Tombol nominal cepat: Uang Pas, Rp 20.000, Rp 50.000, Rp 100.000, Rp 200.000.
  * Kalkulasi kembalian otomatis dengan validasi uang tidak boleh kurang dari total tagihan.
  * Efek suara mesin kasir (*cash drawer chime*) dan selebrasi konfeti saat transaksi berhasil.
* **QRIS Dinamis (EMVCo Indonesia)**:
  * Menampilkan QR Code dinamis resmi yang di-generate langsung di Canvas sesuai standar ASPI/Bank Indonesia.
  * Menampilkan nominal pembayaran, NMID toko, dan *countdown timer* 5 menit.
  * Status transaksi transparan: *Menunggu Pembayaran*, *Memverifikasi*, *Berhasil*, dan *Dibatalkan*.
  * Tombol **"Simulasi Pelanggan Scan & Bayar"** untuk menguji alur konfirmasi webhook payment gateway secara instan.

### 4. 🖨️ Cetak Struk & Printer Thermal
* **Format Kertas 58mm / 80mm**: Tampilan struk kertas thermal realistis dengan font monospaced.
* **Informasi Struk Lengkap**: Logo Diaz Ice Cream, Alamat toko, Telepon, No. Transaksi, Tanggal & Jam, Nama Kasir, Tipe Pesanan & Meja, Nama Pelanggan, Rincian item (varian rasa & topping), Subtotal, Diskon, Pajak PB1, Total, Metode Bayar, Uang Diterima, Kembalian, dan Ucapan Terima Kasih.
* **Fitur Cetak & Bagikan**:
  * **Cetak Struk**: Dialog cetak printer thermal bawaan browser menggunakan CSS `@media print`.
  * **Bluetooth ESC/POS**: Dukungan koneksi Web Bluetooth API ke printer thermal Bluetooth.
  * **Bagikan Struk**: Integrasi Web Share API dan salin teks format WhatsApp.
  * **Unduh File**: Simpan struk dalam format berkas teks untuk arsip digital.

### 5. 📦 Manajemen Stok & Resep Otomatis (Bill of Materials / BOM)
* **Resep Terintegrasi**: Setiap menu es krim memiliki formula bahan baku.
  * *Contoh*: Penjualan 1 Sundae Chocolate otomatis memotong 2 scoop es krim coklat, 1 pcs cup paper, 25 ml saus coklat, 1 porsi oreo crumb, dan 1 pcs sendok kayu.
* **Buku Mutasi Stok (Stock Movement Audit Trail)**: Seluruh pergerakan stok (Masuk dari supplier PO, Keluar dari kasir POS, atau Koreksi opname fisik) tercatat dengan tanggal, kuantitas, referensi, dan operator.
* **Restock Masuk**: Form pembelian stok bahan dari supplier yang secara otomatis juga mencatat pengeluaran keuangan kas toko.
* **Koreksi Stok Fisik**: Penyesuaian stok opname / *waste*.

### 6. ⏱️ Sistem Shift Kasir
* **Buka Shift**: Input modal awal kas tunai (*cash float*) sebelum kasir melayani transaksi.
* **Aktivitas Shift**: Menghitung secara otomatis penjualan tunai, QRIS, dan pengeluaran kas selama shift berlangsung.
* **Tutup Shift**: Input fisik uang di laci kasir, membandingkan uang sistem dengan uang fisik, menampilkan selisih (*variance: Pas / Lebih / Kurang*), dan menyimpan rekap laporan shift.

### 7. 💸 Pemasukan & Pengeluaran Operasional
* Pencatatan biaya: Bahan Baku, Kemasan, Listrik/Freezer, Air & Kebersihan, Transportasi, Gaji Karyawan, Maintenance Mesin, dan Lainnya.
* Rekapitulasi buku kas dan riwayat biaya operasional.

### 8. 📈 Laporan & Analitik Bisnis
* Filter periode: Hari Ini, 7 Hari Terakhir, 30 Hari, dan Semua Waktu.
* Laporan Total Penjualan, Laba Kotor, Pengeluaran, dan Laba Bersih.
* Laporan Metode Pembayaran (Cash vs QRIS).
* Laporan 5 Menu Terlaris.
* Laporan Transaksi Dibatalkan (Void) yang mengembalikan stok bahan baku.
* **Ekspor Data ke CSV/Excel**:
  * Unduh Laporan Penjualan (`.csv`)
  * Unduh Laporan Stok & Bahan Baku (`.csv`)
  * Unduh Laporan Pengeluaran Operasional (`.csv`)

### 9. 👥 CRM Pelanggan & Supplier
* **Pelanggan**: Pendaftaran member, riwayat belanja, saldo poin loyalitas, tukar poin dengan diskon belanja.
* **Supplier**: Daftar kontak supplier dairy, kemasan, topping, dan pemesanan restock cepat.

### 10. ⚙️ Pengaturan Toko & Keamanan Multi-Role
* **Multi-Role**: Role **Owner/Admin** (akses penuh) & Role **Kasir** (terbatas operasional POS).
* **Sistem PIN Login**: Cepat beralih akun kasir dengan 4 digit PIN (Demo: Admin `1234`, Kasir 1 `1111`, Kasir 2 `2222`).
* **Pengaturan Toko**: Nama toko, slogan, alamat, nomor telepon, akun Instagram, tarif pajak PB1, format ukuran kertas struk (58mm/80mm), NMID QRIS, dan footer struk.
* **Cadangkan Database (Backup JSON)**: Ekspor dan simpan seluruh database offline toko ke format JSON.
* **Tampilan Mode HP / Fullscreen**: Tombol di header untuk beralih antara simulator layar smartphone Android atau layar penuh responsif.
* **Mode Gelap / Terang**: Dukungan dark mode dengan palet warna kontras tinggi.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi berjalan menggunakan Vite dev server:

1. **Jalankan Dev Server**:
   ```bash
   npm run dev
   ```
2. **Buka di Browser**:
   * Komputer / Laptop: Akses `http://localhost:5173/`
   * Smartphone Android (WiFi yang sama): Akses `http://<IP-LOKAL>:5173/`
3. **Membangun Bundle Produksi**:
   ```bash
   npm run build
   ```

---

## 🎨 Arsitektur & Teknologi

* **Frontend**: Vanilla JavaScript (ES Modules) & Vanilla CSS (Desain Material 3 Android pastel cream, strawberry pink, & dark choco).
* **Build Tool**: Vite v6.
* **Grafik**: Chart.js.
* **QRIS**: QRCode generator (standar TLV EMVCo ASPI).
* **Printer**: Web Bluetooth API & CSS Thermal Print Stylesheet (`@media print`).
* **Audio Feedback**: Web Audio API (synthesized chime & beep tanpa dependensi audio eksternal).
* **Storage**: LocalStorage & IndexedDB persistent database dengan auto-seeding data dummy es krim realistis.
