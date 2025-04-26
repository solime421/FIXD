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
            <li className="font-bold">Для клиентов</li>
            <li><Link to="/help">Как пользоваться?</Link></li>
            <li><Link to="/pricing">Цены</Link></li>
            <li><Link to="/urgent-fix">Срочный ремонт</Link></li>
          </ul>
        </div>

        {/* Col 3: For freelancers */}
        <div className='mt-[100px] mb-[30px]'>
          <ul className="space-y-4">
            <li className="font-bold">Для фрилансеров</li>
            <li><Link to="/urgent-fix">Срочный ремонт</Link></li>
            <li><Link to="/build-profile">Создать профиль</Link></li>
          </ul>
        </div>

        {/* Col 4: Our company */}
        <div className='mt-[100px] mb-[30px]'>
          <ul className="space-y-4">
            <li className="font-bold">Наша компания</li>
            <li><Link to="/about">О нас</Link></li>
            <li><Link to="/support">Помощь и поддержка</Link></li>
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
            Нужна поддержка?
          </a>
        </div>
      </div>
    </footer>
  )
}
