import React from 'react'
import BlockInput from './BlockInput'
import HeroImage from '../../public/images/Handyman.png'

export default function HeroSection() {
  return (
          <section
            className="container flex flex-row items-center-safe xl:h-[650px] md:h-[550px] h-[550px]"
          >
            {/* Left column: content */}
            <div className="w-fill lg:w-3/5 pl-4 pr-7">
                <h1>
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
                absolute inset-y-[75px] right-0
                w-3/7
                bg-no-repeat bg-contain bg-top
              "
              style={{ backgroundImage: `url(${HeroImage})` }}
            />
          </section>
  )
}
