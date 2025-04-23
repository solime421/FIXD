import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, see if we already have a token
  useEffect(() => {
    const token = localStorage.getItem('authToken')
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
    // store under the same key your profile page reads
    localStorage.setItem('authToken', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setUser(data.user)
  }

  const register = async (payload) => {
    const { data } = await axios.post('/api/auth/register', payload)
    localStorage.setItem('authToken', data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    delete axios.defaults.headers.common.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        // expose this so your Login page can redirect if already logged in
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}