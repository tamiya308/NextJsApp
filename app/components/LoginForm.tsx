'use client'

import { useState } from 'react'
import { login } from '../lib/auth'

const LoginForm = () => {
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const ok = login(String(data.get('userName')), String(data.get('password')))
    if (!ok) setError('Invalid user name or password')
  }

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded border p-6">
        <h1 className="text-xl font-bold">Log in</h1>
        <label className="block">
          <span className="text-sm">User name</span>
          <input name="userName" autoComplete="username" required autoFocus className="mt-1 w-full rounded border px-2 py-1" />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded border px-2 py-1" />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">Log in</button>
      </form>
    </main>
  )
}

export default LoginForm
