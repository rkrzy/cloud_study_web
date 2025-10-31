import { useState } from 'react'
import { API } from '../api/client'
import { Link, useNavigate } from 'react-router-dom'


export default function Register() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [nickname, setNickname] = useState('')
const [error, setError] = useState('')
const [ok, setOk] = useState('')
const [loading, setLoading] = useState(false)
const nav = useNavigate()


const submit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
setOk('')
try {
await API.register({ email, password, nickname })
setOk('Registered! Please login.')
setTimeout(() => nav('/login'), 700)
} catch (e) {
setError(e.message)
} finally {
setLoading(false)
}
}


return (
<form onSubmit={submit} className="card">
<h2>Register</h2>
<label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
<label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
<label>Nickname<input value={nickname} onChange={e => setNickname(e.target.value)} required /></label>
{error && <p className="error">{error}</p>}
{ok && <p className="ok">{ok}</p>}
<button disabled={loading}>{loading ? 'Loading...' : 'Create account'}</button>
<p className="dim">Have an account? <Link to="/login">Login</Link></p>
</form>
)
}