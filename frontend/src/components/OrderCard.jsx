import React from 'react';

export default function OrderCard({ o, user, markDone }) {
  const other = user.role === 'client' ? o.freelancer : o.client;

  return (
    <div
      className="bg-white rounded-lg p-6 shadow-[0_0_4px_rgba(0,0,0,0.2)] space-y-3"
    >
      <p className="font-bold">Отлично!</p>
      <p>
        {user.role === 'client'
          ? `${other.firstName} ${other.lastName} скоро будет с вами!`
          : `${other.firstName} ${other.lastName} ждёт вас!`}
      </p>
      <p className="text-gray-600">
        <span className="font-bold">Название заказа:</span> {o.offerName}
      </p>
      <div className="flex space-x-4">
        {user.role === 'freelancer' && (
          <button
            onClick={() => markDone(o.id)}
            className="btn btn-primary w-full"
          >
            Заказ выполнен!
          </button>
        )}
        <a
          href="https://wa.me/79637268181"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary w-full"
        >
          Нужна поддержка?
        </a>
      </div>
    </div>
  );
}
