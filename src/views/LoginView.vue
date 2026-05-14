<template>
  <!--
    LoginView.vue = Halaman Login & Register
    Ada 2 panel:
    1. Panel Utama (Login / Register)
    2. Panel Lupa Password (3 langkah)
  -->
  <div id="auth-screen" style="display: flex;">

    <!-- ══ PANEL UTAMA: Login / Register ══ -->
    <div class="auth-wrap" v-if="panel === 'main'">

      <!-- Header logo -->
      <div class="auth-header">
        <div class="auth-logo">Rekap<span>in</span></div>
        <div class="auth-tagline">Rekap Penjualan Harian</div>
      </div>

      <!-- Tab pilihan: Masuk / Daftar -->
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: tab === 'login' }"    @click="tab = 'login'">Masuk</button>
        <button class="auth-tab" :class="{ active: tab === 'register' }" @click="tab = 'register'">Daftar</button>
      </div>

      <div class="auth-body">

        <!-- ── FORM LOGIN ── -->
        <form v-if="tab === 'login'" class="auth-form" @submit.prevent="doLogin">
          <div class="auth-field">
            <label class="auth-label">Username</label>
            <input v-model="login.username" type="text" class="auth-input" placeholder="Masukkan username" />
          </div>
          <div class="auth-field">
            <label class="auth-label">Password</label>
            <div class="input-pw-wrap">
              <input v-model="login.password" :type="login.showPw ? 'text' : 'password'" class="auth-input" placeholder="Masukkan password" />
              <button type="button" class="btn-toggle-pw" @click="login.showPw = !login.showPw">
                <!-- Ikon mata -->
                <svg v-if="!login.showPw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.94"/>
                  <path d="M1 1l22 22"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="auth-forgot">
            <button type="button" class="link-btn" @click="panel = 'forgot'">Lupa password?</button>
          </div>
          <div v-if="login.error" class="auth-error show">{{ login.error }}</div>
          <button type="submit" class="btn-auth">Masuk</button>
          <div class="auth-hint">Data disimpan di perangkat ini saja.</div>
        </form>

        <!-- ── FORM REGISTER ── -->
        <form v-if="tab === 'register'" class="auth-form" @submit.prevent="doRegister">
          <div class="auth-field">
            <label class="auth-label">Nama Toko / Usaha</label>
            <input v-model="reg.nama" type="text" class="auth-input" placeholder="Contoh: Kantin Bu Ani" />
          </div>
          <div class="auth-field">
            <label class="auth-label">Username</label>
            <input v-model="reg.username" type="text" class="auth-input" placeholder="Buat username unik" />
          </div>
          <div class="auth-field">
            <label class="auth-label">Password</label>
            <div class="input-pw-wrap">
              <input v-model="reg.password" :type="reg.showPw ? 'text' : 'password'" class="auth-input" placeholder="Minimal 4 karakter" />
              <button type="button" class="btn-toggle-pw" @click="reg.showPw = !reg.showPw">Lihat</button>
            </div>
          </div>
          <div class="auth-field">
            <label class="auth-label">Konfirmasi Password</label>
            <div class="input-pw-wrap">
              <input v-model="reg.password2" :type="reg.showPw2 ? 'text' : 'password'" class="auth-input" placeholder="Ulangi password" />
              <button type="button" class="btn-toggle-pw" @click="reg.showPw2 = !reg.showPw2">Lihat</button>
            </div>
          </div>
          <div class="auth-field">
            <label class="auth-label">Pertanyaan Keamanan <span class="label-hint">(untuk lupa password)</span></label>
            <select v-model="reg.sq" class="auth-input">
              <option value="">— Pilih pertanyaan —</option>
              <option v-for="(label, key) in SQ_LABELS" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div class="auth-field">
            <label class="auth-label">Jawaban Keamanan</label>
            <input v-model="reg.sa" type="text" class="auth-input" placeholder="Jawaban (tidak case-sensitive)" />
          </div>
          <div v-if="reg.error" class="auth-error show">{{ reg.error }}</div>
          <button type="submit" class="btn-auth">Daftar &amp; Mulai</button>
          <div class="auth-hint">Pertanyaan keamanan dipakai jika lupa password.</div>
        </form>

      </div>
    </div><!-- /panel main -->


    <!-- ══ PANEL LUPA PASSWORD (3 langkah) ══ -->
    <div class="auth-wrap" v-if="panel === 'forgot'">
      <div class="auth-header">
        <div class="auth-logo">Rekap<span>in</span></div>
        <div class="auth-tagline">Pemulihan Password</div>
      </div>
      <div class="auth-body">

        <!-- Langkah 1: Masukkan username -->
        <div v-if="fp.step === 1">
          <div class="fp-step-label">Langkah 1 dari 3 — Verifikasi Akun</div>
          <div class="auth-form" style="gap:14px;display:flex;flex-direction:column">
            <div class="auth-field">
              <label class="auth-label">Username</label>
              <input v-model="fp.username" type="text" class="auth-input" placeholder="Masukkan username Anda" />
            </div>
            <div v-if="fp.error" class="auth-error show">{{ fp.error }}</div>
            <button type="button" class="btn-auth" @click="fpStep1">Lanjut →</button>
            <button type="button" class="link-btn" style="text-align:center" @click="panel = 'main'">← Kembali ke Login</button>
          </div>
        </div>

        <!-- Langkah 2: Jawab pertanyaan keamanan -->
        <div v-if="fp.step === 2">
          <div class="fp-step-label">Langkah 2 dari 3 — Pertanyaan Keamanan</div>
          <div class="auth-form" style="gap:14px;display:flex;flex-direction:column">
            <div class="sq-box">
              <div class="sq-label">Pertanyaan</div>
              <div class="sq-question">{{ fp.question }}</div>
            </div>
            <div class="auth-field">
              <label class="auth-label">Jawaban Anda</label>
              <input v-model="fp.answer" type="text" class="auth-input" placeholder="Ketik jawaban Anda..." />
            </div>
            <div v-if="fp.error" class="auth-error show">{{ fp.error }}</div>
            <button type="button" class="btn-auth" @click="fpStep2">Verifikasi →</button>
            <button type="button" class="link-btn" style="text-align:center" @click="fp.step = 1">← Kembali</button>
          </div>
        </div>

        <!-- Langkah 3: Atur password baru -->
        <div v-if="fp.step === 3">
          <div class="fp-step-label">Langkah 3 dari 3 — Password Baru</div>
          <div class="auth-form" style="gap:14px;display:flex;flex-direction:column">
            <div class="auth-field">
              <label class="auth-label">Password Baru</label>
              <div class="input-pw-wrap">
                <input v-model="fp.newpass" :type="fp.showPw ? 'text' : 'password'" class="auth-input" placeholder="Minimal 4 karakter" />
                <button type="button" class="btn-toggle-pw" @click="fp.showPw = !fp.showPw">Lihat</button>
              </div>
            </div>
            <div class="auth-field">
              <label class="auth-label">Konfirmasi Password Baru</label>
              <div class="input-pw-wrap">
                <input v-model="fp.newpass2" :type="fp.showPw2 ? 'text' : 'password'" class="auth-input" placeholder="Ulangi password baru" />
                <button type="button" class="btn-toggle-pw" @click="fp.showPw2 = !fp.showPw2">Lihat</button>
              </div>
            </div>
            <div v-if="fp.error" class="auth-error show">{{ fp.error }}</div>
            <button type="button" class="btn-auth" @click="fpStep3">✓ Simpan Password Baru</button>
          </div>
        </div>

      </div>
    </div><!-- /panel forgot -->

  </div>
</template>

<script>
import * as authSvc from '../services/authService.js'
import { validateLogin, validateRegister } from '../utils/validation.js'
import { SQ_LABELS } from '../utils/helpers.js'

export default {
  name: 'LoginView',

  data() {
    return {
      SQ_LABELS, // Ekspor ke template agar bisa dipakai di v-for

      // Tampilkan panel mana: 'main' atau 'forgot'
      panel: 'main',

      // Tab aktif di panel utama: 'login' atau 'register'
      tab:     'login',
      loading: false,

      // Data form login
      login: { username: '', password: '', showPw: false, error: '' },

      // Data form register
      reg: { nama: '', username: '', password: '', password2: '', sq: '', sa: '', showPw: false, showPw2: false, error: '' },

      // Data proses lupa password
      fp: { step: 1, username: '', question: '', answer: '', newpass: '', newpass2: '', showPw: false, showPw2: false, error: '' },
    }
  },

  methods: {

    // ── Login ──
    async doLogin() {
      this.login.error = ''
      const errors = validateLogin(this.login)
      if (errors.length) { this.login.error = errors[0]; return }

      this.loading = true
      try {
        await authSvc.login(this.login.username, this.login.password)
        this.$router.push('/dashboard')
      } catch (err) {
        this.login.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ── Register ──
    async doRegister() {
      this.reg.error = ''
      const errors = validateRegister(this.reg)
      if (errors.length) { this.reg.error = errors[0]; return }

      this.loading = true
      try {
        await authSvc.register(this.reg)
        this.$router.push('/dashboard')
      } catch (err) {
        this.reg.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ── Lupa Password: Langkah 1 ──
    async fpStep1() {
      this.fp.error = ''
      if (!this.fp.username) { this.fp.error = 'Username wajib diisi.'; return }

      this.loading = true
      try {
        const { sq } = await authSvc.getSecurityQuestion(this.fp.username)
        this.fp.question = SQ_LABELS[sq] || sq
        this.fp.step = 2
      } catch (err) {
        this.fp.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ── Lupa Password: Langkah 2 ──
    async fpStep2() {
      this.fp.error = ''
      if (!this.fp.answer) { this.fp.error = 'Jawaban wajib diisi.'; return }

      this.loading = true
      try {
        await authSvc.verifySecurityAnswer(this.fp.username, this.fp.answer)
        this.fp.step = 3
      } catch (err) {
        this.fp.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ── Lupa Password: Langkah 3 ──
    async fpStep3() {
      this.fp.error = ''
      if (this.fp.newpass.length < 4)          { this.fp.error = 'Password minimal 4 karakter.'; return }
      if (this.fp.newpass !== this.fp.newpass2) { this.fp.error = 'Konfirmasi password tidak cocok.'; return }

      this.loading = true
      try {
        await authSvc.resetPassword(this.fp.username, this.fp.newpass)
        this.panel = 'main'
        this.tab   = 'login'
        this.fp    = { step: 1, username: '', question: '', answer: '', newpass: '', newpass2: '', showPw: false, showPw2: false, error: '' }
        window.showToast('✓ Password berhasil diperbarui! Silakan login.', 'success')
      } catch (err) {
        this.fp.error = err.message
      } finally {
        this.loading = false
      }
    },
  }
}
</script>
