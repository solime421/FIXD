import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('../../images/FIXDBackround.png')] bg-no-repeat bg-center bg-[length:100%_auto] ">
      <div className="w-[340px] h-fit p-[30px] rounded-[15px] space-y-[30px] shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient">
        <h2 className="font-semibold">Register</h2>
        <form className="flex flex-col h-fit space-y-[30px]">
          {/* Role dropdown */}
          <select
            name="role"
            className="h-[40px]"
            defaultValue=""
            required
          >
            <option value="" disabled>Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-[40px]"
            required
          />

          {/* First & Last name side by side */}
          <div className="flex space-x-4">
            <input
              type="text"
              name="firstName"
              placeholder="Name"
              className="flex-1 h-[40px]"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="flex-1 h-[40px]"
              required
            />
          </div>

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="h-[40px]"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-[40px]"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Password again"
            className="h-[40px]"
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
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
  );
};

export default Register;