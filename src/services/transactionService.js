// services/transactionService.js
// Semua operasi transaksi terhubung ke backend Spring Boot.

import api from './api.js'

function toIsoStart(date) {
  return date ? `${date}T00:00:00` : undefined
}

function toIsoEnd(date) {
  return date ? `${date}T23:59:59` : undefined
}

function mapItem(item = {}) {
  return {
    id:          item.id,
    productId:   item.productId ?? item.product?.id,
    productName: item.productName,
    hargaJual:   Number(item.hargaJual ?? item.sellingPrice ?? 0),
    hargaModal:  Number(item.hargaModal ?? item.costPrice ?? 0),
    qty:         Number(item.qty ?? item.quantity ?? 0),
    subtotal:    Number(item.subtotal ?? 0),
  }
}

function mapTransaction(t = {}) {
  const created = t.createdAt ? new Date(t.createdAt) : new Date()
  return {
    id:     t.id,
    date:   t.date ?? created.toISOString().slice(0, 10),
    time:   t.time ?? created.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    items:  (t.items || []).map(mapItem),
    total:  Number(t.total ?? t.totalAmount ?? 0),
    profit: Number(t.profit ?? t.estimatedProfit ?? 0),
  }
}

export async function fetchTransactions({ dari, sampai } = {}) {
  const params = {}
  if (dari) params.start = toIsoStart(dari)
  if (sampai) params.end = toIsoEnd(sampai)

  const transactions = await api.get('/transactions', { params })
  return transactions.map(mapTransaction)
}

export async function createTransaction(keranjang) {
  const payload = {
    items: keranjang.map(item => ({
      productId: item.id,
      quantity:  item.qty,
    })),
  }
  const transaction = await api.post('/transactions', payload)
  return mapTransaction(transaction)
}

export async function deleteAllTransactions() {
  await api.delete('/transactions')
}
