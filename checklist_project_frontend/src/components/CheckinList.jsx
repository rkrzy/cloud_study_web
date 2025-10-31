export default function CheckinList({ items }) {
    if (!items?.length) return <p>No check-ins yet.</p>
    return (
    <ul className="list">
    {items.map(it => (
    <li key={it.id} className="card">
    <div className="row">
    <strong>{it.nickname}</strong>
    <span className="dim">{new Date(it.created_at).toLocaleString()}</span>
    </div>
    <p>{it.message}</p>
    <span className="tag">{it.mood}</span>
    </li>
    ))}
    </ul>
    )
    }