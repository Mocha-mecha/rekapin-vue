<template>
  <!--
    AppLayout.vue = Kerangka utama aplikasi setelah login.
    Terdiri dari: Sidebar (kiri) + Area Konten (kanan).

    <slot /> adalah tempat di mana halaman aktif akan ditampilkan.
    Contoh: saat URL = /dashboard, maka DashboardView masuk ke <slot />.
  -->
  <div class="app-shell">

    <!-- ══ SIDEBAR (Navigasi Kiri) ══ -->
    <aside id="sidebar">

      <!-- Logo & Nama User -->
      <div class="sidebar-brand">
        <div class="brand-name">Rekap<span style="color: var(--accent3)">in</span></div>
        <div class="brand-user">{{ namaUser }}</div>
      </div>

      <!-- Menu Navigasi -->
      <nav class="sidebar-nav">
        <button
          v-for="menu in menuList"
          :key="menu.path"
          class="nav-item"
          :class="{ active: currentPage === menu.path }"
          @click="navigasi(menu.path)"
        >
          <span class="nav-icon">{{ menu.icon }}</span>
          {{ menu.label }}
        </button>
      </nav>

      <!-- Bagian bawah sidebar: Tanggal & Tombol Keluar -->
      <div class="sidebar-footer">
        <div class="sidebar-date">{{ tanggalHariIni }}</div>
        <button class="btn-logout" @click="logout">↩ Keluar</button>
      </div>

    </aside>

    <!-- ══ AREA KONTEN UTAMA ══ -->
    <main id="main">
      <!--
        <slot /> = tempat halaman aktif ditampilkan.
        Di App.vue kita tulis: <AppLayout><RouterView /></AppLayout>
        Jadi RouterView (halaman aktif) masuk ke sini.
      -->
      <slot />
    </main>

  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script>
import { getUser, logout as authLogout } from '../services/authService.js'
import { formatDateLong } from '../utils/helpers.js'

export default {
  name: 'AppLayout',

  data() {
    return {
      namaUser: '',
      tanggalHariIni: '',

      // Daftar menu navigasi di sidebar
      menuList: [
        { path: '/dashboard', icon: '◈', label: 'Dashboard'   },
        { path: '/transaksi', icon: '⊞', label: 'Transaksi'   },
        { path: '/produk',    icon: '◧', label: 'Produk'       },
        { path: '/laporan',   icon: '≡', label: 'Laporan'      },
        { path: '/settings',  icon: '⚙', label: 'Pengaturan'  },
      ]
    }
  },

  computed: {
    // Ambil path URL saat ini untuk highlight menu yang aktif
    currentPage() {
      return this.$route.path
    }
  },

  mounted() {
    // Ambil nama user dari sesi
    const user = getUser()
    if (user) {
      this.namaUser = user.nama || user.username
    }

    // Set tanggal hari ini
    this.tanggalHariIni = formatDateLong()
  },

  methods: {
    // Pindah halaman saat menu diklik
    navigasi(path) {
      this.$router.push(path)
    },

    // Keluar dari aplikasi
    logout() {
      if (!confirm('Yakin ingin keluar dari aplikasi?')) return
      authLogout()
      this.$router.push('/login')
    }
  }
}
</script>
