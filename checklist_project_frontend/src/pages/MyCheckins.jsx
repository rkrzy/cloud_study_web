import { useEffect, useState } from 'react'
import { API } from '../api/client'
import CheckinForm from '../components/CheckinForm'


export default function MyCheckins() {
const [items, setItems] = useState([])
const [error, setError] = useState('')
const [loading, setLoading] = useState(true)


const load = () => {
setLoading(true)
API.listMine()
.then(setItems)
.catch(e => setError(e.message))
.finally(() => setLoading(false))
}


useEffect(() => { load() }, [])


const remove = async (id) => {
if (!confirm('Delete this check-in?')) return
try {
await API.deleteMine(id)
load()
} catch (e) {
alert(e.message)
}
}


return (
<div>
<h2>My Check-Ins</h2>
<CheckinForm onCreated={load} />
{loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : (
<ul className="list">
{items.map(it => (
<li key={it.id} className="card">
<div className="row">
<strong>#{it.id}</strong>
<span className="dim">{new Date(it.created_at).toLocaleString()}</span>
</div>
<p>{it.message}</p>
<div className="row">
<span className="tag">{it.mood}</span>
<button onClick={() => remove(it.id)} className="danger">Delete</button>
</div>
</li>
))}
</ul>
)}
</div>
)
}