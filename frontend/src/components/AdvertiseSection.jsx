import React from 'react';
import { Link } from 'react-router-dom';


export default function AdvertiseSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:mx-[180px]">
      {/* Left panel */}
        <div className='p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient rounded-[15px] space-y-[30px]'>
          <h1>Хотите рекламировать <span className="font-bold">свои услуги?</span></h1>
          <p className="flex-grow">
            Развивайте свой бизнес легко, демонстрируя свои навыки нужным клиентам. Наша платформа соединяет вас с заказчиками, которые активно ищут ваши услуги — так вы тратите меньше времени на маркетинг и больше на любимую работу.</p>
        </div>
        <div className="flex flex-col justify-between p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] gradient rounded-[15px]">
        <ul className='space-y-[15px] mb-[40px]'>
          <li className='mr-2'>
          ✔ Найдите своих идеальных клиентов</li>
          <li>
          ✔ Выделяйтесь среди конкурентов</li>
          <li>
          ✔ Подчеркните свои уникальные предложения</li>
          <li>
          ✔ Развивайте бизнес эффективно</li>
        </ul>
        <p className='font-bold'>Создайте свой профессиональный профиль уже сегодня!</p>
        <Link to="/register">
          <button className="btn btn-primary mt-3 w-full">
           Создать аккаунт
          </button>
        </Link>      
      </div>
    </section>
  );
}
