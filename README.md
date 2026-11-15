# Titik Seduh – Aplikasi Coffe‑shop UTS React 2026

Aplikasi SPA (single‑page application) untuk warung kopi **Titik Seduh** yang memungkinkan pengguna:

- Melihat menu minuman & makanan  
- Menambahkan item ke keranjang belanja  
- Memberikan rating & komentar  
- Melihat riwayat pesanan  
- Menyimpan favorit, komentar, keranjang & notifikasi di `localStorage`  

Aplikasi dibuat sesuai **Ketentuan UTS React Fundamental 2026** (PDF `Ketentuan_UTS_KopiKu.pdf`).

---

## 📦 Teknologi & Versi

| Area                     | Versi / Alat                              |
|--------------------------|-------------------------------------------|
| **React**                | `^19.3.1` (React 19)                      |
| **Vite**                 | `^5.4.21` (Vite 5)                        |
| **Package manager**      | `pnpm`                                    |
| **Ikon**                 | `lucide‑react` ^1.73.0                    |
| **Styling**              | CSS global di `src/index.css` (Tanpa Bootstrap/Tailwind) |
| **State & Context**      | `useReducer` + Context (Keranjang, Notifikasi, Toast, Favorit, Komentar) |
| **Persistensi**          | Custom hook `useLocalStorage`             |
| **Navigasi**             | Hash‑routing (`#beranda` / `#menu`) – tanpa library routing eksternal |
| **Build / Lint**         | `pnpm dev` → server `http://127.0.0.1:5173`  <br> `pnpm build` → produksi <br> `pnpm lint` → ESLint |

---

## ✨ Fitur Utama

1. **Halaman Beranda** – Hero carousel, grid “Picks”, promo banner, tombol **Menu** → halaman menu.  
2. **Halaman Menu** –  
   * Header sticky: navigasi *Beranda / Menu*, kotak pencarian + rekomendasi populer, tombol notifikasi/keranjang/riwayat (klik = modal/preview lengkap; hover = panel cepat), tab kategori (*Semua / Kopi / Non‑Kopi / Makanan / Snack / Favorit*).  
   * Tab **Semua** menampilkan heading “Pilih titik seduhmu.” + statistik + grid 16 menu.  
   * Setiap tab kategori (**Kopi, Non‑Kopi, Makanan, Snack, Favorit**) menampilkan grid menu langsung (tanpa heading intro).  
3. **Kartu Menu (`MenuCard`)** – 8 properti wajib (`id, name, category, price, stock, image, description, rating`). Tombol aksi:  
   * **Info** → popup data lengkap (kategori, harga, stok, rating, deskripsi, ulasan).  
   * **Suka/Favorit** → ikon berganti warna, menyimpan ke tab Favorit, toast & notifikasi.  
   * **Komentar** → modal rating bintang 1‑5 + textarea ≥ 5 karakter, daftar komentar tampil di atas tanpa menutup popup.  
   * **Add** → tambah ke keranjang (cek stok).  
4. **Keranjang (`CartDrawer`)** – Drawer bertumpuk di bawah header, menampung: item + kuantitas, subtotal, pajak 10%, kode promo (`UTS25 / HEMAT10 / KOPI15`), dan **Checkout** yang meminta **nama pemesan** sebelum pembayaran.  
5. **Riwayat (`HistoryModal`)** – Daftar transaksi lengkap dengan total, metode pembayaran, kolom **Nama Pemesan**, tombol **Reset stok & riwayat** (favorit & komentar tetap).  
6. **Notifikasi** – Setiap aksi (favorit, komentar, keranjang, promo, pesanan) menampilkan toast dan disimpan di daftar notifikasi; badge lonceng menampilkan jumlah belum dibaca.  
7. **Favorit & Komentar** – Disimpan di `localStorage` melalui `useLocalStorage`; tidak hilang saat reload.  
8. **Footer** – Credit `© 2026 Pangeran Valerensco` + navigasi ke beranda, menu, cerita.  

---

## 📱 Responsivitas

- Grid menu: 3 kolom desktop → 2 kolom tablet → 1 kolom ponsel.  
- Header kompakt saat discroll kebawah; topbar menghilang.  
- Quick‑panel notifikasi/keranjang/riwayat di‑mobile berubah menjadi **bottom‑sheet** yang tetap di bawah header.  
- Search suggestions & carousel menyesuaikan ukuran di `< 900 px`.  

---

## 🗂 Struktur File (sesuai ketentuan)

```
uts-pangeranvalerensco/
├─ public/
│  ├─ images/               ← 15 foto menu asli + KopiBirong.jpg (16 gambar)
│  └─ Favicon.svg
├─ src/
│  ├─ components/           ← Header, Footer, MainContent,
│  │   MenuCard, Modal, CartDrawer,
│  │   HistoryModal, NotificationsModal,
│  │   HeroCarousel, StorySection, ConfirmModal
│  ├─ context/              ← CartContext,
│  │   ToastContext, NotificationContext
│  ├─ hooks/                ← useLocalStorage.js
│  ├─ data/                 ← MenuData.js (16 items, 8 props)
│  ├─ utils/                ← pricing.js (promo, pajak, format Rupiah)
│  ├─ index.css             ← seluruh styling global
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
└─ package.json
```

---

## ▶ Cara Menjalankan

```bash
# 1. Instal dependensi
pnpm install

# 2. Jalankan development server
pnpm dev          # → http://127.0.0.1:5173

# 3. Build produksi
pnpm build        # → pastikan lulus tanpa error

# 4. (Opsional) Pratinjau build
pnpm preview
```

---

## 📜 Kepatuhan terhadap PDF `Ketentuan_UTS_KopiKu.pdf`

| Kriteria PDF | Status di proyek ini |
|--------------|----------------------|
| Proyek React + Vite + pnpm | ✅ `package.json` menggunakan `react ^19.3.1`, `vite ^5.4.21`, `pnpm` |
| 3 komponen wajib (Header, Footer, MainContent) | ✅ Ada di `src/components` |
| Minimal 13 data menu, 8 properti per item | ✅ 16 menu (15 asli + `KopiBirong.jpg`); setiap item memiliki `id, name, category, price, stock, image, description, rating` |
| Setiap action pakai popup, bukan `alert()`/`prompt()` | ✅ Semua aksi menampilkan toast/ modal kustom |
| CSS hanya di `src/index.css` (dilarang Bootstrap/Tailwind) | ✅ Semua gaya ditulis sendiri |
| Ikon hanya dari `lucide‑react` | ✅ Semua ikon menggunakan `lucide‑react` |
| Foto menu dari Unsplash/Wikimedia, disimpan di `public/images` | ✅ 15 foto asli disimpan, plus `KopiBirong.jpg` (total 16 – masih memenuhi “minimal 13” dan tidak melanggar larangan) |
| Pencarian & filter di Header (Semua / Kopi / Non‑Kopi / Makanan / Snack / Favorit) + jumlah item | ✅ Kotak pencarian + daftar rekomendasi + tab kategori dengan count |
| Sortir di tab Favorit (terbaru/terlama, harga, rating, nama) | ✅ Diimplementasikan di `App.jsx` & `MainContent` |
| Popup komentar + daftar komentar | ✅ `CommentModal` menampilkan rating, textarea ≥ 5 karakter, dan daftar komentar yang langsung muncul di atas tanpa menutup popup |
| Notifikasi terpusat (toast + daftar) | ✅ Setiap aksi memicu toast & menyimpan di `NotificationContext`; badge lonceng menampilkan jumlah belum dibaca |
| Keranjang belanja (tambah/kurang/hapus, batas stok, promo UTS25/HEMAT10/KOPI15, pajak 10%, struk pembayaran) | ✅ `CartProvider` menangani stok, promo, pajak, struk, tampilan di `CartDrawer` |
| Riwayat transaksi (popup berisi daftar pesanan, total, tombol reset stok + riwayat) | ✅ `HistoryModal` menampilkan riwayat, total, tombol reset |
| Penyimpanan lokal (favorit, komentar, keranjang, notifikasi via `useLocalStorage`) | ✅ Semua data lokal disimpan dan pulih setelah reload |
| **Nilai plus**: tampilan responsif, grid menu, toolbar, drawer menyesuaikan layar ponsel | ✅ Media query sudah diterapkan, layout fleksibel |
| **Nilai plus**: Struktur file sesuai contoh | ✅ Struktur folder sesuai contoh dalam PDF |
| **Larangan**: Bootstrap/framework CSS, `alert()`/`prompt()`/`confirm()` bawaan browser | ✅ Tidak menggunakan Bootstrap; tidak ada pemanggilan `alert`/`prompt`/`confirm` |
| `pnpm build` lulus tanpa error | ✅ Build berhasil (lihat output sebelumnya) |
| **Catatan kecil**: PDF menanyakannya “15 foto menu asli”; proyek ini memiliki **16** gambar (15 asli + `KopiBirong.jpg`). Ini masih memenuhi ketentuan “minimal 13” dan tidak melanggar larangan. | — |

**Kesimpulan:**  
Semua **ketentuan wajib** dalam PDF terpenuhi. Tidak ada larangan yang dilanggar. Proyek hanya sedikit melebihi jumlah foto yang ditentukan (16 vs 15), yang dianggap **acceptabel** karena ketentuan hanya menetapkan batas minimal.

---

## 🛠 Catatan Pengembangan

- Input **Nama pemesan** hanya muncul di halaman **Checkout**; form komentar **tidak** memerlukan nama.  
- Tombol Notifikasi, Riwayat, dan Keranjang di Header bisa dibuka **baik dengan hover (panel cepat) maupun dengan klik (modal/preview lengkap)**.  
- Semua tombol aksi memunculkan **popup kustom (toast / modal)**, bukan `alert/prompt/confirm` bawaan browser.  
- Build dan lint both lulus di lingkungan `pnpm` tanpa konfigurasi tambahan.

---

Jika ada fitur tambahan atau penyesuaian spesifik yang ingin Anda tambahkan, silakan beri tahu! Happy coding!