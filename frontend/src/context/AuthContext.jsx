import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// 1) Create & export the Context itself
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount try to load current user (e.g. from localStorage / API)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          delete axios.defaults.headers.common.Authorization
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async ({ email, password }) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setUser(data.user)
  }

  const register = async (payload) => {
    const { data } = await axios.post('/api/auth/register', payload)
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 2) Export a simple hook for components to consume auth state
export function useAuth() {
  return useContext(AuthContext)
}
