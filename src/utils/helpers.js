// utils/helpers.js
// ================================================
// Kumpulan fungsi kecil yang dipakai di semua halaman.
// File ini tidak perlu diubah saat integrasi dengan backend Java.
// ================================================


/**
 * Membuat ID unik berdasarkan waktu + angka acak.
 * Contoh hasil: "lrd4a2bc"
 */
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}


/**
 * Mengambil tanggal hari ini dalam format YYYY-MM-DD.
 * Contoh hasil: "2025-05-14"
 */
export function today() {
  return new Date().toISOString().slice(0, 10)
}


/**
 * Memformat angka menjadi format Rupiah Indonesia.
 * Contoh: fmtRp(15000) → "Rp 15.000"
 */
export function fmtRp(n) {
  return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID')
}


/**
 * Membuat array berisi N tanggal terakhir (dari paling lama ke hari ini).
 * Contoh: lastN(3) → ['2025-05-12', '2025-05-13', '2025-05-14']
 */
export function lastN(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}


/**
 * Menampilkan tanggal hari ini dalam format panjang bahasa Indonesia.
 * Contoh hasil: "Rabu, 14 Mei 2025"
 */
export function formatDateLong(dateStr) {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr || Date.now()).toLocaleDateString('id-ID', opts)
}


/**
 * Label untuk pertanyaan keamanan.
 * Kunci = kode, Nilai = teks pertanyaan yang ditampilkan.
 */
export const SQ_LABELS = {
  ibu:   'Nama ibu kandung Anda?',
  smp:   'Nama SMP Anda?',
  hewan: 'Nama hewan peliharaan pertama?',
  kota:  'Kota kelahiran Anda?',
  guru:  'Nama guru SD favorit Anda?',
}
