import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'


export default function NavBar() {
const { token, nickname, logout } = useAuth()
const loc = useLocation()
return (
<nav className="navbar">
<div className="brand"><Link to="/">Check-In Board</Link></div>
<div className="spacer" />
<div className="menu">
<Link to="/">Home</Link>
{token && <Link to="/me">My</Link>}
{!token ? (
loc.pathname === '/login' ? <Link to="/register">Register</Link> : <Link to="/login">Login</Link>
) : (
<button onClick={logout} className="linklike">Logout{nickname ? ` (${nickname})` : ''}</button>
)}
</div>
</nav>
)
}