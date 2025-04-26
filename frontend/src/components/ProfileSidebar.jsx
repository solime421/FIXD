import React from 'react';
import PointFinger from '../../public/images/PointFinger.png';

export default function ProfileSidebar({
  specialties = [],
  depositAmount = 0,
  canMessage = false,
  urgentServiceEnabled = false,
  phone,
  onStartChat,
}) {

  // If no specialties & no actions, render nothing
  if (!canMessage && !urgentServiceEnabled && specialties.length === 0) {
    return null;
  }

  return (
    <aside className="top-[150px] space-y-6 sticky h-fit">
      <div className="gradient md:w-2/3 w-1/2 mx-auto rounded-lg p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-2 gap-4 items-start mb-6">

          {/* Left column: icon */}
          <div className="flex py-4 justify-start">
            <img
              src={PointFinger}
              alt="Pointing hand icon"
              className="h-30 w-30"
            />
          </div>

          {/* Right column: text info */}
          <div className="space-y-4">
            <div className="justify-self-end text-right">
              <h3 className="text-gray-400 text-sm capitalize mb-1 font-semibold">
               Специализируется:
              </h3>
              <ul className="list-none space-y-1">
                {specialties.length > 0 
                  ? specialties.map((spec, idx) => (
                      <li key={idx} className="capitalize">
                        {spec}
                      </li>
                    ))
                  : <li>—</li>
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='pb-3'>
          <h3 className="capitalize mb-1 flex justify-between font-semibold">
            <span className='text-gray-400'>Средняя сумма заказа:</span> ₽{depositAmount}
          </h3>
        </div>

        {/* Send Message (only for clients) */}
        {canMessage && (
          <button
            onClick={onStartChat}
            className="btn btn-primary w-full"
          >
            Отправить сообщение
          </button>
        )}
      </div>

      {/* Emergency card: same width as main card */}
      {urgentServiceEnabled && canMessage && (
        <div className="md:w-2/3 w-1/2 mx-auto rounded-lg gradient p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
          <h3 className="text-gray-400 font-semibold mb-2">Аварийная помощь доступна!</h3>
          <a
            href={`tel:${phone}`}
            className="btn btn-secondary w-full text-center"
          >
            Позвонить
          </a>
        </div>
      )}
    </aside>
  );
}