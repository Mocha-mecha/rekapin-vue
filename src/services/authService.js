// services/authService.js
// Semua operasi authentication & session terhubung ke backend Spring Boot.

import api from './api.js'

const TOKEN_KEY = 'rk_token'
const USER_KEY  = 'rk_user'

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(atob(normalized).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function normalizeUser(user = {}) {
  return {
    id:       user.id ?? user.username,
    username: user.username,
    nama:     user.nama ?? user.fullName ?? '',
    sq:       user.sq ?? user.securityQuestion ?? '',
  }
}

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

  const payload = decodeJwt(token)
  if (!payload?.exp) return true

  if (Date.now() >= payload.exp * 1000) {
    clearAuth()
    return false
  }
  return true
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)))
}

async function refreshUser() {
  const user = await api.get('/auth/me')
  saveAuth(getToken(), user)
  return normalizeUser(user)
}

export async function login(username, password) {
  const res = await api.post('/auth/login', { username, password })
  saveAuth(res.token, { username })
  const user = await refreshUser()
  return { token: res.token, user }
}

export async function register({ nama, username, password, sq, sa }) {
  const res = await api.post('/auth/register', {
    username,
    password,
    fullName: nama,
    securityQuestion: sq || null,
    securityAnswer: sa || null,
  })
  saveAuth(res.token, { username, nama, sq })
  const user = await refreshUser()
  return { token: res.token, user }
}

export function logout() {
  clearAuth()
}

export async function getUserDetails() {
  const user = await api.get('/auth/me')
  saveAuth(getToken(), user)
  return normalizeUser(user)
}

export async function updateProfile({ nama }) {
  const username = getUser()?.username
  const res = await api.put('/auth/me', { fullName: nama, username })
  const user = res.user ?? res
  saveAuth(res.token ?? getToken(), user)
  return normalizeUser(user)
}

export async function changePassword({ passwordLama, passwordBaru }) {
  await api.put('/auth/password', { oldPassword: passwordLama, newPassword: passwordBaru })
}

export async function changeSecurityQuestion({ sq, sa }) {
  await api.put('/auth/security', { securityQuestion: sq, securityAnswer: sa })
  const current = getUser()
  saveAuth(getToken(), { ...current, sq })
}

export async function deleteAccount() {
  await api.delete('/auth/me')
  clearAuth()
}

export async function getSecurityQuestion(username) {
  const res = await api.get('/auth/security/' + encodeURIComponent(username))
  return { sq: res.securityQuestion }
}

export async function verifySecurityAnswer(username, securityQuestion, answer) {
  await api.post('/auth/verify-answer', { username, securityQuestion, answer })
}

export async function resetPassword(username, newPassword) {
  await api.post('/auth/reset-password', { username, newPassword })
}
