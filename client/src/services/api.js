import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized API client for the NextHireAI backend.
 * Automatically injects the Firebase auth token and handles
 * JSON parsing and error responses.
 * Usage:
 *   const resumes = await api.get('/resumes');
 *   const created = await api.post('/resumes', payload);
 */
async function request(path, options = {}) {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Only set Content-Type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Return the response directly for callers that need to check res.ok
  return res;
}

/** Convenience wrappers */

async function get(path) {
  return request(path);
}

async function post(path, body) {
  const isFormData = body instanceof FormData;
  return request(path, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  });
}

async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function del(path) {
  return request(path, { method: 'DELETE' });
}

async function patch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

const api = { get, post, put, delete: del, patch, request };
export default api;
