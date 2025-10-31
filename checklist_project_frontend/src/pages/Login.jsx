import { useState } from 'react'
import { API } from '../api/client'
import { useAuth } from '../state/AuthContext'
import { useNavigate, Link } from 'react-router-dom'


export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const { login } = useAuth()
const nav = useNavigate()


const submit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
try {
const res = await API.login({ email, password })
login(res.access_token, res.nickname)
nav('/me')
} catch (e) {
setError(e.message)
} finally {
setLoading(false)
}
}


return (
<form onSubmit={submit} className="card">
<h2>Login</h2>
<label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
<label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
{error && <p className="error">{error}</p>}
<button disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
<p className="dim">No account? <Link to="/register">Register</Link></p>
</form>
)
}