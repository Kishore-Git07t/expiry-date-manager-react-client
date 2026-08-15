const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export async function registerApi(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed');
  }
  return data;
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 */
export async function loginApi(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Login failed');
  }
  return data;
}

/**
 * Logout user – clears httpOnly cookie on server
 */
export async function logoutApi() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Logout failed');
  }
  return data;
}

// ── Product API helpers ──────────────────────────────────────────────────────

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch all products for the current user
 */
export async function getProductsApi(token) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: authHeaders(token),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
  return data; // { products: [...] }
}

/**
 * Add a new product
 * @param {string} token
 * @param {Object} productData - { name, brand, category, expiryDate, quantity, notes }
 */
export async function addProductApi(token, productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: authHeaders(token),
    credentials: 'include',
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Failed to add product');
  }
  return data; // { product: {...} }
}

/**
 * Delete a product by ID
 */
export async function removeProductApi(token, productId) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to remove product');
  return data;
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
