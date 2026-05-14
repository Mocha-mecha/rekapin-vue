# Rekapin — Frontend Vue.js

Aplikasi rekap penjualan harian untuk UMKM.
Dibangun dengan **Vue.js 3** dan dijalankan menggunakan **Node.js** (via Vite).

---

## Struktur Folder

```
rekapin-vue/
│
├── index.html                  ← File HTML utama (pintu masuk)
├── vite.config.js              ← Konfigurasi server pengembangan
├── package.json                ← Daftar library yang dipakai
│
└── src/
    ├── main.js                 ← Titik masuk Vue.js
    ├── App.vue                 ← Komponen induk (root)
    │
    ├── assets/
    │   └── style.css           ← Semua CSS (tampilan) ada di sini
    │
    ├── utils/
    │   ├── helpers.js          ← Fungsi-fungsi kecil (fmtRp, genId, dll.)
    │   └── db.js               ← Lapisan data (ganti ini saat API Java siap)
    │
    ├── router/
    │   └── index.js            ← Pengatur URL / halaman
    │
    ├── components/
    │   ├── AppLayout.vue       ← Kerangka app: sidebar + konten
    │   └── AppToast.vue        ← Komponen notifikasi toast
    │
    └── views/
        ├── LoginView.vue       ← Halaman Login, Register, Lupa Password
        ├── DashboardView.vue   ← Halaman Dashboard (grafik & statistik)
        ├── TransaksiView.vue   ← Halaman Transaksi POS
        ├── ProdukView.vue      ← Halaman Manajemen Produk
        ├── LaporanView.vue     ← Halaman Laporan / Rekapitulasi
        └── SettingsView.vue    ← Halaman Pengaturan Akun
```

---

## Cara Menjalankan

### 1. Pastikan Node.js Sudah Terinstall
Buka terminal, cek versi Node.js:
```bash
node --version
```
Jika belum ada, download di: https://nodejs.org (pilih versi LTS)

### 2. Masuk ke Folder Project
```bash
cd rekapin-vue
```

### 3. Install Library (Lakukan Sekali Saja)
```bash
npm install
```
Perintah ini akan mengunduh semua library yang dibutuhkan (Vue, Chart.js, dll.)

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Aplikasi akan berjalan di: **http://localhost:3000**

Buka browser dan ketik alamat tersebut.

---

## Penjelasan File Penting untuk Pemula

### `src/utils/db.js` — LAPISAN DATA
File ini adalah **jembatan antara FE dan data**.

Saat ini semua fungsi membaca/menulis ke **localStorage** (data tersimpan di browser).

Ketika **backend Java sudah siap**, kamu cukup **mengubah fungsi-fungsi di file ini saja** — file lain tidak perlu disentuh.

Contoh perubahan:
```javascript
// SEKARANG (localStorage):
export function getProduk() {
  return JSON.parse(localStorage.getItem('rk_products') || '[]')
}

// NANTI (API Java):
export async function getProduk() {
  const res = await fetch('http://localhost:8080/api/produk', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  })
  return await res.json()
}
```

---

### `src/views/*.vue` — HALAMAN-HALAMAN
Setiap file `.vue` terdiri dari **3 bagian**:

```vue
<template>
  <!-- HTML: tampilan yang dilihat pengguna -->
</template>

<script>
// JavaScript: logika dan data halaman
</script>

<style>
  /* CSS: styling khusus halaman ini (jika ada) */
  /* Styling utama ada di src/assets/style.css */
</style>
```

---

### `src/router/index.js` — PENGATUR HALAMAN
Menentukan URL mana menampilkan halaman apa:

| URL | Halaman |
|-----|---------|
| `/login` | LoginView.vue |
| `/dashboard` | DashboardView.vue |
| `/transaksi` | TransaksiView.vue |
| `/produk` | ProdukView.vue |
| `/laporan` | LaporanView.vue |
| `/settings` | SettingsView.vue |

---

## Cara Kerja Vue.js (Singkat)

### `v-model` — Menghubungkan Input dengan Data
```vue
<input v-model="nama" />
<!-- Ketika user mengetik, nilai 'nama' di data() otomatis berubah -->
```

### `v-if` / `v-else` — Tampilkan/Sembunyikan Elemen
```vue
<div v-if="isLoggedIn">Selamat datang!</div>
<div v-else>Silakan login.</div>
```

### `v-for` — Tampilkan List
```vue
<div v-for="produk in listProduk" :key="produk.id">
  {{ produk.nama }}
</div>
```

### `@click` — Menangani Klik
```vue
<button @click="simpanData">Simpan</button>
```

### `{{ }}` — Menampilkan Data
```vue
<p>Total: {{ fmtRp(totalHarga) }}</p>
```

---

## Integrasi dengan Backend Java (Panduan untuk Tim)

Semua perubahan untuk koneksi ke API Java **cukup dilakukan di `src/utils/db.js`**.

### Header yang Dibutuhkan (JWT)
```javascript
// Tambahkan helper ini di db.js setelah backend siap:
function authHeader() {
  const token = localStorage.getItem('token')
  return {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
}
```

### Endpoint yang Dibutuhkan dari Tim Backend

| Method | URL | Fungsi |
|--------|-----|--------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Daftar user baru |
| GET | `/api/produk` | Ambil semua produk |
| POST | `/api/produk` | Tambah produk baru |
| PUT | `/api/produk/{id}` | Edit produk |
| DELETE | `/api/produk/{id}` | Hapus produk |
| GET | `/api/transaksi` | Ambil semua transaksi |
| POST | `/api/transaksi` | Simpan transaksi baru |
| DELETE | `/api/transaksi` | Hapus semua transaksi |

---

## Build untuk Production (Deploy)

Jika ingin di-hosting (Railway, VPS, dll.):
```bash
npm run build
```
Hasilnya ada di folder `dist/`. Upload isi folder ini ke hosting.

---

## Library yang Digunakan

| Library | Fungsi |
|---------|--------|
| **Vue.js 3** | Framework JavaScript untuk membangun tampilan |
| **Vue Router** | Mengatur navigasi antar halaman |
| **Chart.js** | Membuat grafik (omzet, top produk) |
| **Vite** | Tool untuk menjalankan dan mem-build aplikasi |
