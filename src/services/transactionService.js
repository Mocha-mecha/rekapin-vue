// services/transactionService.js
// Semua operasi transaksi ada di sini.
// Saat ini pakai localStorage. Saat backend siap: uncomment blok NANTI.

// import api from './api.js'  ← NANTI aktifkan ini

import { getUserId } from './authService.js'
import { getTransaksi, saveTransaksi } from '../utils/db.js'
import { genId, today } from '../utils/helpers.js'

export async function fetchTransactions({ dari, sampai } = {}) {
  // NANTI:
  // const res = await api.get('/transaksi', { params: { dari, sampai } })
  // return res.data

  let trx = getTransaksi(getUserId())
  if (dari)   trx = trx.filter(t => t.date >= dari)
  if (sampai) trx = trx.filter(t => t.date <= sampai)
  return trx
}

export async function createTransaction(keranjang, { total, profit }) {
  // NANTI:
  // const payload = { items: keranjang, total, profit }
  // const res = await api.post('/transaksi', payload)
  // return res.data  ← termasuk stok terbaru dari server

  const userId = getUserId()
  const trx = {
    id:     genId(),
    date:   today(),
    time:   new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    items:  keranjang.map(c => ({
      productId:   c.id,
      productName: c.nama,
      hargaJual:   c.jual,
      hargaModal:  c.modal,
      qty:         c.qty,
    })),
    total,
    profit,
  }

  const existing = getTransaksi(userId)
  saveTransaksi(userId, [...existing, trx])
  return trx
}

export async function deleteAllTransactions() {
  // NANTI: await api.delete('/transaksi')
  saveTransaksi(getUserId(), [])
}
