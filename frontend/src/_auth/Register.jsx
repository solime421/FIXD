import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
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

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await register({
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('../../images/FIXDBackround.png')] bg-no-repeat bg-center bg-[length:100%_auto] ">
      <div className="w-[340px] h-fit p-[30px] rounded-[15px] space-y-[30px] shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient">
        <h2 className="font-semibold">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col h-fit space-y-[30px]">
          {/* Role dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="h-[40px]"
            required
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="h-[40px]"
            required
          />

          {/* First & Last name side by side */}
          <div className="flex space-x-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="flex-1 h-[40px]"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="flex-1 h-[40px]"
              required
            />
          </div>

          {/* Phone */}
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="h-[40px]"
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="h-[40px]"
            required
          />

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="h-[40px]"
            required
          />

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-black">
        Already have an account?{' '}
        <Link to="/login" className="font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
)}

export default Register;