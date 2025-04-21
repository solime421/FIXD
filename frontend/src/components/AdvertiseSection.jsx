import React from 'react';
import { Link } from 'react-router-dom';


export default function AdvertiseSection() {
  return (
    <section className="flex justify-center gap-8 px-[200px]">
      {/* Left panel */}
      <div className="flex-1 flex flex-col p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient rounded-[15px] space-y-[30px]">
        <h1>Want to advertise <span className="font-extrabold">your services?</span></h1>
        <p className="flex-grow">
          Grow your business effortlessly by putting your skills in front of the right clients. Our platform connects you with customers actively searching for your expertise – so you spend less time marketing and more time doing what you do best.        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient rounded-[15px]">
        <ul className='space-y-[15px] mb-[40px]'>
          <li className='mr-2'>
          ✔ Get Discovered by Your Ideal Clients</li>
          <li>
          ✔ Stand Out from Competitors</li>
          <li>
          ✔ Highlight your unique offerings</li>
          <li>
          ✔ Grow Your Business Efficiently</li>
        </ul>
        <p className='font-bold'>Create Your Professional Profile Today!</p>
        <Link to="/register">
          <button className="btn btn-primary mt-3 w-full">
            Create an account
          </button>
        </Link>      
      </div>
    </section>
  );
}
