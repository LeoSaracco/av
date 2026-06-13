/**
 * @file Cliente HTTP para la API del backend.
 *       Reemplaza las llamadas directas a localStorage por fetch a la API real.
 *       Configurable mediante variable de entorno VITE_API_URL.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('av_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function request(method, path, body = null) {
  const options = { method, headers: getAuthHeaders() };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function apiRegister(name, email, password) {
  return request('POST', '/auth/register', { name, email, password });
}

export async function apiLogin(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  localStorage.setItem('av_token', data.accessToken);
  localStorage.setItem('av_refresh_token', data.refreshToken);
  return data.user;
}

export async function apiRefreshToken() {
  const refreshToken = localStorage.getItem('av_refresh_token');
  if (!refreshToken) throw new Error('No refresh token');
  const data = await request('POST', '/auth/refresh', { refreshToken });
  localStorage.setItem('av_token', data.accessToken);
  localStorage.setItem('av_refresh_token', data.refreshToken);
  return data.accessToken;
}

export async function apiVerifyEmail(email, code) {
  return request('POST', '/auth/verify-email', { email, code });
}

export async function apiLogout() {
  try { await request('POST', '/auth/logout'); } catch { /* ignore */ }
  localStorage.removeItem('av_token');
  localStorage.removeItem('av_refresh_token');
  localStorage.removeItem('av_user');
}

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function apiGetPlans() {
  return request('GET', '/plans');
}

// ── Onboarding ────────────────────────────────────────────────────────────────
export async function apiSubmitOnboarding(data) {
  return request('POST', '/onboarding', data);
}

// ── Payment ───────────────────────────────────────────────────────────────────
export async function apiCreatePaymentPreference(planId) {
  return request('POST', '/payment/create-preference', { planId });
}

export async function apiCheckPaymentStatus(preferenceId) {
  return request('GET', `/payment/status/${preferenceId}`);
}

// ── Client (Me) ───────────────────────────────────────────────────────────────
export async function apiGetMyRoutine() {
  return request('GET', '/me/routine');
}

export async function apiGetMyDiet() {
  return request('GET', '/me/diet');
}

export async function apiGetMyProgress() {
  return request('GET', '/me/progress');
}

export async function apiLogProgress(weight, date, comment) {
  return request('POST', '/me/progress', { weight, date, comment });
}

export async function apiDeleteProgress(id) {
  return request('DELETE', `/me/progress/${id}`);
}

export async function apiGetMyNotes() {
  return request('GET', '/me/notes');
}

export async function apiGetMyThread() {
  return request('GET', '/me/thread');
}

export async function apiSendMessage(text) {
  return request('POST', '/me/thread', { text });
}

// ── Coach ─────────────────────────────────────────────────────────────────────
export async function apiGetClients() {
  return request('GET', '/coach/clients');
}

export async function apiCreateClient(data) {
  return request('POST', '/coach/clients', data);
}

export async function apiUpdateClient(id, data) {
  return request('PUT', `/coach/clients/${id}`, data);
}

export async function apiDeleteClient(id) {
  return request('DELETE', `/coach/clients/${id}`);
}

export async function apiGetRoutines() {
  return request('GET', '/coach/routines');
}

export async function apiCreateRoutine(data) {
  return request('POST', '/coach/routines', data);
}

export async function apiGetTemplates() {
  return request('GET', '/coach/templates');
}

export async function apiAssignRoutine(clientId, routineId) {
  return request('POST', '/coach/assign', { clientId, routineId });
}

export async function apiGetCoachNotes(clientId) {
  return request('GET', `/coach/notes/${clientId}`);
}

export async function apiCreateNote(clientId, text) {
  return request('POST', '/coach/notes', { clientId, text });
}
