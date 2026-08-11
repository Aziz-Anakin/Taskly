import { useState } from 'react'
import { motion } from 'motion/react'
import { STATUSES, STATUS_META, formatDate, toDateInput, isOverdue } from '../lib/status.js'
import { IconCheck, IconUndo, IconPencil, IconTrash, IconCalendar } from './icons.jsx'

const editField =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 field-focus transition'

export default function TaskItem({ todo, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)

  const meta = STATUS_META[todo.status] || STATUS_META['not started']
  const done = todo.status === 'done'
  const overdue = isOverdue(todo.due_time, todo.status)

  function startEdit() {
    setDraft({
      title: todo.title,
      description: todo.description,
      due_time: toDateInput(todo.due_time),
      status: todo.status,
    })
    setEditing(true)
  }

  async function save() {
    if (!draft.title.trim() || !draft.description.trim() || !draft.due_time) return
    setSaving(true)
    try {
      await onSave(todo.id, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        due_time: draft.due_time,
        status: draft.status,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const setField = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }))

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="group rounded-[14px] border border-line bg-surface p-4 transition-colors hover:border-ink/15 sm:p-5"
    >
      {editing ? (
        <div className="space-y-3">
          <input
            className={editField}
            value={draft.title}
            onChange={setField('title')}
            placeholder="Titre"
            autoFocus
          />
          <input
            className={editField}
            value={draft.description}
            onChange={setField('description')}
            placeholder="Description"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              className={editField}
              value={draft.due_time}
              onChange={setField('due_time')}
            />
            <select
              className={`${editField} field-select`}
              value={draft.status}
              onChange={setField('status')}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium text-muted transition hover:text-ink"
            >
              Annuler
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-evergreen px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-evergreen-dark disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {/* Coche de complétion */}
          <button
            onClick={() => onToggle(todo)}
            title={done ? 'Marquer à faire' : 'Marquer terminé'}
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
              done
                ? 'border-evergreen bg-evergreen text-paper'
                : 'border-line text-transparent hover:border-evergreen hover:text-evergreen/40'
            }`}
          >
            <IconCheck width={13} height={13} strokeWidth={2.4} />
          </button>

          {/* Contenu */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3
                className={`text-[15px] font-semibold tracking-tight ${
                  done ? 'text-muted line-through' : 'text-ink'
                }`}
              >
                {todo.title}
              </h3>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: meta.tint, color: meta.ink }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta.dot }}
                />
                {meta.label}
              </span>
            </div>

            {todo.description && (
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  done ? 'text-muted/70' : 'text-ink-soft'
                }`}
              >
                {todo.description}
              </p>
            )}

            <div
              className={`mt-2 flex items-center gap-1.5 text-[12.5px] ${
                overdue ? 'font-medium text-[#9c4a3a]' : 'text-muted'
              }`}
            >
              <IconCalendar width={13} height={13} />
              {formatDate(todo.due_time)}
              {overdue && <span className="ml-1">· en retard</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 opacity-60 transition group-hover:opacity-100">
            <button
              onClick={() => onToggle(todo)}
              title={done ? 'Rouvrir' : 'Terminer'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-paper hover:text-ink"
            >
              {done ? <IconUndo width={16} height={16} /> : <IconCheck width={16} height={16} />}
            </button>
            <button
              onClick={startEdit}
              title="Modifier"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-paper hover:text-ink"
            >
              <IconPencil width={16} height={16} />
            </button>
            <button
              onClick={() => onDelete(todo)}
              title="Supprimer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-[#f7ece9] hover:text-[#9c4a3a]"
            >
              <IconTrash width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </motion.li>
  )
}
