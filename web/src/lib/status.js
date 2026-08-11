// Métadonnées des statuts de tâche (libellés FR + couleurs sobres).
export const STATUSES = ['not started', 'todo', 'in progress', 'done']

export const STATUS_META = {
  'not started': {
    label: 'À démarrer',
    dot: '#a8a498',
    tint: 'var(--color-line-soft)',
    ink: 'var(--color-muted)',
  },
  todo: {
    label: 'À faire',
    dot: '#6c8aa6',
    tint: 'var(--color-slate-tint)',
    ink: 'var(--color-slate-ink)',
  },
  'in progress': {
    label: 'En cours',
    dot: '#c49a52',
    tint: 'var(--color-ochre-tint)',
    ink: 'var(--color-ochre-ink)',
  },
  done: {
    label: 'Terminé',
    dot: '#5c8a6e',
    tint: 'var(--color-evergreen-tint)',
    ink: 'var(--color-evergreen)',
  },
}

export function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Normalise une date (ISO ou YYYY-MM-DD) vers la valeur d'un <input type="date">.
export function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function isOverdue(value, status) {
  if (status === 'done' || !value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}
