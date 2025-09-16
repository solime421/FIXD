import React, { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext.jsx';
import PreviousOrders          from '../components/PreviousOrders.jsx';
import ReviewsSection          from '../components/ReviewsSection.jsx';
import OrderCard               from '../components/OrderCard.jsx';

import {
  fetchOrders,
  updateOrderStatus,
  fetchReviews,
  submitReview
} from '../api/orders';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Orders state
  const [orders, setOrders]             = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError]               = useState('');

  // Reviews state (for freelancers)
  const [reviews, setReviews]           = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review‐modal state
  const [showReviewModal, setShowReviewModal]   = useState(false);
  const [orderToReview, setOrderToReview]       = useState(null);
  const [reviewForm, setReviewForm]             = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    // 1) Fetch orders
    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    }

    // 2) Fetch reviews if freelancer
    async function loadReviews() {
      if (user.role !== 'freelancer') return;
      setLoadingReviews(true);
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    }

    loadOrders();
    loadReviews();
  }, [user.role]);

  if (loadingOrders) return <p className="p-8">Загрузка заказов…</p>;
  if (error)         return <p className="p-8 text-red-500">{error}</p>;

  const inProgress = orders.filter(o => !o.status);
  const previous   = orders.filter(o => o.status);

  const markDone = async orderId => {
    try {
      await updateOrderStatus(orderId, true);
      setOrders(os => os.map(o => (
        o.id === orderId ? { ...o, status: true } : o
      )));
    } catch (err) {
      console.error(err);
      alert('Could not mark order done.');
    }
  };

  const handleOpenReview = order => {
    setOrderToReview(order);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!orderToReview) return;
    setSubmittingReview(true);
    try {
      await submitReview({
        orderId: orderToReview.id,
        revieweeId: orderToReview.freelancerId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setShowReviewModal(false);
      setOrderToReview(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <main className="py-[150px] bg-[var(--color-bg-alt)]">
      <div className="mx-[120px] space-y-8">

      <section>
        <h2 className="font-semibold mb-4">Мои заказы</h2>
        {inProgress.length === 0 ? (
          <div className="py-3 text-gray-500 italic">
            Заказов в процессе выполнения нет
          </div>
        ) : (
          (() => {
            // split into two columns
            const colA = inProgress.filter((_, i) => i % 2 === 0);
            const colB = inProgress.filter((_, i) => i % 2 === 1);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                {/* column 1: the big OK icon */}
                <div>
                  <img
                    src="public/images/Ok-sign.png"
                    alt="OK"
                    className="h-70 w-70 my-10"
                  />
                </div>
        
                {/* column 2: even‐indexed orders */}
                <div className="space-y-4">
                  {colA.map(o => (
                    <OrderCard
                      key={o.id}
                      o={o}
                      user={user}
                      markDone={markDone}
                    />
                  ))}
                </div>
        
                {/* column 3: odd‐indexed orders */}
                <div className="space-y-4">
                  {colB.map(o => (
                    <OrderCard
                      key={o.id}
                      o={o}
                      user={user}
                      markDone={markDone}
                    />
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </section>


        {/* Previous Orders */}
        <PreviousOrders
          orders={previous}
          onLeaveReview={handleOpenReview}
        />

        {/* Reviews (for freelancers) */}
        {user.role === 'freelancer' && !loadingReviews && (
          <>
            <h2 className="font-semibold mb-4">Отзывы</h2>
            <ReviewsSection reviews={reviews} />
          </>
        )}
      </div>

      {/* ← Leave Review Modal */}
      {showReviewModal && orderToReview && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Оставить отзыв</h3>
            <div className="space-y-2">
              <label className="block text-gray-600">Оценка</label>
              <select
                value={reviewForm.rating}
                onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                className="w-full border rounded px-3 py-2"
              >
                {[5,4,3,2,1].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-600">Комментарий</label>
              <textarea
                rows={4}
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Напишите отзыв…"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="btn btn-secondary w-full"
                disabled={submittingReview}
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitReview}
                className="btn btn-primary w-full"
                disabled={submittingReview || !reviewForm.comment.trim()}
              >
                {submittingReview ? 'Отправка…' : 'Оставить отзыв'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
