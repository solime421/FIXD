import React from 'react';
import HeroImage from '../../public/images/Handyman.png'
import BlockInput from '../components/BlockInput.jsx';


export default function Home() {
  return (
    <main>
      <section
        className="container mx-auto flex flex-col md:flex-row items-center h-[650px] overflow-hidden"
      >
        {/* Left column: content */}
        <div className="w-full lg:w-1/2 pl-4 pr-7">
            <h1 className="mb-6 text-3xl lg:text-4xl">
              With what can we <span className="font-bold">help you today?</span>
            </h1>
            <div className="flex space-x-4 mt-[40px]">
              <BlockInput className="flex-1" />
              <button className="btn btn-primary w-[200px]">
                Search
              </button>
            </div>
          </div>

        {/* Right column: illustration */}
        <div
          className="
            hidden lg:block
            absolute inset-y-[80px] right-0
            w-3/7
            bg-no-repeat bg-contain bg-top
          "
          style={{ backgroundImage: `url(${HeroImage})` }}
        />
      </section>

      {/* ... other sections ... */}
    </main>
  );
}
