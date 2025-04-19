import axios from 'axios';

const api = axios.create({
  baseURL: '/api/auth',
});

// Login returns { token, user }
export async function login({ email, password }) {
  const { data } = await api.post('/login', { email, password });
  return data;
}

// Register returns { token, user }
export async function register({ role, firstName, lastName, phone, email, password }) {
  const { data } = await api.post('/register', {
    role,
    firstName,
    lastName,
    phone,
    email,
    password,
  });
  return data;
}
