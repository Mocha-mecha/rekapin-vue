<template>
  <!-- ══ HALAMAN LAPORAN / REKAPITULASI ══ -->
  <section class="page active">
    <div class="page-header">
      <div class="page-title">Rekapitulasi</div>
      <div class="page-sub">Ringkasan data penjualan</div>
    </div>

    <div class="page-body">

      <!-- Filter Periode & Tanggal -->
      <div class="filter-bar">
        <span class="filter-label">Periode</span>
        <div class="period-tabs">
          <button v-for="p in ['harian','mingguan','bulanan']" :key="p"
            class="period-tab" :class="{ active: periode === p }"
            @click="periode = p"
          >
            {{ p.charAt(0).toUpperCase() + p.slice(1) }}
          </button>
        </div>
        <span class="filter-label" style="margin-left:8px">Dari</span>
        <input v-model="filterDari"  type="date" class="date-input" />
        <span class="filter-label">s/d</span>
        <input v-model="filterSampai" type="date" class="date-input" />
        <button class="btn-sm" @click="resetFilter">Reset</button>
      </div>

      <!-- Kartu Ringkasan -->
      <div class="report-summary">
        <div class="rscard">
          <div class="rscard-label">Total Transaksi</div>
          <div class="rscard-val">{{ ringkasan.totalTrx }}</div>
        </div>
        <div class="rscard">
          <div class="rscard-label">Total Item</div>
          <div class="rscard-val">{{ ringkasan.totalItem }}</div>
        </div>
        <div class="rscard">
          <div class="rscard-label">Total Omzet</div>
          <div class="rscard-val">{{ fmtRp(ringkasan.totalOmzet) }}</div>
        </div>
        <div class="rscard">
          <div class="rscard-label">Total Untung</div>
          <div class="rscard-val">{{ fmtRp(ringkasan.totalProfit) }}</div>
        </div>
      </div>

      <!-- Isi Laporan -->
      <div v-if="loading" class="loading-state">Memuat laporan...</div>

      <div v-else-if="trxTerfilter.length === 0" class="empty-state">
        <div class="empty-icon">&#8801;</div>
        <div>Tidak ada data pada rentang yang dipilih.</div>
      </div>

      <div v-else>
        <div v-for="grup in grupTerurut" :key="grup.key" class="group-section">
          <div class="group-header">
            <div class="group-date">{{ grup.label }}</div>
            <div class="group-stats">
              {{ grup.trx.length }} transaksi &nbsp;|&nbsp;
              Omzet: <span>{{ fmtRp(grup.omzet) }}</span> &nbsp;|&nbsp;
              Untung: <span>{{ fmtRp(grup.profit) }}</span>
            </div>
          </div>
          <table class="data-table" style="border-radius:0 0 var(--r) var(--r)">
            <thead>
              <tr>
                <th>Waktu</th><th>Produk</th><th>Qty</th><th>Omzet</th><th>Keuntungan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in [...grup.trx].sort((a,b) => (b.time||'').localeCompare(a.time||''))" :key="t.id">
                <td class="mono">{{ t.time || '&mdash;' }}</td>
                <td style="font-size:12px;color:var(--text2)">
                  {{ t.items.map(i => i.productName + ' x' + i.qty).join(', ') }}
                </td>
                <td>{{ t.items.reduce((s,i) => s + i.qty, 0) }} item</td>
                <td class="mono">{{ fmtRp(t.total) }}</td>
                <td class="mono" style="color:var(--accent)">{{ fmtRp(t.profit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import { fetchTransactions } from '../services/transactionService.js'
import { fmtRp } from '../utils/helpers.js'

export default {
  name: 'LaporanView',

  data() {
    return {
      semuaTrx:     [],
      periode:      'harian',
      filterDari:   '',
      filterSampai: '',
      loading:      false,
    }
  },

  computed: {
    trxTerfilter() {
      let hasil = this.semuaTrx
      if (this.filterDari)   hasil = hasil.filter(t => t.date >= this.filterDari)
      if (this.filterSampai) hasil = hasil.filter(t => t.date <= this.filterSampai)
      return hasil
    },

    ringkasan() {
      const trx = this.trxTerfilter
      return {
        totalTrx:    trx.length,
        totalItem:   trx.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0),
        totalOmzet:  trx.reduce((s, t) => s + t.total,  0),
        totalProfit: trx.reduce((s, t) => s + t.profit, 0),
      }
    },

    grupTerurut() {
      const kelompok = {}
      this.trxTerfilter.forEach(t => {
        let kunci
        if (this.periode === 'harian') {
          kunci = t.date
        } else if (this.periode === 'mingguan') {
          const d = new Date(t.date)
          const awal = new Date(d)
          awal.setDate(d.getDate() - d.getDay())
          kunci = awal.toISOString().slice(0, 10)
        } else {
          kunci = t.date.slice(0, 7)
        }
        if (!kelompok[kunci]) kelompok[kunci] = []
        kelompok[kunci].push(t)
      })

      return Object.keys(kelompok)
        .sort((a, b) => b.localeCompare(a))
        .map(kunci => ({
          key:    kunci,
          label:  this.buatLabel(kunci),
          trx:    kelompok[kunci],
          omzet:  kelompok[kunci].reduce((s, t) => s + t.total,  0),
          profit: kelompok[kunci].reduce((s, t) => s + t.profit, 0),
        }))
    },
  },

  mounted() {
    this.muatData()
  },

  methods: {
    fmtRp,

    async muatData() {
      this.loading = true
      try {
        this.semuaTrx = await fetchTransactions()
      } catch (err) {
        window.showToast('Gagal memuat laporan: ' + err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    resetFilter() {
      this.filterDari   = ''
      this.filterSampai = ''
    },

    buatLabel(kunci) {
      if (this.periode === 'harian') {
        return new Date(kunci).toLocaleDateString('id-ID', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
      }
      if (this.periode === 'mingguan') {
        const awal  = new Date(kunci)
        const akhir = new Date(awal)
        akhir.setDate(akhir.getDate() + 6)
        const lbAwal  = awal.toLocaleDateString('id-ID',  { day: 'numeric', month: 'short' })
        const lbAkhir = akhir.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        return lbAwal + ' - ' + lbAkhir
      }
      return new Date(kunci + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    },
  },
}
</script>
