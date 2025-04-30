import axios from 'axios';

export async function fetchPortfolio() {
  const response = await axios.get('/api/privateFreelancerProfiles/portfolio');
  return response.data;
}

export async function uploadPortfolioImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(
    '/api/privateFreelancerProfiles/portfolio',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export async function deletePortfolioImage(imageId) {
  await axios.delete(`/api/privateFreelancerProfiles/portfolio/${imageId}`);
}
