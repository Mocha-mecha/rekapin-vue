// utils/db.js
// Lapisan data localStorage — satu-satunya file yang tahu tentang localStorage.
// Saat backend Java siap, HANYA file ini + services/ yang perlu diubah.
//
// PERUBAHAN PENTING:
//   Data produk & transaksi sekarang terisolasi per user.
//   Key format: rk_products_<userId>, rk_transactions_<userId>

// ── Key generators ──
const KEY_USERS = 'rk_users'
const prodKey   = uid => `rk_products_${uid}`
const trxKey    = uid => `rk_transactions_${uid}`

// ══════════════════════════════════════
//  USERS (global — tidak per-user)
// ══════════════════════════════════════

export function getUsers() {
  return JSON.parse(localStorage.getItem(KEY_USERS) || '[]')
}

export function saveUsers(users) {
  localStorage.setItem(KEY_USERS, JSON.stringify(users))
}

// ══════════════════════════════════════
//  PRODUK (per user)
// ══════════════════════════════════════

export function getProduk(userId) {
  if (!userId) return []
  return JSON.parse(localStorage.getItem(prodKey(userId)) || '[]')
}

export function saveProduk(userId, produk) {
  if (!userId) return
  localStorage.setItem(prodKey(userId), JSON.stringify(produk))
}

// ══════════════════════════════════════
//  TRANSAKSI (per user)
// ══════════════════════════════════════

export function getTransaksi(userId) {
  if (!userId) return []
  return JSON.parse(localStorage.getItem(trxKey(userId)) || '[]')
}

export function saveTransaksi(userId, transaksi) {
  if (!userId) return
  localStorage.setItem(trxKey(userId), JSON.stringify(transaksi))
}

// ══════════════════════════════════════
//  SEED DATA (data contoh untuk user baru)
//  Dipanggil sekali setelah register/login pertama kali.
// ══════════════════════════════════════

export function seedDataIfEmpty(userId) {
  if (!userId || localStorage.getItem(prodKey(userId))) return
  saveProduk(userId, [
    { id: 'p1', nama: 'Es Teh Manis',  kat: 'Minuman', sat: 'gelas', modal: 2000,  jual: 5000,  margin: 60, diskon: 0,  hasStock: false, stock: 0  },
    { id: 'p2', nama: 'Nasi Goreng',   kat: 'Makanan', sat: 'porsi', modal: 8000,  jual: 15000, margin: 47, diskon: 0,  hasStock: true,  stock: 20 },
    { id: 'p3', nama: 'Kopi Hitam',    kat: 'Minuman', sat: 'gelas', modal: 3000,  jual: 7000,  margin: 57, diskon: 0,  hasStock: false, stock: 0  },
    { id: 'p4', nama: 'Kentang Goreng',kat: 'Makanan', sat: 'porsi', modal: 5000,  jual: 10000, margin: 50, diskon: 10, hasStock: true,  stock: 15 },
  ])
}
