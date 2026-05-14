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
              <input v-model="profil.username" type="text" class="form-input" placeholder="Username" />
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

        <!-- ── Pertanyaan Keamanan ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <div class="settings-card-icon">◈</div>
            <div>
              <div class="settings-card-title">Pertanyaan Keamanan</div>
              <div class="settings-card-sub">Dipakai jika lupa password</div>
            </div>
          </div>
          <div class="settings-card-body">
            <!-- Tampilkan pertanyaan aktif jika ada -->
            <div v-if="pertanyaanAktif" class="sq-current">
              <div class="sq-label">Pertanyaan aktif saat ini</div>
              <div class="sq-question">{{ pertanyaanAktif }}</div>
            </div>
            <div class="form-field">
              <label class="form-label">Pertanyaan Baru</label>
              <select v-model="keamanan.sq" class="form-input">
                <option value="">— Pilih pertanyaan —</option>
                <option v-for="(label, key) in SQ_LABELS" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Jawaban Baru</label>
              <input v-model="keamanan.sa" type="text" class="form-input" placeholder="Jawaban keamanan baru" />
            </div>
            <div v-if="keamanan.error" class="auth-error show">{{ keamanan.error }}</div>
            <button class="btn-primary" @click="simpanKeamanan">Simpan Pertanyaan</button>
          </div>
        </div>

        <!-- ── Akun Sosial ── -->
        <div class="settings-card">
          <div class="settings-card-header">
            <div class="settings-card-icon">⊞</div>
            <div>
              <div class="settings-card-title">Akun Sosial</div>
              <div class="settings-card-sub">Hubungkan dengan akun pihak ketiga</div>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="social-connect-list">
              <div v-for="s in socialList" :key="s.key" class="social-connect-item">
                <div class="social-connect-info">
                  <span :class="['social-badge', s.badgeClass]">
                    <img :src="s.img" :alt="s.nama" style="width:18px;height:18px;object-fit:contain;" />
                  </span>
                  <div>
                    <div class="social-connect-name">{{ s.nama }}</div>
                    <div class="social-connect-status needs-backend">Butuh backend server</div>
                  </div>
                </div>
                <button class="btn-sm">Hubungkan</button>
              </div>
            </div>
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
import { SQ_LABELS } from '../utils/helpers.js'
import iconGoogle from '../assets/icons/google.svg'
import iconApple  from '../assets/icons/apple.svg'
import iconEmail  from '../assets/icons/email.svg'

export default {
  name: 'SettingsView',

  data() {
    return {
      SQ_LABELS,

      // Data form profil
      profil: { nama: '', username: '', error: '' },

      // Data form ganti password
      pw: { lama: '', baru: '', konfirmasi: '', showLama: false, showBaru: false, showKonfirmasi: false, error: '' },

      // Data form pertanyaan keamanan
      keamanan: { sq: '', sa: '', error: '' },

      // Pertanyaan keamanan yang sedang aktif
      pertanyaanAktif: '',
      saving: false,

      // Daftar social login
      socialList: [
        { key: 'google', nama: 'Google',          img: iconGoogle, badgeClass: 'google-badge' },
        { key: 'apple',  nama: 'Apple',            img: iconApple,  badgeClass: 'apple-badge'  },
        { key: 'email',  nama: 'Magic Email Link', img: iconEmail,  badgeClass: 'email-badge'  },
      ]
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
        if (user.sq) this.pertanyaanAktif = SQ_LABELS[user.sq] || user.sq
      } catch (err) {
        window.showToast('Gagal memuat data: ' + err.message, 'error')
      }
    },

    // ── Simpan Profil ──
    async simpanProfil() {
      this.profil.error = ''
      const { nama, username } = this.profil
      if (!nama || !username) { this.profil.error = 'Nama toko dan username wajib diisi.'; return }

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

    // ── Simpan Pertanyaan Keamanan ──
    async simpanKeamanan() {
      this.keamanan.error = ''
      const { sq, sa } = this.keamanan
      if (!sq || !sa) { this.keamanan.error = 'Pertanyaan dan jawaban wajib diisi.'; return }

      this.saving = true
      try {
        await authSvc.changeSecurityQuestion({ sq, sa })
        this.pertanyaanAktif = SQ_LABELS[sq] || sq
        this.keamanan.sq     = ''
        this.keamanan.sa     = ''
        window.showToast('✓ Pertanyaan keamanan disimpan!', 'success')
      } catch (err) {
        this.keamanan.error = err.message
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
