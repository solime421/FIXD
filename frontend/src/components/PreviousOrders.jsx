import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../context/AuthContext.jsx';

export default function PreviousOrders({ orders, onLeaveReview }) {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [count, setCount] = useState(6);

  const visible = orders.slice(0, count);

  return (
    <section>
      <h2 className="font-semibold mb-4">Предыдущие заказы</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 py-3">Нет предыдущих заказов.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map(o => {
              const other = user.role === 'client' ? o.freelancer : o.client;
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-lg p-5 shadow-[0_0_4px_rgba(0,0,0,0.2)] space-y-3"
                >
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm">Дата</p>
                    <p className="font-medium">
                      {new Date(o.createdAt).toLocaleString('ru', {
                        day:   'numeric',
                        month: 'long',
                        year:  'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm">Оффер</p>
                    <p>{o.offerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm">
                      {user.role === 'client' ? 'Специалист:' : 'Клиент:'}
                    </p>
                    <p>{other.firstName} {other.lastName}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => navigate(`/chats/${o.id}`)}
                      className="btn btn-secondary w-full"
                    >
                      Отправить сообщение
                    </button>
                    {user.role === 'client' && (
                      <button
                        onClick={() => onLeaveReview(o)}
                        className="btn btn-primary w-full"
                      >
                        Оставить отзыв
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {orders.length > count && (
            <div className="flex justify-center text-[#865A57] hover:underline mt-6">
              <a
                onClick={() => setCount(c => c + 6)}
              >
                Загрузить ещё
              </a>
            </div>
          )}
        </>
      )}
    </section>
  );
}
