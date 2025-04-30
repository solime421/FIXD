import axios from 'axios'

export async function fetchSearchResults ({search, minDeposit, maxDeposit, urgentOnly}) {
  const params = {};
  if (search) params.search = search;
  if (minDeposit !== undefined && minDeposit !== '') params.minDeposit = minDeposit;
  if (maxDeposit !== undefined && maxDeposit !== '') params.maxDeposit = maxDeposit;
  if (urgentOnly) params.urgentOnly = true;

  const response = await axios.get('/api/search', { params });

  return response.data
}

// plain JavaScript object that holds all the pieces I want to tack onto my URL as query parameters