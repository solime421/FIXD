import axios from 'axios';

export async function fetchPrivateProfile() {
  const response = await axios.get('/api/privateProfiles/me');
  return response.data;
}

export async function updateProfilePicture(formData) {
  const response = await axios.post(
    '/api/privateProfiles/profile-picture',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.profilePicture;
}

export async function updatePersonalData(data) {
  const response = await axios.post(
    '/api/privateProfiles/personal-data',
    data
  );
  return response.data;
}

export async function updateLocationData(data) {
  const response = await axios.post(
    '/api/privateProfiles/location',
    data
  );
  return response.data;
}

export async function fetchAboutMeDetails() {
  const response = await axios.get('/api/privateFreelancerProfiles/details');
  return response.data;
}

export async function updateAboutMe(data) {
  const response = await axios.post(
    '/api/privateFreelancerProfiles/about-me',
    data
  );
  return response.data;
}
