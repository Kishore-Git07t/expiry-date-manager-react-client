const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export async function registerApi(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Login failed');
  }

  return data;
}

/**
 * Session storage helpers
 */
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
