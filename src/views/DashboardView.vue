<template>
  <!-- ══ HALAMAN DASHBOARD ══ -->
  <section class="page active">
    <div class="page-header">
      <div class="page-title">Dashboard</div>
      <div class="page-sub">{{ tanggal }}</div>
    </div>

    <div class="page-body">

      <!-- Kartu Statistik -->
      <div class="stat-grid">
        <div class="stat-card green">
          <div class="stat-label">Penjualan Hari Ini</div>
          <div class="stat-value">{{ stat.trx }} Transaksi</div>
          <div class="stat-change">{{ stat.items }} item terjual</div>
        </div>
        <div class="stat-card gold">
          <div class="stat-label">Omzet Hari Ini</div>
          <div class="stat-value">{{ fmtRp(stat.omzet) }}</div>
          <div class="stat-change up">{{ fmtRp(stat.omzetMinggu) }} minggu ini</div>
        </div>
        <div class="stat-card blue">
          <div class="stat-label">Estimasi Keuntungan</div>
          <div class="stat-value">{{ fmtRp(stat.profit) }}</div>
          <div class="stat-change">Margin {{ stat.margin }}%</div>
        </div>
      </div>

      <!-- Grafik -->
      <div class="chart-grid">
        <div class="chart-card">
          <div class="chart-title">Omzet 7 Hari Terakhir</div>
          <div class="chart-wrap">
            <!-- ref="chartOmzet" dipakai di JavaScript untuk membuat Chart.js -->
            <canvas ref="chartOmzet"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-title">Top Produk (Hari Ini)</div>
          <div class="chart-wrap">
            <canvas ref="chartTop"></canvas>
          </div>
        </div>
      </div>

      <!-- Tabel Ringkasan -->
      <div class="summary-row">
        <!-- Ringkasan Harian -->
        <div class="summary-card">
          <div class="chart-title">Ringkasan Harian</div>
          <table class="summary-table">
            <thead>
              <tr>
                <th>Tanggal</th><th>Transaksi</th>
                <th style="text-align:right">Omzet</th>
                <th style="text-align:right">Untung</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="baris in tabelHarian" :key="baris.tanggal">
                <td>
                  {{ baris.label }}
                  <span v-if="baris.isToday" class="tag green">Hari ini</span>
                </td>
                <td><span class="tag gray">{{ baris.jumlah }}x</span></td>
                <td class="num">{{ fmtRp(baris.omzet) }}</td>
                <td class="num" style="color:var(--accent)">{{ fmtRp(baris.profit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Ringkasan Mingguan -->
        <div class="summary-card">
          <div class="chart-title">Ringkasan Mingguan</div>
          <table class="summary-table">
            <thead>
              <tr>
                <th>Minggu</th><th>Transaksi</th>
                <th style="text-align:right">Omzet</th>
                <th style="text-align:right">Untung</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="baris in tabelMingguan" :key="baris.label">
                <td><span :class="['tag', baris.isThis ? 'green' : 'gray']">{{ baris.label }}</span></td>
                <td><span class="tag gray">{{ baris.jumlah }}x</span></td>
                <td class="num">{{ fmtRp(baris.omzet) }}</td>
                <td class="num" style="color:var(--accent)">{{ fmtRp(baris.profit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
// Import Chart.js dari npm (sudah diinstall via package.json)
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import { fetchTransactions } from '../services/transactionService.js'
import { fmtRp, today, lastN, formatDateLong } from '../utils/helpers.js'

export default {
  name: 'DashboardView',

  data() {
    return {
      tanggal: formatDateLong(),

      // Data kartu statistik
      stat: { trx: 0, items: 0, omzet: 0, omzetMinggu: 0, profit: 0, margin: 0 },

      // Data tabel harian dan mingguan
      tabelHarian:   [],
      tabelMingguan: [],
      loading: false,

      // Simpan instance Chart.js agar bisa dihapus sebelum di-render ulang
      cOmzet: null,
      cTop:   null,
    }
  },

  mounted() {
    this.muatData()
  },

  beforeUnmount() {
    if (this.cOmzet) this.cOmzet.destroy()
    if (this.cTop)   this.cTop.destroy()
  },

  methods: {
    fmtRp, // Buat helper bisa dipakai di template ({{ fmtRp(...) }})

    async muatData() {
      this.loading = true
      try {
      const semuaTrx = await fetchTransactions()

      const td        = today()
      const trxHarini = semuaTrx.filter(t => t.date === td)

      // ── Hitung statistik kartu ──
      const omzet  = trxHarini.reduce((s, t) => s + t.total,  0)
      const profit = trxHarini.reduce((s, t) => s + t.profit, 0)
      const items  = trxHarini.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0)
      const omzetMinggu = lastN(7).reduce((s, d) => {
        return s + semuaTrx.filter(t => t.date === d).reduce((a, t) => a + t.total, 0)
      }, 0)

      this.stat = {
        trx: trxHarini.length,
        items,
        omzet,
        profit,
        omzetMinggu,
        margin: omzet ? Math.round(profit / omzet * 100) : 0
      }

      // ── Tabel Harian (7 hari terakhir) ──
      this.tabelHarian = [...lastN(7)].reverse().map(d => {
        const txs   = semuaTrx.filter(t => t.date === d)
        const label = new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        return {
          tanggal: d,
          label,
          isToday: d === td,
          jumlah:  txs.length,
          omzet:   txs.reduce((s, t) => s + t.total,  0),
          profit:  txs.reduce((s, t) => s + t.profit, 0),
        }
      })

      // ── Tabel Mingguan (4 minggu terakhir) ──
      this.tabelMingguan = Array.from({ length: 4 }, (_, w) => {
        const start = new Date()
        start.setDate(start.getDate() - start.getDay() - w * 7)
        const end   = new Date(start)
        end.setDate(end.getDate() + 6)
        const sd  = start.toISOString().slice(0, 10)
        const ed  = end.toISOString().slice(0, 10)
        const txs = semuaTrx.filter(t => t.date >= sd && t.date <= ed)
        return {
          label:   w === 0 ? 'Minggu ini' : `${w} minggu lalu`,
          isThis:  w === 0,
          jumlah:  txs.length,
          omzet:   txs.reduce((s, t) => s + t.total,  0),
          profit:  txs.reduce((s, t) => s + t.profit, 0),
        }
      })

      // Render grafik setelah data siap
      this.$nextTick(() => {
        this.renderGrafikOmzet(semuaTrx)
        this.renderGrafikTopProduk(trxHarini)
      })
      } catch (err) {
        window.showToast('Gagal memuat data: ' + err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    // ── Grafik Omzet 7 Hari (Line Chart) ──
    renderGrafikOmzet(semuaTrx) {
      if (this.cOmzet) this.cOmzet.destroy() // Hapus chart lama

      const hari   = lastN(7)
      const labels = hari.map(d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }))
      const data   = hari.map(d => semuaTrx.filter(t => t.date === d).reduce((s, t) => s + t.total, 0))

      this.cOmzet = new Chart(this.$refs.chartOmzet, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data,
            borderColor:     '#2D6A4F',
            backgroundColor: 'rgba(45,106,79,0.08)',
            fill: true, tension: 0.4,
            pointBackgroundColor: '#2D6A4F', pointRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => fmtRp(ctx.raw) } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#9A9A92' } },
            y: { grid: { color: '#ECEAE3' }, ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#9A9A92', callback: v => 'Rp' + (v >= 1000 ? (v/1000)+'k' : v) } }
          }
        }
      })
    },

    // ── Grafik Top Produk Hari Ini (Bar Chart) ──
    renderGrafikTopProduk(trxHarini) {
      if (this.cTop) this.cTop.destroy()

      // Hitung jumlah terjual per produk
      const hitungan = {}
      trxHarini.forEach(t => {
        t.items.forEach(i => {
          hitungan[i.productName] = (hitungan[i.productName] || 0) + i.qty
        })
      })

      const sorted = Object.entries(hitungan).sort((a, b) => b[1] - a[1]).slice(0, 5)
      const labels = sorted.length ? sorted.map(x => x[0]) : ['—']
      const data   = sorted.length ? sorted.map(x => x[1]) : [0]

      this.cTop = new Chart(this.$refs.chartTop, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ data, backgroundColor: '#B7E4C7', borderRadius: 4 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#9A9A92' } },
            y: { grid: { color: '#ECEAE3' }, ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#9A9A92', stepSize: 1 } }
          }
        }
      })
    }
  }
}
</script>
