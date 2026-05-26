<template>
  <div class="landing">

    <!-- ══ NAVBAR ══ -->
    <header class="landing-nav">
      <div class="nav-brand">Rekap<span>in</span></div>
      <div class="nav-actions">
        <button class="nav-btn-outline" @click="$router.push('/login')">Masuk</button>
        <button class="nav-btn-solid"   @click="$router.push('/login')">Mulai Gratis</button>
      </div>
    </header>

    <!-- ══ HERO ══ -->
    <section class="hero">
      <div class="hero-badge">Aplikasi Rekap Penjualan Harian</div>
      <h1 class="hero-title">Catat Penjualan<br><span>Lebih Cepat & Rapi</span></h1>
      <p class="hero-desc">
        Rekapin membantu pelaku UMKM merekap transaksi harian, memantau stok produk,
        dan melihat laporan omzet — langsung dari browser tanpa perlu install apapun.
      </p>
      <div class="hero-cta">
        <button class="btn-hero-primary" @click="$router.push('/login')">Mulai Sekarang →</button>
        <button class="btn-hero-ghost"   @click="scrollToFitur">Lihat Fitur</button>
      </div>
      <div class="hero-note">Gratis · Tanpa registrasi kartu kredit · Data tersimpan di perangkat Anda</div>
    </section>

    <!-- ══ STATS ══ -->
    <section class="stats-bar">
      <div class="stat-item">
        <div class="stat-num">100%</div>
        <div class="stat-lbl">Gratis</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-num">0 detik</div>
        <div class="stat-lbl">Waktu Install</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-num">5 Halaman</div>
        <div class="stat-lbl">Fitur Lengkap</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-num">Offline</div>
        <div class="stat-lbl">Tanpa Internet</div>
      </div>
    </section>

    <!-- ══ FITUR ══ -->
    <section class="fitur-section" id="fitur" ref="fiturSection">
      <div class="section-label">Fitur Unggulan</div>
      <h2 class="section-title">Semua yang Anda Butuhkan</h2>
      <p class="section-desc">Dari catat transaksi hingga laporan bulanan — semuanya dalam satu aplikasi.</p>

      <div class="fitur-grid">
        <div class="fitur-card">
          <div class="fitur-icon fitur-green">◈</div>
          <h3 class="fitur-title">Dashboard Real-time</h3>
          <p class="fitur-desc">Lihat ringkasan omzet, keuntungan, dan transaksi hari ini dalam satu tampilan.</p>
        </div>
        <div class="fitur-card">
          <div class="fitur-icon fitur-blue">⊞</div>
          <h3 class="fitur-title">Kasir Digital (POS)</h3>
          <p class="fitur-desc">Tambah item ke keranjang dengan sekali klik. Proses transaksi cepat dan akurat.</p>
        </div>
        <div class="fitur-card">
          <div class="fitur-icon fitur-gold">◧</div>
          <h3 class="fitur-title">Manajemen Produk</h3>
          <p class="fitur-desc">Kelola produk, harga, modal, dan stok. Notifikasi otomatis saat stok menipis.</p>
        </div>
        <div class="fitur-card">
          <div class="fitur-icon fitur-purple">≡</div>
          <h3 class="fitur-title">Laporan & Rekap</h3>
          <p class="fitur-desc">Filter laporan per hari, minggu, atau bulan. Lihat produk terlaris dan tren penjualan.</p>
        </div>
        <div class="fitur-card">
          <div class="fitur-icon fitur-red">⚙</div>
          <h3 class="fitur-title">Multi Akun</h3>
          <p class="fitur-desc">Daftarkan beberapa akun toko dalam satu perangkat. Data tiap toko terpisah.</p>
        </div>
        <div class="fitur-card">
          <div class="fitur-icon fitur-green">◉</div>
          <h3 class="fitur-title">Data Aman & Privat</h3>
          <p class="fitur-desc">Semua data tersimpan di perangkat Anda sendiri. Tidak ada server, tidak ada kebocoran.</p>
        </div>
      </div>
    </section>

    <!-- ══ HOW IT WORKS ══ -->
    <section class="how-section">
      <div class="section-label">Cara Kerja</div>
      <h2 class="section-title">Mulai dalam 3 Langkah</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <h3 class="step-title">Daftar Akun</h3>
          <p class="step-desc">Buat akun dengan nama toko dan username. Tidak perlu email atau verifikasi.</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-num">2</div>
          <h3 class="step-title">Tambah Produk</h3>
          <p class="step-desc">Masukkan daftar produk beserta harga jual, modal, dan kategori.</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-num">3</div>
          <h3 class="step-title">Mulai Berjualan</h3>
          <p class="step-desc">Gunakan halaman Transaksi untuk mencatat penjualan dan lihat laporan setiap saat.</p>
        </div>
      </div>
    </section>

    <!-- ══ CTA BAWAH ══ -->
    <section class="cta-section">
      <h2 class="cta-title">Siap Rapikan Catatan Penjualan Anda?</h2>
      <p class="cta-desc">Gratis selamanya. Tidak perlu kartu kredit. Mulai sekarang.</p>
      <button class="btn-hero-primary" @click="$router.push('/login')">Buat Akun Gratis →</button>
    </section>

    <!-- ══ FOOTER ══ -->
    <footer class="landing-footer">
      <div class="footer-brand">Rekap<span>in</span></div>
      <div class="footer-tagline">Aplikasi Rekap Penjualan untuk UMKM Indonesia</div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'LandingView',
  methods: {
    scrollToFitur() {
      this.$refs.fiturSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--sans);
  overflow-y: auto;
  width: 100%;
}

/* ── Navbar ── */
.landing-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}
.nav-brand {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
}
.nav-brand span { color: var(--accent); }
.nav-actions { display: flex; gap: 10px; }
.nav-btn-outline {
  padding: 8px 20px;
  border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
  background: none;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.15s;
}
.nav-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.nav-btn-solid {
  padding: 8px 20px;
  border-radius: var(--r-sm);
  border: none;
  background: var(--accent);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.nav-btn-solid:hover { background: var(--accent2); }

/* ── Hero ── */
.hero {
  text-align: center;
  padding: 80px 60px 60px;
  max-width: 760px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  background: var(--accent3);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 24px;
}
.hero-title {
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 20px;
}
.hero-title span { color: var(--accent); }
.hero-desc {
  font-size: 16px;
  color: var(--text2);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 32px;
}
.hero-cta { display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; }
.btn-hero-primary {
  padding: 14px 28px;
  border-radius: var(--r-sm);
  border: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-hero-primary:hover { background: var(--accent2); }
.btn-hero-ghost {
  padding: 14px 28px;
  border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
  background: none;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-hero-ghost:hover { border-color: var(--accent); color: var(--accent); }
.hero-note {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--mono);
}

/* ── Stats Bar ── */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 32px 60px;
  background: var(--sidebar);
  margin: 0;
}
.stat-item { text-align: center; padding: 0 48px; }
.stat-num {
  font-size: 24px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent3);
  letter-spacing: -1px;
}
.stat-lbl {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.1);
}

/* ── Section Common ── */
.section-label {
  font-size: 11px;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent);
  margin-bottom: 12px;
}
.section-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--text);
  margin-bottom: 12px;
}
.section-desc {
  font-size: 14px;
  color: var(--text2);
  line-height: 1.7;
  max-width: 480px;
}

/* ── Fitur ── */
.fitur-section {
  padding: 80px 60px;
  max-width: 1100px;
  margin: 0 auto;
}
.fitur-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 48px;
}
.fitur-card {
  background: var(--surface);
  border-radius: var(--r);
  border: 1px solid var(--border);
  padding: 28px 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.fitur-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}
.fitur-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.fitur-green  { background: #D4EDDA; color: var(--accent); }
.fitur-blue   { background: #D6EAF8; color: #1A6FA8; }
.fitur-gold   { background: #FEF9E7; color: #B7950B; }
.fitur-purple { background: #EAD6F8; color: #7D3C98; }
.fitur-red    { background: #FDECEA; color: var(--danger); }
.fitur-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}
.fitur-desc {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.6;
}

/* ── How It Works ── */
.how-section {
  padding: 80px 60px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  text-align: center;
}
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 48px;
}
.step {
  background: var(--bg);
  border-radius: var(--r);
  border: 1px solid var(--border);
  padding: 32px 28px;
  width: 240px;
}
.step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--mono);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.step-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}
.step-desc {
  font-size: 12px;
  color: var(--text2);
  line-height: 1.6;
  font-family: var(--mono);
}
.step-arrow {
  font-size: 24px;
  color: var(--accent3);
  margin: 0 16px;
  font-weight: 300;
}

/* ── CTA Section ── */
.cta-section {
  text-align: center;
  padding: 80px 60px;
  background: var(--sidebar);
}
.cta-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #fff;
  margin-bottom: 12px;
}
.cta-desc {
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  font-family: var(--mono);
  margin-bottom: 28px;
}

/* ── Footer ── */
.landing-footer {
  padding: 28px 60px;
  background: var(--sidebar);
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
}
.footer-brand {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}
.footer-brand span { color: var(--accent3); }
.footer-tagline {
  font-size: 11px;
  color: rgba(255,255,255,0.25);
  font-family: var(--mono);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .landing-nav { padding: 14px 16px; gap: 12px; }
  .nav-actions { gap: 8px; }
  .nav-btn-outline,
  .nav-btn-solid { padding: 8px 12px; font-size: 12px; }
  .hero { padding: 48px 20px 40px; }
  .hero-title { font-size: 34px; letter-spacing: -1px; }
  .hero-desc { font-size: 14px; }
  .hero-cta { flex-direction: column; }
  .btn-hero-primary,
  .btn-hero-ghost { width: 100%; }
  .stats-bar { flex-wrap: wrap; padding: 24px 20px; gap: 16px; }
  .stat-item { width: calc(50% - 8px); padding: 0; }
  .stat-divider { display: none; }
  .fitur-section, .how-section, .cta-section { padding: 48px 20px; }
  .section-title,
  .cta-title { font-size: 28px; letter-spacing: -0.5px; }
  .fitur-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; }
  .steps { flex-direction: column; gap: 12px; }
  .step { width: 100%; }
  .step-arrow { transform: rotate(90deg); margin: 0; }
  .landing-footer { padding: 24px 20px; }
}

@media (max-width: 420px) {
  .landing-nav { align-items: flex-start; flex-direction: column; }
  .nav-actions { width: 100%; }
  .nav-btn-outline,
  .nav-btn-solid { flex: 1; }
  .hero-title { font-size: 30px; }
}
</style>
