// router/index.js
// ================================================
// Pengatur halaman — menentukan URL mana menampilkan halaman apa.
//
// Cara kerja:
//   /login      → LoginView.vue
//   /dashboard  → DashboardView.vue
//   /transaksi  → TransaksiView.vue
//   /produk     → ProdukView.vue
//   /laporan    → LaporanView.vue
//   /settings   → SettingsView.vue
// ================================================

import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthenticated } from '../services/authService.js'

// Import semua halaman (Views)
import LandingView   from '../views/LandingView.vue'
import LoginView     from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TransaksiView from '../views/TransaksiView.vue'
import ProdukView    from '../views/ProdukView.vue'
import LaporanView   from '../views/LaporanView.vue'
import SettingsView  from '../views/SettingsView.vue'

// Daftar semua halaman dan URL-nya
const routes = [
  { path: '/', component: LandingView, meta: { landingOnly: true } },
  { path: '/login',     component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/transaksi', component: TransaksiView, meta: { requiresAuth: true } },
  { path: '/produk',    component: ProdukView,    meta: { requiresAuth: true } },
  { path: '/laporan',   component: LaporanView,   meta: { requiresAuth: true } },
  { path: '/settings',  component: SettingsView,  meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHashHistory(), // Pakai # di URL agar mudah di-hosting
  routes,
})

// Penjaga halaman: cek login sebelum masuk halaman yang membutuhkan auth
// Jika belum login → paksa ke /login
router.beforeEach((to) => {
  const authed = isAuthenticated()
  if (to.meta.requiresAuth && !authed) return '/login'
  if ((to.path === '/login' || to.meta.landingOnly) && authed) return '/dashboard'
})

export default router
