import { useSyncExternalStore } from 'react'

// Client-side only: demo login kept in localStorage, not real security.
const STORAGE_KEY = 'auth'
const CHANGE_EVENT = 'auth-change'
const SESSION_MS = 60 * 60 * 1000 // 1 hour

const DEFAULT_USER = { userName: 'admin', password: 'admin' }

interface Session {
  userName: string
  expiresAt: number
}

function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as Session
    return session.expiresAt > Date.now() ? session : null
  } catch {
    return null
  }
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function login(userName: string, password: string): boolean {
  if (userName !== DEFAULT_USER.userName || password !== DEFAULT_USER.password) {
    return false
  }
  const session: Session = { userName, expiresAt: Date.now() + SESSION_MS }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  notify()
  return true
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  notify()
}

// Removes an expired session now, or logs out when the current one expires.
export function watchExpiry(): () => void {
  const session = readSession()
  if (!session) {
    localStorage.removeItem(STORAGE_KEY)
    return () => {}
  }
  const timer = setTimeout(logout, session.expiresAt - Date.now())
  return () => clearTimeout(timer)
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback) // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

// undefined = not checked yet (server render), null = logged out.
export function useUserName(): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => readSession()?.userName ?? null,
    () => undefined,
  )
}
