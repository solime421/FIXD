import React from 'react'

export default function OfferCard({ title, text }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] w-full flex flex-col items-start">
      <h3 className="text-[#865A57] font-bold mb-2">{title}</h3>
      <p>{text}</p>
    </div>
  )
}