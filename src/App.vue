<template>
  <!--
    App.vue adalah komponen "induk" dari seluruh aplikasi.
    Di sini kita tentukan: tampilkan Login atau tampilkan App (dengan sidebar).

    <RouterView> adalah placeholder — Vue otomatis mengisinya
    dengan halaman yang sesuai berdasarkan URL.
  -->

  <!-- Halaman landing & login → tanpa sidebar -->
  <RouterView v-if="!isLoggedIn" />

  <!-- Sudah login → tampilkan layout dengan sidebar -->
  <AppLayout v-else>
    <RouterView />
  </AppLayout>

  <!-- Toast notifikasi (tampil di pojok kanan bawah) -->
  <AppToast />
</template>

<script>
import AppLayout from './components/AppLayout.vue'
import AppToast  from './components/AppToast.vue'
import { isAuthenticated } from './services/authService.js'

export default {
  name: 'App',

  // Daftarkan komponen yang dipakai di template
  components: { AppLayout, AppToast },

  data() {
    return {
      // true = sudah login, false = belum login
      isLoggedIn: false,
    }
  },

  created() {
    // Cek sesi setiap kali halaman dimuat
    this.checkAuth()

    // Pantau perubahan route (URL) — cek ulang status login
    this.$router.afterEach(() => {
      this.checkAuth()
    })
  },

  methods: {
    checkAuth() {
      this.isLoggedIn = isAuthenticated()
    }
  }
}
</script>
