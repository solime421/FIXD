import { Link } from 'react-router-dom';
import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('../../images/FIXDBackround.png')] bg-no-repeat bg-center bg-[length:100%_auto] ">

      <div className="w-[340px] h-fit p-[30px] rounded-[15px] space-y-[30px] shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient">
        <h2 className="font-semibold">Sign In</h2>
        <form className="flex flex-col h-fit space-y-[40px]">
          <input 
            type="email"
            placeholder="Email"
            className="h-[40px]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="h-[40px]"
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Sign In
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-black">
        Already have an account?{' '}
        <Link to="/register" className="font-bold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;