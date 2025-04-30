import axios from 'axios'

export async function fetchChats() {
  const response = await axios.get('/api/chats')
  return response.data
}

export async function markMessagesRead(chatId) {
  await axios.post(`/api/chats/${chatId}/messages/read`);
}

export async function fetchMessages(chatId) {
  const response = await axios.get(`/api/chats/${chatId}/messages`)
  return response.data
}

export async function sendMessage(chatId, message) {
  await axios.post(
    `/api/chats/${chatId}/messages`,
    { message }
  );
}

export async function fetchOfferByChat(chatId) {
  try {
    const response = await axios.get(`/api/offers/chat/${chatId}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function sendOffer(chatId, offerName) {
  await axios.post(
    `/api/offers`,
    { chatId, offer_name: offerName.slice(0, 100) }
  );
}

export async function acceptOffer(offerId) {
  const response = await axios.post(`/api/offers/${offerId}/accept`);
  return response.data;
}

export async function declineOffer(offerId) {
  await axios.post(`/api/offers/${offerId}/decline`);
}
