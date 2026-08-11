import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { IconLogout } from './icons.jsx'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-tight text-ink transition hover:opacity-70"
        >
          Taskly
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-soft transition hover:border-ink/20 hover:text-ink"
        >
          <IconLogout width={15} height={15} />
          Déconnexion
        </button>
      </div>
    </header>
  )
}
