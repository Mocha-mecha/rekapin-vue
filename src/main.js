// main.js
// File ini adalah pintu masuk utama aplikasi Vue.js
// Di sini kita "menyalakan" Vue dan menghubungkan semua bagian

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Import CSS global (style.css berlaku untuk seluruh aplikasi)
import './assets/style.css'

// Buat aplikasi Vue, pasang router, lalu tampilkan ke #app di index.html
createApp(App)
  .use(router)
  .mount('#app')
