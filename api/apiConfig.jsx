//Define the base URL for Laravel API
const API_BASE_URL = "http://192.168.135.136:8000";

//Define API endpoints using the base URL
const API_ENDPOINTS = {
  //Authentication Endpoints
  signup: `${API_BASE_URL}/api/signup`,
  signin: `${API_BASE_URL}/api/signin`,
  signout: `${API_BASE_URL}/api/signout`,

  // Users
  users: `${API_BASE_URL}/api/users`,

  //Profile Endpoint
  profile: `${API_BASE_URL}/api/profile`,
  profileUpdate: `${API_BASE_URL}/api/profile`,
  // Base URL for profile photos stored in /storage:
  profile_photo_base_url: API_BASE_URL,

  // Books Endpoint
  books: `${API_BASE_URL}/api/books`,

  // Brocating
  broadcasting: `${API_BASE_URL}/api/broadcasting/auth`,

  // Chat Endpoint
  conversations: `${API_BASE_URL}/api/conversations`,
  messages: (id) => `${API_BASE_URL}/api/conversations/${id}/messages`,

  // Post
  posts: `${API_BASE_URL}/api/posts`,
  likePost: id => `${API_BASE_URL}/api/posts/${id}/like`,



};

export default API_ENDPOINTS;