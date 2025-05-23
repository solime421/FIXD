import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const navigate            = useNavigate()

  // if already logged in, send them on to /home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(form)  
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/FIXDBackround.png')] bg-no-repeat bg-center bg-[length:100%_auto]">
      <div className="w-[350px] p-[30px] rounded-[15px] space-y-[30px] shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient">
        <h2 className="font-semibold">Вход</h2>
        {error && <p className="text-red-500 font-bold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-[40px]">
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputField
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Войти
          </button>
        </form>
      </div>
      <p className="mt-4 text-sm text-black">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-bold hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  )
}
