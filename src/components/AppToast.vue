<template>
  <!-- Wadah toast — posisi pojok kanan bawah (dari CSS) -->
  <div id="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', toast.type]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppToast',

  data() {
    return {
      toasts: [] // Array toast yang sedang ditampilkan
    }
  },

  mounted() {
    // Daftarkan fungsi showToast ke window agar bisa dipanggil dari mana saja:
    // window.showToast('Berhasil!', 'success')
    window.showToast = (message, type = 'success') => {
      const id = Date.now()
      this.toasts.push({ id, message, type })

      // Hapus toast setelah 3 detik
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id)
      }, 3000)
    }
  }
}
</script>
