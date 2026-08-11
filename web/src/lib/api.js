// Client API minimal : même contrat que le backend Express (port 3000).
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000`

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = 'Bearer ' + token

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error("Impossible de contacter l'API. Vérifiez que le backend est lancé.")
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.msg || `Erreur serveur (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  login: (email, password) =>
    request('/login', { method: 'POST', body: { email, password } }),
  register: (payload) =>
    request('/register', { method: 'POST', body: payload }),
  getTodos: (token) => request('/user/todos', { token }),
  createTodo: (todo, token) =>
    request('/todos', { method: 'POST', body: todo, token }),
  updateTodo: (id, patch, token) =>
    request(`/todos/${id}`, { method: 'PUT', body: patch, token }),
  deleteTodo: (id, token) =>
    request(`/todos/${id}`, { method: 'DELETE', token }),
}

export { API_URL }
