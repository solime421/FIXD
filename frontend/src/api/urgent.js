import axios from 'axios';

export async function fetchFreelancerSettings() {
  const response = await axios.get('/api/privateFreelancerProfiles/details');
  const { depositAmount, urgentServiceEnabled } = response.data;
  return { depositAmount, urgentServiceEnabled };
}

export async function updateDepositAmount(amount) {
  const response = await axios.post(
    '/api/privateFreelancerProfiles/deposit',
    { depositAmount: amount }
  );
  return response.data.depositAmount;
}

export async function updateUrgentServiceToggle(enabled) {
  const response = await axios.post(
    '/api/privateFreelancerProfiles/urgent-service',
    { urgentServiceEnabled: enabled }
  );
  return response.data.urgentServiceEnabled;
}
