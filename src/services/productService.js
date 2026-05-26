// services/productService.js
// Semua operasi produk (CRUD) terhubung ke backend Spring Boot.

import api from './api.js'

function toFrontendProduct(p = {}) {
  return {
    id:       p.id,
    nama:     p.nama ?? p.name ?? '',
    kat:      p.kat ?? p.category ?? '',
    sat:      p.sat ?? p.unit ?? '',
    modal:    Number(p.modal ?? p.costPrice ?? 0),
    jual:     Number(p.jual ?? p.sellingPrice ?? 0),
    diskon:   Number(p.diskon ?? p.discount ?? 0),
    hasStock: Boolean(p.hasStock ?? p.useStock ?? false),
    stock:    Number(p.stock ?? 0),
  }
}

function toBackendProduct(p = {}) {
  return {
    name:         p.nama,
    category:     p.kat || null,
    unit:         p.sat || null,
    costPrice:    Number(p.modal || 0),
    sellingPrice: Number(p.jual || 0),
    discount:     Number(p.diskon || 0),
    useStock:     Boolean(p.hasStock),
    stock:        p.hasStock ? Number(p.stock || 0) : 0,
  }
}

export async function fetchProducts() {
  const products = await api.get('/products')
  return products.map(toFrontendProduct)
}

export async function createProduct(data) {
  const product = await api.post('/products', toBackendProduct(data))
  return toFrontendProduct(product)
}

export async function updateProduct(id, data) {
  const product = await api.put('/products/' + id, toBackendProduct(data))
  return toFrontendProduct(product)
}

export async function deleteProduct(id) {
  await api.delete('/products/' + id)
}

// Backend memotong stok secara atomic saat transaksi dibuat.
// Fungsi ini dipertahankan agar TransaksiView tidak perlu tahu detail backend.
export async function deductStock() {
  return fetchProducts()
}
