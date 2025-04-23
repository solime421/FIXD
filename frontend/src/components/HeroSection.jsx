import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBlock from '../components/SearchBlock.jsx';
import HeroImage from '../../public/images/Handyman.png'

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  };

  return (
          <section
            className="container flex flex-row items-center-safe xl:h-[650px] md:h-[550px] h-[550px]"
          >
            {/* Left column: content */}
            <div className="w-fill lg:w-3/5 pl-4 pr-7">
                <h1>
                  With what can we <span className="font-bold">help you today?</span>
                </h1>
                <div className="mt-[40px]">
                  <SearchBlock 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onSearch={handleSearch}
                  className="flex-1" />
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
