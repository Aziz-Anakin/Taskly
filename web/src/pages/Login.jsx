import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { IconArrow, IconCheck } from '../components/icons.jsx'

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 field-focus transition'

const ease = [0.22, 0.61, 0.36, 1]

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstname: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (mode === 'register' && (!form.firstname.trim() || !form.name.trim())) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (mode === 'register' && form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      const data =
        mode === 'login'
          ? await api.login(form.email.trim(), form.password)
          : await api.register({
              email: form.email.trim(),
              password: form.password,
              firstname: form.firstname.trim(),
              name: form.name.trim(),
            })
      login(data.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  const isRegister = mode === 'register'

  return (
    <div className="min-h-screen bg-paper bg-grain lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Panneau éditorial */}
      <aside className="relative hidden overflow-hidden bg-evergreen-deep px-14 py-12 text-paper lg:flex lg:flex-col lg:items-center lg:justify-center lg:text-center">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(46,90,72,0.85) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(120,150,130,0.5) 0%, transparent 70%)',
          }}
        />

        <span className="absolute left-14 top-12 font-display text-2xl font-semibold tracking-tight">
          Taskly
        </span>

        <div className="relative max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[2.9rem] font-light leading-[1.08] tracking-tight"
          >
            Vos journées,
            <br />
            <span className="italic text-evergreen-tint">remises au clair.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-paper/70"
          >
            Un espace sobre pour noter, organiser et accomplir. Sans bruit,
            sans superflu, juste l'essentiel.
          </motion.p>

          <ul className="mt-10 space-y-3">
            {['Capturez une tâche en quelques secondes', 'Suivez l’avancement d’un coup d’œil', 'Concentrez-vous sur ce qui compte'].map(
              (line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="flex items-center justify-center gap-3 text-[14px] text-paper/80"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-evergreen text-paper">
                    <IconCheck width={13} height={13} strokeWidth={2.2} />
                  </span>
                  {line}
                </motion.li>
              ),
            )}
          </ul>
        </div>

        <p className="absolute bottom-12 left-14 text-xs text-paper/40">
          © {new Date().getFullYear()} Taskly. Tous droits réservés.
        </p>
      </aside>

      {/* Formulaire */}
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Taskly
            </span>
          </div>

          <h2 className="font-display text-[1.9rem] font-medium leading-tight tracking-tight text-ink">
            {isRegister ? 'Créer un compte' : 'Bon retour'}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            {isRegister
              ? 'Quelques informations et c’est parti.'
              : 'Connectez-vous pour retrouver vos tâches.'}
          </p>

          {/* Bascule connexion / inscription */}
          <div className="mt-7 flex rounded-lg border border-line bg-surface p-1 text-sm">
            {[
              ['login', 'Connexion'],
              ['register', 'Inscription'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                className={`relative flex-1 rounded-md py-1.5 font-medium transition ${
                  mode === value ? 'text-paper' : 'text-muted hover:text-ink'
                }`}
              >
                {mode === value && (
                  <motion.span
                    layoutId="authPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-evergreen"
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom">
                  <input
                    className={fieldClass}
                    value={form.firstname}
                    onChange={set('firstname')}
                    placeholder="Camille"
                    required
                  />
                </Field>
                <Field label="Nom">
                  <input
                    className={fieldClass}
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Durand"
                    required
                  />
                </Field>
              </div>
            )}

            <Field label="Email">
              <input
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={set('email')}
                placeholder="vous@exemple.fr"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Mot de passe">
              <input
                type="password"
                className={fieldClass}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-[#e4c7c0] bg-[#f7ece9] px-3.5 py-2.5 text-[13px] text-[#9c4a3a]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-evergreen px-4 py-2.5 text-[15px] font-medium text-paper transition hover:bg-evergreen-dark disabled:opacity-60"
            >
              {loading
                ? 'Un instant…'
                : isRegister
                  ? 'Créer mon compte'
                  : 'Se connecter'}
              {!loading && (
                <IconArrow
                  width={17}
                  height={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-muted">
            {isRegister ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
            <button
              type="button"
              onClick={() => switchMode(isRegister ? 'login' : 'register')}
              className="font-medium text-evergreen underline-offset-4 hover:underline"
            >
              {isRegister ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      {children}
    </label>
  )
}
