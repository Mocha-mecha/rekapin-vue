<template>
  <!-- ══ HALAMAN MANAJEMEN PRODUK ══ -->
  <section class="page active">
    <div class="page-header">
      <div class="page-title">Manajemen Produk</div>
      <div class="page-sub">Kelola daftar produk yang dijual</div>
    </div>

    <div class="page-body">

      <!-- Toolbar: Pencarian + Tombol Tambah -->
      <div class="prod-toolbar">
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input v-model="kataCari" type="text" class="search-input" placeholder="Cari produk..." />
        </div>
        <button class="btn-primary" @click="bukaModal(null)">＋ Tambah Produk</button>
      </div>

      <!-- Tabel Produk -->
      <div v-if="produkTerfilter.length === 0" class="empty-state">
        <div class="empty-icon">◧</div>
        <div>{{ kataCari ? 'Produk tidak ditemukan.' : 'Belum ada produk. Klik "+ Tambah Produk" untuk mulai.' }}</div>
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Nama Produk</th><th>Kategori</th>
            <th>Harga Modal</th><th>Harga Jual</th>
            <th>Margin</th><th>Stok</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produkTerfilter" :key="p.id">
            <td>
              <strong>{{ p.nama }}</strong>
              <span v-if="p.sat" class="tag gray" style="margin-left:4px">{{ p.sat }}</span>
            </td>
            <td><span class="tag blue">{{ p.kat || '—' }}</span></td>
            <td class="mono">{{ fmtRp(p.modal) }}</td>
            <td class="mono">
              {{ fmtRp(p.jual) }}
              <span v-if="p.diskon" class="tag gold">-{{ p.diskon }}%</span>
            </td>
            <td class="mono" style="color:var(--accent)">{{ hitungMargin(p) }}%</td>
            <td>
              <span v-if="!p.hasStock" class="tag gray">—</span>
              <span v-else-if="p.stock <= 0" class="tag red">Habis</span>
              <span v-else :class="['tag', p.stock < 5 ? 'gold' : 'green']">{{ p.stock }} {{ p.sat || 'pcs' }}</span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-sm" @click="bukaModal(p.id)">Edit</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- ══ MODAL TAMBAH / EDIT PRODUK ══ -->
    <div class="modal-overlay" :class="{ open: modalTerbuka }">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">{{ editId ? 'Edit Produk' : 'Tambah Produk' }}</div>
          <button class="modal-close" @click="tutupModal">×</button>
        </div>
        <div class="modal-body">
          <!-- Nama Produk -->
          <div class="form-field">
            <label class="form-label">Nama Produk *</label>
            <input v-model="form.nama" type="text" class="form-input" placeholder="Contoh: Es Teh Manis" />
          </div>
          <!-- Kategori & Satuan -->
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Kategori</label>
              <input v-model="form.kat" type="text" class="form-input" placeholder="Minuman, Makanan..." />
            </div>
            <div class="form-field">
              <label class="form-label">Satuan</label>
              <input v-model="form.sat" type="text" class="form-input" placeholder="pcs, porsi, botol" />
            </div>
          </div>
          <!-- Modal & Margin -->
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Harga Modal (Rp) *</label>
              <input v-model.number="form.modal" type="number" class="form-input mono" placeholder="0" @input="hitungHargaJual" />
            </div>
            <div class="form-field">
              <label class="form-label">Margin (%)</label>
              <input v-model.number="form.margin" type="number" class="form-input mono" placeholder="30" @input="hitungHargaJual" />
              <span class="form-hint">Isi margin → harga jual otomatis</span>
            </div>
          </div>
          <!-- Harga Jual & Diskon -->
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Harga Jual (Rp) *</label>
              <input v-model.number="form.jual" type="number" class="form-input mono" placeholder="0" @input="hitungMarginOtomatis" />
            </div>
            <div class="form-field">
              <label class="form-label">Diskon (%)</label>
              <input v-model.number="form.diskon" type="number" class="form-input mono" placeholder="0" min="0" max="100" />
            </div>
          </div>
          <!-- Checkbox Stok -->
          <div class="form-field">
            <label class="form-checkbox-row">
              <input v-model="form.hasStock" type="checkbox" />
              Gunakan stok (opsional)
            </label>
          </div>
          <!-- Field Jumlah Stok (tampil jika checkbox dicentang) -->
          <div class="form-field stock-field" :class="{ visible: form.hasStock }">
            <label class="form-label">Jumlah Stok</label>
            <input v-model.number="form.stock" type="number" class="form-input mono" placeholder="0" min="0" />
          </div>
        </div>
        <!-- Footer Modal -->
        <div class="modal-footer">
          <button class="btn-secondary" @click="tutupModal">Batal</button>
          <button v-if="editId" class="btn-danger" @click="hapusProduk">Hapus</button>
          <button class="btn-primary" @click="simpanProduk">Simpan</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService.js'
import { validateProduct } from '../utils/validation.js'
import { fmtRp } from '../utils/helpers.js'

export default {
  name: 'ProdukView',

  data() {
    return {
      semuaProduk:  [],        // Semua produk
      kataCari:     '',        // Teks pencarian
      modalTerbuka: false,     // true = modal tampil
      editId:       null,
      loading:      false,
      saving:       false,

      // Data form di dalam modal
      form: {
        nama: '', kat: '', sat: '',
        modal: 0, jual: 0, margin: 0, diskon: 0,
        hasStock: false, stock: 0,
      }
    }
  },

  computed: {
    // Filter produk berdasarkan kata pencarian
    produkTerfilter() {
      const q = this.kataCari.toLowerCase()
      if (!q) return this.semuaProduk
      return this.semuaProduk.filter(p =>
        p.nama.toLowerCase().includes(q) ||
        (p.kat || '').toLowerCase().includes(q)
      )
    }
  },

  mounted() {
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

    hitungMargin(p) {
      const hEff = p.diskon ? Math.round(p.jual * (1 - p.diskon / 100)) : p.jual
      return hEff ? Math.round((hEff - p.modal) / hEff * 100) : 0
    },

    // Hitung harga jual otomatis dari modal + margin
    hitungHargaJual() {
      if (this.form.modal && this.form.margin < 100) {
        this.form.jual = Math.round(this.form.modal / (1 - this.form.margin / 100))
      }
    },

    // Hitung margin otomatis dari harga jual
    hitungMarginOtomatis() {
      if (this.form.modal && this.form.jual > this.form.modal) {
        this.form.margin = Math.round((this.form.jual - this.form.modal) / this.form.jual * 100)
      }
    },

    // Buka modal untuk tambah (id=null) atau edit (id=ada)
    bukaModal(id) {
      this.editId = id

      if (id) {
        // Mode edit: isi form dari data produk
        const p = this.semuaProduk.find(x => x.id === id)
        if (!p) return
        this.form = { ...p } // Salin semua properti produk ke form
      } else {
        // Mode tambah: kosongkan form
        this.form = { nama: '', kat: '', sat: '', modal: 0, jual: 0, margin: 0, diskon: 0, hasStock: false, stock: 0 }
      }

      this.modalTerbuka = true
    },

    tutupModal() {
      this.modalTerbuka = false
      this.editId       = null
    },

    // Simpan produk (tambah atau edit)
    async simpanProduk() {
      const errors = validateProduct(this.form)
      if (errors.length) { window.showToast(errors[0], 'error'); return }

      const data = {
        nama:     this.form.nama,
        kat:      this.form.kat,
        sat:      this.form.sat,
        modal:    this.form.modal,
        jual:     this.form.jual,
        margin:   this.form.margin || 0,
        diskon:   this.form.diskon || 0,
        hasStock: this.form.hasStock,
        stock:    this.form.hasStock ? (this.form.stock || 0) : 0,
      }

      this.saving = true
      try {
        if (this.editId) {
          await updateProduct(this.editId, data)
          window.showToast('Produk berhasil diperbarui!', 'success')
        } else {
          await createProduct(data)
          window.showToast('Produk berhasil ditambahkan!', 'success')
        }
        await this.muatProduk()
        this.tutupModal()
      } catch (err) {
        window.showToast('Gagal menyimpan: ' + err.message, 'error')
      } finally {
        this.saving = false
      }
    },

    // Hapus produk
    async hapusProduk() {
      if (!this.editId) return
      if (!confirm('Yakin ingin menghapus produk ini?')) return

      this.saving = true
      try {
        await deleteProduct(this.editId)
        await this.muatProduk()
        this.tutupModal()
        window.showToast('Produk berhasil dihapus.', 'success')
      } catch (err) {
        window.showToast('Gagal menghapus: ' + err.message, 'error')
      } finally {
        this.saving = false
      }
    },
  }
}
</script>
