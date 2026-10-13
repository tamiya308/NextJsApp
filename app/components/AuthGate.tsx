'use client'

import { useEffect } from 'react'
import { useUserName, watchExpiry } from '../lib/auth'
import LoginForm from './LoginForm'

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const userName = useUserName()

  useEffect(() => watchExpiry(), [userName])

  // Render nothing until localStorage has been checked, so the login form doesn't flash.
  if (userName === undefined) return null
  if (!userName) return <LoginForm />
  return <>{children}</>
}

export default AuthGate
