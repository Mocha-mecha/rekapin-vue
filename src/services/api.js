// services/api.js
// ─────────────────────────────────────────────────────────────
// Axios instance siap pakai untuk Spring Boot.
// Saat ini BELUM dipakai (semua masih localStorage).
// Cara aktifkan: uncomment baris 'import api from ...' di setiap service.
// ─────────────────────────────────────────────────────────────

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: auto-inject JWT token ke setiap request ──
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('rk_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  err => Promise.reject(err)
)

// ── Response: tangani error global ──
api.interceptors.response.use(
  res => res,
  err => {
    // Token expired / tidak valid → paksa logout
    if (err.response?.status === 401) {
      localStorage.removeItem('rk_token')
      localStorage.removeItem('rk_user')
      window.location.hash = '#/login'
    }
    // Ambil pesan error dari backend, fallback ke pesan default
    const message = err.response?.data?.message || err.message || 'Terjadi kesalahan pada server.'
    return Promise.reject(new Error(message))
  }
)

export default api

// ══════════════════════════════════════════════════════════════
// PANDUAN INTEGRASI SPRING BOOT
// ══════════════════════════════════════════════════════════════
//
// Saat backend Java sudah siap, buat file .env di root project:
//   VITE_API_URL=http://localhost:8080/api
//
// Endpoint yang dibutuhkan dari tim backend:
//
// POST /auth/login      → { token, user: { id, username, nama } }
// POST /auth/register   → { token, user: { id, username, nama } }
// POST /auth/logout     → 200 OK
// GET  /auth/profile    → { id, username, nama, sq }
// PUT  /auth/profile    → { nama, username }
// PUT  /auth/password   → { passwordLama, passwordBaru }
// PUT  /auth/security   → { sq, sa }
// GET  /auth/security/:username  → { sq }
// POST /auth/verify-answer  → { username, answer }
// POST /auth/reset-password → { username, newPassword }
// DELETE /auth/account  → 200 OK
//
// GET    /produk         → [{ id, nama, kat, sat, modal, jual, margin, diskon, hasStock, stock }]
// POST   /produk         → { ...data }
// PUT    /produk/:id     → { ...data }
// DELETE /produk/:id     → 200 OK
// POST   /produk/deduct  → { items: [{ id, qty }] } → [updatedProducts]
//
// GET    /transaksi      → [{ id, date, time, items, total, profit }]
// POST   /transaksi      → { items, total, profit }
// DELETE /transaksi      → 200 OK
// ══════════════════════════════════════════════════════════════
