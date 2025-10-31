import React, { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext()


export function AuthProvider({ children }) {
const [token, setToken] = useState(null)
const [nickname, setNickname] = useState(null)


useEffect(() => {
setToken(localStorage.getItem('token'))
setNickname(localStorage.getItem('nickname'))
}, [])


const login = (t, n) => {
setToken(t)
localStorage.setItem('token', t)
if (n) { setNickname(n); localStorage.setItem('nickname', n) }
}


const logout = () => {
setToken(null)
setNickname(null)
localStorage.removeItem('token')
localStorage.removeItem('nickname')
}


return (
<AuthContext.Provider value={{ token, nickname, login, logout }}>
{children}
</AuthContext.Provider>
)
}


export function useAuth() {
const ctx = useContext(AuthContext)
if (!ctx) throw new Error('useAuth must be used within AuthProvider')
return ctx
}