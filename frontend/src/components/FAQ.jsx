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
    question: "Как пользоваться нашим приложением?",
    answer:
      "После входа в систему просто введите, что нужно починить, в строку поиска, выберите фрилансера и начните с ним чат. После этого вы сможете договориться с фрилансером и оформить заказ прямо в чате.",
  },
  {
    icon: CoinsImage,
    question: "Сколько стоят услуги?",
    answer:
      "Цены зависят от ваших переговоров с фрилансером. В приложении вы можете увидеть среднюю стоимость услуги, но всегда можно договориться о более выгодной цене. Окончательная сумма согласовывается между вами и фрилансером и оплачивается напрямую ему.",
  },
  {
    icon: ExclaimImage,
    question: "Что такое срочный ремонт?",
    answer:
      "Срочный ремонт — это дополнительная функция, которая позволяет вызвать фрилансера для немедленного решения вашей проблемы. Фрилансеры могут включать или отключать эту функцию. Если функция включена, вы можете вызвать фрилансера сразу. Если отключена — только начать чат и договориться.",
  },
  {
    icon: OkHandImage,
    question: "Как оформить заказ?",
    answer:
      "На данный момент мы не поддерживаем оплату через приложение, поэтому вам нужно будет оплатить услуги напрямую фрилансеру. После принятия предложения фрилансера вы будете перенаправлены на страницу заказов.",
  },
  {
    icon: CardImage,
    question: "Какие способы оплаты доступны?",
    answer:
      "На данный момент мы не поддерживаем способы оплаты через приложение.",
  },
  {
    icon: GearsImage,
    question: "Что делать, если проблему не удалось решить?",
    answer:
      "Если вы остались недовольны, напишите в нашу службу поддержки, и мы поможем вам. Также вы можете оставить отзыв о фрилансере.",
  },
]

export default function FAQ() {
  const [active, setActive] = useState(null)

  return (
    <section className="w-full py-16 space-y-[40px]">
      <h1 className='font-bold'>Часто задаваемые вопросы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Закрыть
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
