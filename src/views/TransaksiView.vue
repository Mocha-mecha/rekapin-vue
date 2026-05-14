<template>
  <!-- ══ HALAMAN TRANSAKSI (POS Style) ══ -->
  <section class="page active">
    <div class="page-header">
      <div class="page-title">Transaksi Penjualan</div>
      <div class="page-sub">Ketuk produk untuk menambahkan ke daftar</div>
    </div>

    <div class="page-body" style="padding-top:16px">
      <div class="trx-layout">

        <!-- ── Panel Kiri: Daftar Produk ── -->
        <div class="product-panel">

          <!-- Tab Kategori -->
          <div class="panel-toolbar">
            <div class="cat-tabs">
              <button
                v-for="kat in kategoriList"
                :key="kat"
                class="cat-tab"
                :class="{ active: katAktif === kat }"
                @click="katAktif = kat"
              >
                {{ kat === 'semua' ? 'Semua' : kat }}
              </button>
            </div>
          </div>

          <!-- Grid Produk -->
          <div class="product-grid">
            <!-- Pesan jika belum ada produk sama sekali -->
            <div v-if="semuaProduk.length === 0" class="empty-state" style="grid-column:1/-1">
              <div class="empty-icon">◧</div>
              <div>Belum ada produk. Tambahkan di halaman Produk.</div>
            </div>

            <!-- Pesan jika tidak ada produk di kategori ini -->
            <div v-else-if="produkTerfilter.length === 0" class="empty-state" style="grid-column:1/-1">
              <div class="empty-icon">⊘</div>
              <div>Tidak ada produk di kategori ini.</div>
            </div>

            <!-- Kotak-kotak produk -->
            <div
              v-for="p in produkTerfilter"
              :key="p.id"
              :class="['prod-box', { 'prod-box-out': habis(p), 'prod-box-low': menipis(p) }]"
              @click="!habis(p) && tambahKeKeranjang(p.id)"
            >
              <!-- Badge stok -->
              <span v-if="p.hasStock" :class="['pstock', { out: habis(p), low: menipis(p) }]">
                {{ habis(p) ? 'Habis' : stokSisa(p) }}
              </span>
              <div class="pcat">{{ p.kat || 'Umum' }}</div>
              <div class="pname">{{ p.nama }}</div>
              <div class="pprice">
                {{ fmtRp(hargaEfektif(p)) }}
                <span v-if="p.diskon" class="tag gold" style="font-size:8px">-{{ p.diskon }}%</span>
              </div>
              <div class="pmargin">Margin {{ marginEfektif(p) }}%</div>
              <div v-if="p.sat" class="pmargin">/ {{ p.sat }}</div>
            </div>
          </div>
        </div>

        <!-- ── Panel Kanan: Keranjang ── -->
        <div class="cart-panel">
          <div class="cart-header">
            <div class="cart-title">Keranjang</div>
            <div class="cart-date">{{ tanggal }}</div>
          </div>

          <!-- Daftar Item Keranjang -->
          <div class="cart-items">
            <!-- Keranjang kosong -->
            <div v-if="keranjang.length === 0" class="cart-empty">
              <div class="cart-empty-icon">⊡</div>
              <div class="cart-empty-text">Pilih produk...</div>
            </div>

            <!-- Item dalam keranjang -->
            <div v-for="(item, i) in keranjang" :key="item.id" class="cart-item">
              <button class="cart-item-del" @click="hapusDariKeranjang(i)">×</button>
              <div class="cart-item-name">{{ item.nama }}</div>
              <div class="cart-item-detail">{{ fmtRp(item.jual) }} / {{ item.sat || 'pcs' }}</div>
              <div class="cart-item-row">
                <!-- Kontrol jumlah (qty) -->
                <div class="qty-ctrl">
                  <button class="qty-btn" @click="ubahQty(i, -1)">−</button>
                  <input class="qty-val" type="number" :value="item.qty" min="1"
                    @change="setQty(i, $event.target.value)"
                    @click="$event.target.select()"
                  />
                  <button class="qty-btn" @click="ubahQty(i, 1)">+</button>
                </div>
                <div class="cart-item-price">{{ fmtRp(item.jual * item.qty) }}</div>
              </div>
            </div>
          </div>

          <!-- Footer Keranjang: Total & Tombol -->
          <div class="cart-footer">
            <!-- Estimasi keuntungan (tampil jika keranjang tidak kosong) -->
            <div v-if="keranjang.length > 0" class="cart-profit-row">
              <span>Estimasi Keuntungan</span>
              <span>{{ fmtRp(totalProfit) }}</span>
            </div>
            <div class="cart-total-row">
              <div class="cart-total-label">Total</div>
              <div class="cart-total-val">{{ fmtRp(totalHarga) }}</div>
            </div>
            <button class="btn-checkout" :disabled="keranjang.length === 0 || loadingCheckout" @click="checkout">
              ✓ Simpan Transaksi
            </button>
            <button class="btn-clear" @click="keranjang = []">Bersihkan</button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import { fetchProducts, deductStock } from '../services/productService.js'
import { createTransaction } from '../services/transactionService.js'
import { fmtRp, formatDateLong } from '../utils/helpers.js'

export default {
  name: 'TransaksiView',

  data() {
    return {
      semuaProduk: [],  // Semua produk dari database
      keranjang:   [],  // Item yang dipilih user
      katAktif:        'semua',
      tanggal:         formatDateLong(),
      loading:         false,
      loadingCheckout: false,
    }
  },

  computed: {
    // Daftar kategori unik dari semua produk (untuk tab filter)
    kategoriList() {
      const kats = [...new Set(this.semuaProduk.map(p => p.kat || 'Lainnya'))]
      return ['semua', ...kats]
    },

    // Produk yang ditampilkan sesuai tab kategori aktif
    produkTerfilter() {
      if (this.katAktif === 'semua') return this.semuaProduk
      return this.semuaProduk.filter(p => (p.kat || 'Lainnya') === this.katAktif)
    },

    // Total harga semua item di keranjang
    totalHarga() {
      return this.keranjang.reduce((s, item) => s + item.jual * item.qty, 0)
    },

    // Total estimasi keuntungan
    totalProfit() {
      return this.keranjang.reduce((s, item) => s + (item.jual - item.modal) * item.qty, 0)
    },
  },

  mounted() {
    this.muatProduk()
  },

  // Saat user meninggalkan halaman ini lalu kembali, muat ulang produk
  activated() {
    this.muatProduk()
  },

  methods: {
    fmtRp,

    async muatProduk() {
      this.loading = true
      try {
        this.semuaProduk = await fetchProducts()
      } catch (err) {
        window.showToast('Gagal memuat produk: ' + err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    // ── Helper tampilan produk ──
    hargaEfektif(p) {
      return p.diskon ? Math.round(p.jual * (1 - p.diskon / 100)) : p.jual
    },
    marginEfektif(p) {
      const h = this.hargaEfektif(p)
      return h ? Math.round((h - p.modal) / h * 100) : 0
    },
    stokSisa(p) {
      const diKeranjang = this.keranjang.find(c => c.id === p.id)?.qty || 0
      return Math.max(0, p.stock - diKeranjang)
    },
    habis(p)   { return p.hasStock && this.stokSisa(p) <= 0 },
    menipis(p) { return p.hasStock && this.stokSisa(p) > 0 && this.stokSisa(p) < 5 },

    // ── Tambah produk ke keranjang ──
    tambahKeKeranjang(productId) {
      const p = this.semuaProduk.find(x => x.id === productId)
      if (!p) return

      const existing = this.keranjang.find(c => c.id === productId)

      if (existing) {
        // Produk sudah ada → tambah qty
        if (p.hasStock && existing.qty >= p.stock) {
          window.showToast('Stok tidak mencukupi!', 'error')
          return
        }
        existing.qty++
      } else {
        // Produk baru → tambahkan ke keranjang
        this.keranjang.push({
          id:    p.id,
          nama:  p.nama,
          jual:  this.hargaEfektif(p),
          modal: p.modal,
          qty:   1,
          sat:   p.sat || '',
        })
      }

      // Notifikasi stok menipis
      if (p.hasStock) {
        const sisa = this.stokSisa(p)
        if (sisa > 0 && sisa < 5) {
          window.showToast(`Stok ${p.nama} tersisa ${sisa}!`, 'warning')
        }
      }
    },

    // ── Set qty item di keranjang ──
    setQty(i, val) {
      val = parseInt(val)
      if (isNaN(val) || val < 1) val = 1
      const p = this.semuaProduk.find(x => x.id === this.keranjang[i].id)
      if (p && p.hasStock && val > p.stock) {
        val = p.stock
        window.showToast('Stok tidak mencukupi!', 'error')
      }
      this.keranjang[i].qty = val
    },

    ubahQty(i, delta) {
      this.setQty(i, this.keranjang[i].qty + delta)
    },

    hapusDariKeranjang(i) {
      this.keranjang.splice(i, 1)
    },

    // ── Simpan transaksi (atomic: transaksi + potong stok) ──
    async checkout() {
      if (!this.keranjang.length) return

      this.loadingCheckout = true
      try {
        // 1. Simpan transaksi ke database
        await createTransaction(this.keranjang, {
          total:  this.totalHarga,
          profit: this.totalProfit,
        })

        // 2. Kurangi stok — backend adalah source of truth saat API aktif
        const stockItems = this.keranjang.map(c => ({ id: c.id, qty: c.qty }))
        const produkTerbaru = await deductStock(stockItems)

        // 3. Update tampilan produk dengan data stok terbaru
        this.semuaProduk = produkTerbaru
        this.keranjang   = []
        window.showToast('✓ Transaksi berhasil disimpan!', 'success')
      } catch (err) {
        window.showToast('Gagal menyimpan transaksi: ' + err.message, 'error')
      } finally {
        this.loadingCheckout = false
      }
    }
  }
}
</script>
