import React from 'react'
import OfferCard from './OfferCard'
import PointFinger from '../../public/images/PointFinger.png'


const offers = [
  {
    title: 'Срочные ремонты',
    text:
      'Быстрые решения критических проблем, требующих немедленного внимания для поддержания вашего образа жизни.',
  },
  {
    title: 'Стандартные ремонты',
    text:
      'Надёжный ремонт и обслуживание повседневных проблем для обеспечения оптимальной работы.',
  },
  {
    title: 'Рекламируйте свои навыки',
    text:
      'Продемонстрируйте свою экспертизу и услуги, чтобы привлечь новых клиентов и возможности.',
  },
]

export default function OffersSection() {
  return (
    <section
      className="w-full gradient shadow-[0_0_4px_rgba(0,0,0,0.2)] rounded-[15px] py-[50px] px-[50px]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ← Left column */}
        <div className="flex flex-col space-y-18">
          <h1>
            Узнайте о <span className="font-bold">наших предложениях!</span>
          </h1>
          <img
            src={PointFinger}
            alt="Pointing hand"
            className="hidden md:block transform md:rotate-90 lg:rotate-0 w-40 md:w-60 lg:w-80 self-start"
          />
        </div>

        {/* ← Right column */}
        <div className="flex flex-col gap-6">
          {offers.map((o) => (
            <OfferCard key={o.title} {...o} />
          ))}
        </div>
      </div>
    </section>

  )
}
