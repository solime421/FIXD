import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../public/logos/LogoWhiteLetters.svg'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start pt-[60px] pb-[30px]">
        {/* Col 1: Logo */}
        <div>
          <img src={Logo} alt="FIXD logo" className="h-15" />
        </div>

        {/* Col 2: For clients */}
        <div className='mt-[100px] mb-[30px]'>
          <ul className="space-y-4">
            <li className="font-bold">For clients</li>
            <li><Link to="/help">How to use?</Link></li>
            <li><Link to="/billing">Billing info</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/urgent-fix">Urgent Fix</Link></li>
          </ul>
        </div>

        {/* Col 3: For freelancers */}
        <div className='mt-[100px] mb-[30px]'>
          <ul className="space-y-4">
            <li className="font-bold">For freelancers</li>
            <li><Link to="/urgent-fix">Urgent Fix</Link></li>
            <li><Link to="/build-profile">Build Your Profile</Link></li>
          </ul>
        </div>

        {/* Col 4: Our company */}
        <div className='mt-[100px] mb-[30px]'>
          <ul className="space-y-4">
            <li className="font-bold">Our company</li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/support">Help &amp; support</Link></li>
          </ul>
        </div>

        {/* Col 5: Support button */}
        <div className="mt-[100px] mb-[30px]">
          <a
            href="https://wa.me/79637268181"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full text-center block"
          >
            Need support?
          </a>
        </div>
      </div>
    </footer>
  )
}
