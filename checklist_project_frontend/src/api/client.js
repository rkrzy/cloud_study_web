const BASE = import.meta.env.VITE_API_BASE


async function request(path, opts = {}) {
const token = localStorage.getItem('token')
const headers = {
'Content-Type': 'application/json',
...(token ? { Authorization: `Bearer ${token}` } : {}),
...(opts.headers || {}),
}
const res = await fetch(`${BASE}${path}`, { ...opts, headers })
if (!res.ok) throw new Error((await res.text()) || res.statusText)
return res.json()
}


export const API = {
register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
listPublic: () => request('/checkins'),
listMine: () => request('/me/checkins'),
createMine: (body) => request('/me/checkins', { method: 'POST', body: JSON.stringify(body) }),
updateMine: (id, body) => request(`/me/checkins/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
deleteMine: (id) => request(`/me/checkins/${id}`, { method: 'DELETE' }),
}