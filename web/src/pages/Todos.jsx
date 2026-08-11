import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { STATUSES, STATUS_META } from '../lib/status.js'
import Navbar from '../components/Navbar.jsx'
import TaskItem from '../components/TaskItem.jsx'
import { IconPlus } from '../components/icons.jsx'

const addField =
  'w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 field-focus transition'

const emptyDraft = { title: '', description: '', due_time: '', status: 'todo' }

const FILTERS = [
  ['all', 'Toutes'],
  ['active', 'Actives'],
  ['done', 'Terminées'],
]

export default function Todos() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState(emptyDraft)
  const [adding, setAdding] = useState(false)

  function handleAuthError(err) {
    if (err.status === 401 || err.status === 403) {
      logout()
      navigate('/login', { replace: true })
      return true
    }
    return false
  }

  async function loadTodos() {
    setLoading(true)
    setError('')
    try {
      const data = await api.getTodos(token)
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addTask(e) {
    e.preventDefault()
    setError('')
    if (!draft.title.trim() || !draft.description.trim() || !draft.due_time) {
      setError('Renseignez un titre, une description et une date.')
      return
    }
    setAdding(true)
    try {
      const created = await api.createTodo(
        {
          title: draft.title.trim(),
          description: draft.description.trim(),
          due_time: draft.due_time,
          status: draft.status,
        },
        token,
      )
      setTodos((prev) => [created, ...prev])
      setDraft(emptyDraft)
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  async function toggleTask(todo) {
    const next = todo.status === 'done' ? 'todo' : 'done'
    const updated = await api
      .updateTodo(todo.id, { status: next }, token)
      .catch((err) => {
        handleAuthError(err)
        return null
      })
    if (updated) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)))
    }
  }

  async function saveTask(id, patch) {
    const updated = await api.updateTodo(id, patch, token).catch((err) => {
      if (!handleAuthError(err)) setError(err.message)
      return null
    })
    if (updated) {
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    }
  }

  async function deleteTask(todo) {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    await api.deleteTodo(todo.id, token).catch((err) => {
      handleAuthError(err)
    })
  }

  const setField = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }))

  const doneCount = useMemo(
    () => todos.filter((t) => t.status === 'done').length,
    [todos],
  )

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => t.status !== 'done')
    if (filter === 'done') return todos.filter((t) => t.status === 'done')
    return todos
  }, [todos, filter])

  return (
    <div className="min-h-screen bg-paper bg-grain">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
        {/* En-tête */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[2.4rem] font-medium leading-none tracking-tight text-ink">
              Mes tâches
            </h1>
            <p className="mt-2 text-sm text-muted">
              {todos.length === 0
                ? 'Aucune tâche pour l’instant.'
                : `${todos.length} tâche${todos.length > 1 ? 's' : ''} · ${doneCount} terminée${doneCount > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filtres */}
          <div className="flex rounded-lg border border-line bg-surface p-1 text-[13px]">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`relative rounded-md px-3.5 py-1.5 font-medium transition ${
                  filter === value ? 'text-paper' : 'text-muted hover:text-ink'
                }`}
              >
                {filter === value && (
                  <motion.span
                    layoutId="filterPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-evergreen"
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ajout d'une tâche (inline, pas de modale) */}
        <form
          onSubmit={addTask}
          noValidate
          className="mt-7 rounded-[16px] border border-line bg-surface p-4 sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={addField}
              value={draft.title}
              onChange={setField('title')}
              placeholder="Titre de la tâche"
            />
            <input
              className={addField}
              value={draft.description}
              onChange={setField('description')}
              placeholder="Description"
            />
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="date"
              className={`${addField} sm:max-w-[12rem]`}
              value={draft.due_time}
              onChange={setField('due_time')}
            />
            <select
              className={`${addField} field-select sm:max-w-[12rem]`}
              value={draft.status}
              onChange={setField('status')}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={adding}
              className="flex items-center justify-center gap-2 rounded-lg bg-evergreen px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-evergreen-dark disabled:opacity-60 sm:ml-auto"
            >
              <IconPlus width={16} height={16} />
              {adding ? 'Ajout…' : 'Ajouter'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-[#e4c7c0] bg-[#f7ece9] px-4 py-2.5 text-[13px] text-[#9c4a3a]">
            {error}
          </p>
        )}

        {/* Liste */}
        <div className="mt-8">
          {loading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-[92px] animate-pulse rounded-[14px] border border-line bg-surface/60"
                />
              ))}
            </ul>
          ) : visible.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-line bg-surface/50 py-16 text-center">
              <p className="font-display text-lg text-ink">
                {filter === 'done'
                  ? 'Rien de terminé pour le moment.'
                  : 'Votre liste est vide.'}
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Ajoutez une première tâche pour commencer.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {visible.map((todo) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onSave={saveTask}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
