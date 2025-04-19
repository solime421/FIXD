import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null        // or a spinner
  return user
    ? children
    : <Navigate to="/login" replace />
}
