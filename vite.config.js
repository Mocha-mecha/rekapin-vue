// vite.config.js
// File konfigurasi untuk menjalankan Vue.js dengan Node.js
// Tidak perlu diubah untuk pengembangan biasa

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // Aplikasi berjalan di http://localhost:3000
  }
})
