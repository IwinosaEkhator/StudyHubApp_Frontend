//Define the base URL for Laravel API
const API_BASE_URL = "http://192.168.115.136:8000";

//Define API endpoints using the base URL
const API_ENDPOINTS = {
  //Authentication Endpoints
  signup: `${API_BASE_URL}/api/signup`,
  signin: `${API_BASE_URL}/api/sigin`,
  signout: `${API_BASE_URL}/api/sigout`,


  //Profile Endpoint
  profile: `${API_BASE_URL}/api/profile`,
  profileUpdate: `${API_BASE_URL}/api/profile`,
  // Base URL for profile photos stored in /storage:
  profile_photo_base_url: API_BASE_URL,  
};

export default API_ENDPOINTS;