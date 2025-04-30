import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

//wraps components and provides auth data to all components.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      //defining default so I don't have to do it later every time
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          // invalid token, clear header and user
          delete axios.defaults.headers.common.Authorization
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Helper to update just the profilePicture on the stored user
  //Allows updating just the avatar URL without refetching the full user.
  const updateUserPic = (newUrl) => {
    setUser(u => u ? { ...u, profilePicture: newUrl } : u)
  }

  const login = async ({ email, password }) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    // save token for future sessions
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
        updateUserPic,
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