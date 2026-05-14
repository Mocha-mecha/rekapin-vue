// utils/validation.js
// Semua validasi input terpusat di sini.
// Setiap fungsi mengembalikan array error (kosong = valid).

export function validateLogin({ username, password }) {
  const errors = []
  if (!username?.trim()) errors.push('Username wajib diisi.')
  if (!password)         errors.push('Password wajib diisi.')
  return errors
}

export function validateRegister({ nama, username, password, password2, sq, sa }) {
  const errors = []
  if (!nama?.trim())           errors.push('Nama toko wajib diisi.')
  if (!username?.trim())       errors.push('Username wajib diisi.')
  if ((username || '').length < 3) errors.push('Username minimal 3 karakter.')
  if (!password)               errors.push('Password wajib diisi.')
  if ((password || '').length < 4) errors.push('Password minimal 4 karakter.')
  if (password !== password2)  errors.push('Konfirmasi password tidak cocok.')
  if (!sq)                     errors.push('Pertanyaan keamanan wajib dipilih.')
  if (!sa?.trim())             errors.push('Jawaban keamanan wajib diisi.')
  return errors
}

export function validateProduct(form) {
  const errors = []
  if (!form.nama?.trim())              errors.push('Nama produk wajib diisi.')
  if (form.modal == null || form.modal < 0) errors.push('Harga modal tidak boleh negatif.')
  if (!form.jual || form.jual <= 0)    errors.push('Harga jual harus lebih dari 0.')
  if (form.jual < form.modal)          errors.push('Harga jual tidak boleh lebih rendah dari modal.')
  if (form.diskon < 0 || form.diskon > 100) errors.push('Diskon harus antara 0–100%.')
  if (form.hasStock && form.stock < 0) errors.push('Stok tidak boleh negatif.')
  return errors
}

export function validatePasswordChange({ passwordLama, passwordBaru, passwordKonfirmasi }) {
  const errors = []
  if (!passwordLama)                   errors.push('Password lama wajib diisi.')
  if (!passwordBaru)                   errors.push('Password baru wajib diisi.')
  if ((passwordBaru || '').length < 4) errors.push('Password baru minimal 4 karakter.')
  if (passwordBaru !== passwordKonfirmasi) errors.push('Konfirmasi password tidak cocok.')
  return errors
}
