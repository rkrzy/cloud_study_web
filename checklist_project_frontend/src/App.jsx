import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyCheckins from './pages/MyCheckins'
import { useAuth } from './state/AuthContext'
import NavBar from './components/NavBar'


function PrivateRoute({ children }) {
const { token } = useAuth()
return token ? children : <Navigate to="/login" replace />
}


export default function App() {
return (
<div className="app">
<NavBar />
<div className="container">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/me" element={<PrivateRoute><MyCheckins /></PrivateRoute>} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</div>
</div>
)
}