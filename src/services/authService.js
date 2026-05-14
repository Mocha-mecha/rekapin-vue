// services/authService.js
// Semua operasi authentication & session ada di sini.
// Saat ini pakai localStorage. Saat backend siap: uncomment blok NANTI.

import { getUsers, saveUsers, seedDataIfEmpty } from '../utils/db.js'

const TOKEN_KEY = 'rk_token'
const USER_KEY  = 'rk_user'

// ══════════════════════════════════════
//  TOKEN & SESSION
// ══════════════════════════════════════

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
}

export function getUserId() {
  return getUser()?.id || null
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token))
    // Cek token belum expired
    if (payload.exp && Date.now() > payload.exp) {
      clearAuth()
      return false
    }
    return true
  } catch {
    clearAuth()
    return false
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Token lokal sementara (base64). NANTI: diganti JWT dari server.
function createLocalToken(userId) {
  const payload = { id: userId, exp: Date.now() + 24 * 60 * 60 * 1000 }
  return btoa(JSON.stringify(payload))
}

// ══════════════════════════════════════
//  AUTH: LOGIN & REGISTER
// ══════════════════════════════════════

export async function login(username, password) {
  // NANTI: const res = await api.post('/auth/login', { username, password })
  // NANTI: saveAuth(res.data.token, res.data.user)
  // NANTI: return res.data

  const users = getUsers()
  const user  = users.find(u => u.username === username && u.password === password)
  if (!user) throw new Error('Username atau password salah.')

  const token    = createLocalToken(user.username)
  const userData = { id: user.username, username: user.username, nama: user.nama }
  saveAuth(token, userData)
  seedDataIfEmpty(user.username)
  return { token, user: userData }
}

export async function register({ nama, username, password, sq, sa }) {
  // NANTI: const res = await api.post('/auth/register', { nama, username, password, sq, sa })
  // NANTI: saveAuth(res.data.token, res.data.user)
  // NANTI: return res.data

  const users = getUsers()
  if (users.find(u => u.username === username)) {
    throw new Error('Username sudah dipakai, coba yang lain.')
  }

  const newUser = { id: username, username, password, nama, sq, sa: sa.toLowerCase() }
  users.push(newUser)
  saveUsers(users)

  const token    = createLocalToken(username)
  const userData = { id: username, username, nama }
  saveAuth(token, userData)
  seedDataIfEmpty(username)
  return { token, user: userData }
}

export function logout() {
  // NANTI: await api.post('/auth/logout')
  clearAuth()
}

// ══════════════════════════════════════
//  PROFIL
// ══════════════════════════════════════

export async function getUserDetails() {
  // NANTI: const res = await api.get('/auth/profile'); return res.data

  const currentUser = getUser()
  const users = getUsers()
  return users.find(u => u.username === currentUser?.id) || currentUser
}

export async function updateProfile({ nama, username }) {
  // NANTI: const res = await api.put('/auth/profile', { nama, username })
  // NANTI: saveAuth(getToken(), { ...getUser(), nama, username }); return res.data

  const currentUser = getUser()
  const users = getUsers()
  const idx   = users.findIndex(u => u.username === currentUser.id)

  if (users.find((u, i) => i !== idx && u.username === username)) {
    throw new Error('Username sudah dipakai, coba yang lain.')
  }

  users[idx].nama     = nama
  users[idx].username = username
  saveUsers(users)

  const updatedUser = { ...currentUser, nama, username }
  saveAuth(getToken(), updatedUser)
  return updatedUser
}

export async function changePassword({ passwordLama, passwordBaru }) {
  // NANTI: await api.put('/auth/password', { passwordLama, passwordBaru })

  const currentUser = getUser()
  const users = getUsers()
  const idx   = users.findIndex(u => u.username === currentUser.id)

  if (users[idx].password !== passwordLama) throw new Error('Password lama salah.')

  users[idx].password = passwordBaru
  saveUsers(users)
}

export async function changeSecurityQuestion({ sq, sa }) {
  // NANTI: await api.put('/auth/security', { sq, sa })

  const currentUser = getUser()
  const users = getUsers()
  const idx   = users.findIndex(u => u.username === currentUser.id)
  users[idx].sq = sq
  users[idx].sa = sa.toLowerCase()
  saveUsers(users)
}

export async function deleteAccount() {
  // NANTI: await api.delete('/auth/account')

  const currentUser = getUser()
  const users = getUsers().filter(u => u.username !== currentUser.id)
  saveUsers(users)
  logout()
}

// ══════════════════════════════════════
//  LUPA PASSWORD
// ══════════════════════════════════════

export async function getSecurityQuestion(username) {
  // NANTI: const res = await api.get('/auth/security/' + username); return res.data

  const users = getUsers()
  const user  = users.find(u => u.username === username)
  if (!user)    throw new Error('Username tidak ditemukan.')
  if (!user.sq) throw new Error('Akun ini tidak memiliki pertanyaan keamanan.')
  return { sq: user.sq }
}

export async function verifySecurityAnswer(username, answer) {
  // NANTI: await api.post('/auth/verify-answer', { username, answer })

  const users = getUsers()
  const user  = users.find(u => u.username === username)
  if (!user)                         throw new Error('Username tidak ditemukan.')
  if (answer.toLowerCase() !== user.sa) throw new Error('Jawaban salah. Coba lagi.')
}

export async function resetPassword(username, newPassword) {
  // NANTI: await api.post('/auth/reset-password', { username, newPassword })

  const users = getUsers()
  const idx   = users.findIndex(u => u.username === username)
  if (idx === -1) throw new Error('Username tidak ditemukan.')
  users[idx].password = newPassword
  saveUsers(users)
}
