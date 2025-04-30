import axios from 'axios';

export async function fetchOrders() {
  const response = await axios.get('/api/orders');
  return response.data;
}

export async function updateOrderStatus(orderId, status) {
  await axios.put(
    `/api/orders/${orderId}/status`,
    { status }
  );
}

export async function fetchReviews() {
  const response = await axios.get('/api/reviews');
  return response.data;
}

export async function submitReview({ orderId, revieweeId, rating, comment }) {
  await axios.post(
    '/api/reviews',
    { orderId, revieweeId, rating, comment: comment.trim() }
  );
}
