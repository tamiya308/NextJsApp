'use client'

import { logout, useUserName } from '../lib/auth'

const LogoutButton = () => {
  const userName = useUserName()

  return (
    <div className="ml-auto flex items-center gap-2">
      <span className="text-sm">{userName}</span>
      <button onClick={logout} className="btn btn-sm">Log out</button>
    </div>
  )
}

export default LogoutButton
