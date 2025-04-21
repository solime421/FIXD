import React, { useState } from 'react';

import QuestionMarkImage from '../../public/images/Question.png'
import CoinsImage       from '../../public/images/Coins.png'
import ExclaimImage     from '../../public/images/Exlamation.png'
import OkHandImage      from '../../public/images/OK-sign.png'
import CardImage        from '../../public/images/Card.png'
import GearsImage       from '../../public/images/Gears.png'

const faqs = [
  {
    icon: QuestionMarkImage,
    question: "How to use our app?",
    answer:
      "Once you’re logged in, just type what you need fixed into the search bar, select a freelancer, and hit to chat with him. After which you will be able to make a deal with a freelancer and the place an order, inside the chat.",
  },
  {
    icon: CoinsImage,
    question: "How much do services cost?",
    answer:
      "Prices depend on how you negotiate with the freelancer. You can see the average amount of the service in the app, but you can always negotiate a better price. The final price is agreed upon between you and the freelancer, and paid directly to him.",
  },
  {
    icon: ExclaimImage,
    question: "What is urgent fix?",
    answer:
      "Urgent Fix is an add‑on that let's you call a freelancer to fix your problem immediately. The freelancers are able to turn the service 'on' or 'off'. If the service is 'on', you can call a freelancer to fix your problem immediately. If the service is 'off', you can only chat with the freelancer and make a deal with him.",
  },
  {
    icon: OkHandImage,
    question: "How to place an order?",
    answer:
      "At the moment we don't support any payment methods, so you will have to pay the freelancer directly. After you accept a freelancer’s offer, you will be directed the orders page directly.",
  },
  {
    icon: CardImage,
    question: "What payment options are available?",
    answer:
      "At the moment we don't support any payment methods.",
  },
  {
    icon: GearsImage,
    question: "What if my problem is not fixed?",
    answer:
      "If you’re not satisfied, send a message to our support team, and we will help you out. You can also leave a review for the freelancer.",
  },
]

export default function FAQ() {
  const [active, setActive] = useState(null)

  return (
    <section className="w-full py-16 space-y-[40px]">
      <h1 className='font-bold'>Frequently asked questions?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((faq, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex items-center space-x-8 p-5 bg-white rounded-[10px] box-shadow transition cursor-pointer"
          >
            <img src={faq.icon} alt="" className="w-17 h-17" />
            <span>{faq.question}</span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >&times;</button>
            
            <h3 className="font-bold mb-4">
              {faqs[active].question}
            </h3>
            <p className="mb-6">{faqs[active].answer}</p>
            
            <button
              onClick={() => setActive(null)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
