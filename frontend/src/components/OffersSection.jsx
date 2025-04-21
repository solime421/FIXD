import React from 'react'
import OfferCard from './OfferCard'
import PointFinger from '../../public/images/PointFinger.png'


const offers = [
  {
    title: 'Urgent fixes',
    text:
      'Quick solutions for critical issues that need immediate attention to keep your life running smoothly.',
    // icon, etc...
  },
  {
    title: 'Standard fixes',
    text:
      'Reliable repairs and maintenance for everyday problems to ensure optimal performance.',
  },
  {
    title: 'Advertise your skills',
    text:
      'Showcase your expertise and services to attract new clients and opportunities.',
  },
]

export default function OffersSection() {
  return (
    <section
      className="w-full gradient shadow-[0_0_4px_rgba(0,0,0,0.2)] rounded-[15px] py-[50px] px-[50px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ← Left column */}
        <div className="flex flex-col space-y-18">
          <h1>
            Get to know <span className="font-bold">our offers!</span>
          </h1>
          <img
            src={PointFinger}
            alt="Pointing hand"
            className="w-40 md:w-60 lg:w-80 self-start hidden md:block"
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
