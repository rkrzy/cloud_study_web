import { useEffect, useState } from 'react'
import { API } from '../api/client'
import CheckinList from '../components/CheckinList'


export default function Home() {
const [items, setItems] = useState([])
const [error, setError] = useState('')
const [loading, setLoading] = useState(true)


useEffect(() => {
API.listPublic()
.then(setItems)
.catch(e => setError(e.message))
.finally(() => setLoading(false))
}, [])


return (
<div>
<h2>Public Check-Ins</h2>
{loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : <CheckinList items={items} />}
</div>
)
}