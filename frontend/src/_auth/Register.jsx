import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InputField from '../components/InputField';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'client',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await register({
        role:      form.role,
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
        email:     form.email,
        password:  form.password,
      });

      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen
                 bg-[url('/images/FIXDBackround.png')] bg-no-repeat bg-center bg-[length:100%_auto]"
    >
      <div className="w-[340px] p-[30px] rounded-[15px] space-y-[30px]
                      shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient">
        <h2 className="font-semibold text-xl">Создать аккаунт</h2>

        {error && <p className="text-red-500 font-bold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-[30px]">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full h-[40px] border-b outline-none bg-transparent"
            required
          >
            <option value="client">Клиент</option>
            <option value="freelancer">Специалист</option>
          </select>

          <InputField
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="flex gap-4">
            <InputField
              name="firstName"
              placeholder="Имя"
              value={form.firstName}
              onChange={handleChange}
              className="flex-1"
              required
            />
            <InputField
              name="lastName"
              placeholder="Фамилия"
              value={form.lastName}
              onChange={handleChange}
              className="flex-1"
              required
            />
          </div>

          <InputField
            name="phone"
            type="tel"
            placeholder="Номер телефона"
            value={form.phone}
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

          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            Зарегистрироваться
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-gray-800">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-bold hover:underline">
         Войти
        </Link>
      </p>
    </div>
  );
}
