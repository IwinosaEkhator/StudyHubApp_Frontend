import axios from 'axios';
import API_ENDPOINTS from './apiConfig';

// attach token automatically if using AuthContext
export function fetchPosts(token) {
  return axios.get(API_ENDPOINTS.posts, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createPost({ content, book_link }, token) {
  return axios.post(
    API_ENDPOINTS.posts,
    { content, book_link },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
