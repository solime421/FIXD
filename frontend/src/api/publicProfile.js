import axios from 'axios'

//Fetch a public profile by its user ID.
export async function fetchPublicProfile(id) {
  const response = await axios.get(`/api/publicProfile/${id}`)
  return response.data
}


//Start (or retrieve) a chat with a freelancer.
export async function startChat(freelancerId) {
  const response = await axios.post('/api/chats', { freelancer_id: Number(freelancerId) } //URL parameters always come in as strings
)
  return response.data
} 