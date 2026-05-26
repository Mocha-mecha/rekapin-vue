<template>
  <!-- ══ HALAMAN PENGATURAN ══ -->
  <section class="page active">
    <div class="page-header">
      <div class="page-title">Pengaturan Akun</div>
      <div class="page-sub">Kelola informasi dan keamanan akun Anda</div>
    </div>

    <div class="page-body">
      <div class="settings-grid">

        <!-- ── Informasi Profil ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <div class="settings-card-icon">◉</div>
            <div>
              <div class="settings-card-title">Informasi Profil</div>
              <div class="settings-card-sub">Nama toko dan username</div>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="form-field">
              <label class="form-label">Nama Toko / Usaha</label>
              <input v-model="profil.nama" type="text" class="form-input" placeholder="Nama toko Anda" />
            </div>
            <div class="form-field">
              <label class="form-label">Username</label>
              <input v-model="profil.username" type="text" class="form-input mono readonly-input" placeholder="Username" readonly />
              <div class="form-hint">Username bersifat tetap dan tidak dapat diubah.</div>
            </div>
            <div v-if="profil.error" class="auth-error show">{{ profil.error }}</div>
            <button class="btn-primary" @click="simpanProfil">Simpan Profil</button>
          </div>
        </div>

        <!-- ── Ganti Password ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <div class="settings-card-icon">⬡</div>
            <div>
              <div class="settings-card-title">Ganti Password</div>
              <div class="settings-card-sub">Perbarui password akun Anda</div>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="form-field">
              <label class="form-label">Password Lama</label>
              <div class="input-pw-wrap">
                <input v-model="pw.lama" :type="pw.showLama ? 'text' : 'password'" class="form-input" placeholder="Password saat ini" />
                <button type="button" class="btn-toggle-pw" @click="pw.showLama = !pw.showLama">Lihat</button>
              </div>
            </div>
            <div class="form-field">
              <label class="form-label">Password Baru</label>
              <div class="input-pw-wrap">
                <input v-model="pw.baru" :type="pw.showBaru ? 'text' : 'password'" class="form-input" placeholder="Minimal 4 karakter" />
                <button type="button" class="btn-toggle-pw" @click="pw.showBaru = !pw.showBaru">Lihat</button>
              </div>
            </div>
            <div class="form-field">
              <label class="form-label">Konfirmasi Password Baru</label>
              <div class="input-pw-wrap">
                <input v-model="pw.konfirmasi" :type="pw.showKonfirmasi ? 'text' : 'password'" class="form-input" placeholder="Ulangi password baru" />
                <button type="button" class="btn-toggle-pw" @click="pw.showKonfirmasi = !pw.showKonfirmasi">Lihat</button>
              </div>
            </div>
            <div v-if="pw.error" class="auth-error show">{{ pw.error }}</div>
            <button class="btn-primary" @click="gantiPassword">Ganti Password</button>
          </div>
        </div>

        <!-- ── Zona Berbahaya ── -->
        <div class="settings-card danger-card">
          <div class="settings-card-header">
            <div class="settings-card-icon" style="color:var(--danger)">⚠</div>
            <div>
              <div class="settings-card-title" style="color:var(--danger)">Zona Berbahaya</div>
              <div class="settings-card-sub">Tindakan ini tidak bisa dibatalkan</div>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="danger-action">
              <div>
                <div class="danger-action-title">Hapus Semua Data Transaksi</div>
                <div class="danger-action-desc">Menghapus seluruh riwayat transaksi. Produk tetap ada.</div>
              </div>
              <button class="btn-danger" @click="hapusTransaksi">Hapus Transaksi</button>
            </div>
            <div class="danger-action" style="margin-top:16px;padding-top:16px;border-top:1px solid #f5c6c2">
              <div>
                <div class="danger-action-title">Hapus Akun</div>
                <div class="danger-action-desc">Menghapus akun beserta semua data secara permanen.</div>
              </div>
              <button class="btn-danger" @click="hapusAkun">Hapus Akun</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import * as authSvc from '../services/authService.js'
import { deleteAllTransactions } from '../services/transactionService.js'
import { validatePasswordChange } from '../utils/validation.js'

export default {
  name: 'SettingsView',

  data() {
    return {
      // Data form profil
      profil: { nama: '', username: '', error: '' },

      // Data form ganti password
      pw: { lama: '', baru: '', konfirmasi: '', showLama: false, showBaru: false, showKonfirmasi: false, error: '' },
      saving: false,
    }
  },

  mounted() {
    this.muatData()
  },

  methods: {
    async muatData() {
      try {
        const user = await authSvc.getUserDetails()
        if (!user) return
        this.profil.nama     = user.nama     || ''
        this.profil.username = user.username || ''
      } catch (err) {
        window.showToast('Gagal memuat data: ' + err.message, 'error')
      }
    },

    // ── Simpan Profil ──
    async simpanProfil() {
      this.profil.error = ''
      const { nama, username } = this.profil
      if (!nama) { this.profil.error = 'Nama toko wajib diisi.'; return }

      this.saving = true
      try {
        await authSvc.updateProfile({ nama, username })
        window.showToast('✓ Profil berhasil diperbarui!', 'success')
      } catch (err) {
        this.profil.error = err.message
      } finally {
        this.saving = false
      }
    },

    // ── Ganti Password ──
    async gantiPassword() {
      this.pw.error = ''
      const errors = validatePasswordChange({
        passwordLama: this.pw.lama, passwordBaru: this.pw.baru, passwordKonfirmasi: this.pw.konfirmasi
      })
      if (errors.length) { this.pw.error = errors[0]; return }

      this.saving = true
      try {
        await authSvc.changePassword({ passwordLama: this.pw.lama, passwordBaru: this.pw.baru })
        this.pw = { lama: '', baru: '', konfirmasi: '', showLama: false, showBaru: false, showKonfirmasi: false, error: '' }
        window.showToast('✓ Password berhasil diganti!', 'success')
      } catch (err) {
        this.pw.error = err.message
      } finally {
        this.saving = false
      }
    },

    // ── Hapus Semua Transaksi ──
    async hapusTransaksi() {
      if (!confirm('Yakin ingin menghapus semua data transaksi? Tindakan ini tidak bisa dibatalkan.')) return
      try {
        await deleteAllTransactions()
        window.showToast('Semua transaksi berhasil dihapus.', 'success')
      } catch (err) {
        window.showToast('Gagal menghapus: ' + err.message, 'error')
      }
    },

    // ── Hapus Akun ──
    async hapusAkun() {
      if (!confirm('Yakin ingin menghapus akun? Semua data akan hilang permanen.')) return
      try {
        await authSvc.deleteAccount()
        this.$router.push('/login')
      } catch (err) {
        window.showToast('Gagal menghapus akun: ' + err.message, 'error')
      }
    },
  }
}
</script>
