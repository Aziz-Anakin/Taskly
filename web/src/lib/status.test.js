import {
  STATUSES,
  STATUS_META,
  formatDate,
  toDateInput,
  isOverdue,
} from './status.js'

describe('formatDate', () => {
  test('formate une date ISO en français', () => {
    expect(formatDate('2026-06-23')).toBe('23 juin 2026')
  })

  test('retourne une chaîne vide pour une valeur absente', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(null)).toBe('')
  })
})

describe('toDateInput', () => {
  test('convertit une date ISO en valeur YYYY-MM-DD', () => {
    expect(toDateInput('2026-06-23T00:00:00.000Z')).toBe('2026-06-23')
  })

  test('retourne une chaîne vide pour une valeur invalide', () => {
    expect(toDateInput('pas une date')).toBe('')
    expect(toDateInput('')).toBe('')
  })
})

describe('isOverdue', () => {
  test('false pour une tâche terminée même si la date est passée', () => {
    expect(isOverdue('2000-01-01', 'done')).toBe(false)
  })

  test('true pour une échéance passée non terminée', () => {
    expect(isOverdue('2000-01-01', 'todo')).toBe(true)
  })

  test('false pour une échéance future', () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    expect(isOverdue(future.toISOString(), 'todo')).toBe(false)
  })
})

describe('STATUS_META', () => {
  test('définit un libellé et des couleurs pour chaque statut', () => {
    STATUSES.forEach((status) => {
      expect(STATUS_META[status]).toBeDefined()
      expect(STATUS_META[status].label).toEqual(expect.any(String))
      expect(STATUS_META[status].dot).toEqual(expect.any(String))
    })
  })
})
