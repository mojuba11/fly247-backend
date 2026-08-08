const axios = require('axios');

// Create an Axios instance for SkyLink API
const skylinkApi = axios.create({
  baseURL: process.env.SKYLINK_BASE_URL || 'https://api.247travels.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let cachedToken = null;
let tokenExpiry = null;

// Function to handle authentication and token caching (15-min cycle)
async function getAuthToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(`${process.env.SKYLINK_BASE_URL || 'https://api.247travels.com/v1'}/auth/login`, {
      email: process.env.SKYLINK_EMAIL,
      password: process.env.SKYLINK_PASSWORD,
    });

    cachedToken = response.data.token || response.data.data?.token;
    // Cache token for 14 minutes
    tokenExpiry = Date.now() + 14 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error('SkyLink Authentication Error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with SkyLink API');
  }
}

// Automatically inject the bearer token into every request
skylinkApi.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = skylinkApi;
