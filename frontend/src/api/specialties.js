import axios from 'axios';

export async function fetchSpecialties() {
  const response = await axios.get('/api/privateFreelancerProfiles/specialities');
  return response.data;
}

export async function addSpecialty(speciality) {
  const response = await axios.post(
    '/api/privateFreelancerProfiles/specialities',
    { specialty: speciality }
  );
  return response.data;
}

export async function deleteSpecialty(specialityId) {
  await axios.delete(`/api/privateFreelancerProfiles/specialities/${specialityId}`);
}
