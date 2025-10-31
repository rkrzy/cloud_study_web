import { useState } from 'react'
import { API } from '../api/client'


export default function CheckinForm({ onCreated }) {
const [message, setMessage] = useState('')
const [mood, setMood] = useState('happy')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')


const submit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
try {
await API.createMine({ message, mood })
setMessage('')
setMood('happy')
onCreated && onCreated()
} catch (e) {
setError(e.message)
} finally {
setLoading(false)
}
}


return (
<form onSubmit={submit} className="card">
<h3>New Check-In</h3>
<label>
Message
<input value={message} onChange={e => setMessage(e.target.value)} placeholder="What did you do today?" required />
</label>
<label>
Mood
<select value={mood} onChange={e => setMood(e.target.value)}>
<option value="happy">🙂 happy</option>
<option value="neutral">😐 neutral</option>
<option value="sad">🙁 sad</option>
</select>
</label>
{error && <p className="error">{error}</p>}
<button disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
</form>
)
}