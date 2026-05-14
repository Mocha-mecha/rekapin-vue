// services/productService.js
// Semua operasi produk (CRUD) ada di sini.
// Saat ini pakai localStorage. Saat backend siap: uncomment blok NANTI.

// import api from './api.js'  ← NANTI aktifkan ini

import { getUserId } from './authService.js'
import { getProduk, saveProduk } from '../utils/db.js'
import { genId } from '../utils/helpers.js'

export async function fetchProducts() {
  // NANTI: const res = await api.get('/produk'); return res.data
  return getProduk(getUserId())
}

export async function createProduct(data) {
  // NANTI: const res = await api.post('/produk', data); return res.data

  const userId  = getUserId()
  const prods   = getProduk(userId)
  const newProd = { id: genId(), ...data }
  saveProduk(userId, [...prods, newProd])
  return newProd
}

export async function updateProduct(id, data) {
  // NANTI: const res = await api.put('/produk/' + id, data); return res.data

  const userId = getUserId()
  const prods  = getProduk(userId)
  const idx    = prods.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Produk tidak ditemukan.')
  prods[idx] = { ...prods[idx], ...data }
  saveProduk(userId, prods)
  return prods[idx]
}

export async function deleteProduct(id) {
  // NANTI: await api.delete('/produk/' + id)

  const userId = getUserId()
  saveProduk(userId, getProduk(userId).filter(p => p.id !== id))
}

// Kurangi stok setelah checkout.
// Saat backend aktif: backend yang mengurangi stok (source of truth).
// Frontend hanya kirim request, lalu tampilkan stok terbaru dari response.
export async function deductStock(items) {
  // NANTI: const res = await api.post('/produk/deduct', { items }); return res.data

  const userId = getUserId()
  const prods  = getProduk(userId)
  items.forEach(({ id, qty }) => {
    const p = prods.find(x => x.id === id)
    if (p && p.hasStock) p.stock = Math.max(0, p.stock - qty)
  })
  saveProduk(userId, prods)
  return prods
}
