const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Universal safe request wrapper with user-friendly network error handling
 */
async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please try again later.');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Request failed');
  }

  return data;
}

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export async function registerApi(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 */
export async function loginApi(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Logout user – clears httpOnly cookie on server
 */
export async function logoutApi() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

// ── Product API helpers ──────────────────────────────────────────────────────

/**
 * Fetch all products for the current user
 */
export async function getProductsApi(token) {
  return request('/products', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

/**
 * Search and filter products
 */
export async function searchProductsApi(token, params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.upcCode) query.append('upcCode', params.upcCode);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.expiryWithin) query.append('expiryWithin', params.expiryWithin);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString();
  const endpoint = queryString ? `/products/search?${queryString}` : '/products/search';

  return request(endpoint, {
    method: 'GET',
    headers: authHeaders(token),
  });
}

/**
 * Add a new product
 * @param {string} token
 * @param {Object} productData - { name, upcCode, brand, category, expiryDate, quantity, notes }
 */
export async function addProductApi(token, productData) {
  return request('/products', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(productData),
  });
}

/**
 * Update an existing product
 */
export async function updateProductApi(token, productId, productData) {
  return request(`/products/${productId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(productData),
  });
}

/**
 * Delete a product by ID
 */
export async function removeProductApi(token, productId) {
  return request(`/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────

export function getStoredAuth() {
  try {
    const user = localStorage.getItem('expiry_guard_user');
    const token = localStorage.getItem('expiry_guard_token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (e) {
    return { user: null, token: null };
  }
}

export function setStoredAuth(user, token) {
  localStorage.setItem('expiry_guard_user', JSON.stringify(user));
  localStorage.setItem('expiry_guard_token', token);
}

export function clearStoredAuth() {
  localStorage.removeItem('expiry_guard_user');
  localStorage.removeItem('expiry_guard_token');
}
