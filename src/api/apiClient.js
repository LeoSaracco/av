/**
 * @file Cliente HTTP para la API del backend.
 *       Reemplaza las llamadas directas a localStorage por fetch a la API real.
 *       Configurable mediante variable de entorno VITE_API_URL.
 *       Cubre 47 endpoints del backend.
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

// ── Coach: Clients ────────────────────────────────────────────────────────────
export async function apiGetClients() {
  return request('GET', '/coach/clients');
}

export async function apiGetClient(id) {
  return request('GET', `/coach/clients/${id}`);
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

export async function apiGetClientProgress(clientId) {
  return request('GET', `/coach/clients/${clientId}/progress`);
}

// ── Coach: Templates ──────────────────────────────────────────────────────────
export async function apiGetTemplates() {
  return request('GET', '/coach/templates');
}

export async function apiCreateTemplate(data) {
  return request('POST', '/coach/templates', data);
}

export async function apiUpdateTemplate(id, data) {
  return request('PUT', `/coach/templates/${id}`, data);
}

export async function apiDeleteTemplate(id) {
  return request('DELETE', `/coach/templates/${id}`);
}

// ── Coach: Routines ───────────────────────────────────────────────────────────
export async function apiGetRoutines() {
  return request('GET', '/coach/routines');
}

export async function apiCreateRoutine(data) {
  return request('POST', '/coach/routines', data);
}

export async function apiUpdateRoutine(id, data) {
  return request('PUT', `/coach/routines/${id}`, data);
}

export async function apiDeleteRoutine(id) {
  return request('DELETE', `/coach/routines/${id}`);
}

export async function apiCreateRoutineFromTemplate(templateId, name, goal) {
  return request('POST', '/coach/routines/from-template', { templateId, name, goal });
}

// ── Coach: Assignments ────────────────────────────────────────────────────────
export async function apiAssignRoutine(clientId, routineId, dietId) {
  return request('POST', '/coach/assign', { clientId, routineId, dietId });
}

export async function apiGetAssignments() {
  return request('GET', '/coach/assignments');
}

// ── Coach: Notes ──────────────────────────────────────────────────────────────
export async function apiGetCoachNotes(clientId) {
  return request('GET', `/coach/notes/${clientId}`);
}

export async function apiGetAllNotes() {
  return request('GET', '/coach/notes');
}

export async function apiCreateNote(clientId, text) {
  return request('POST', '/coach/notes', { clientId, text });
}

export async function apiUpdateNote(id, text) {
  return request('PUT', `/coach/notes/${id}`, { text });
}

export async function apiDeleteNote(id) {
  return request('DELETE', `/coach/notes/${id}`);
}

// ── Coach: Diet Templates ─────────────────────────────────────────────────────
export async function apiGetDietTemplates() {
  return request('GET', '/coach/diet-templates');
}

export async function apiCreateDietTemplate(data) {
  return request('POST', '/coach/diet-templates', data);
}

export async function apiUpdateDietTemplate(id, data) {
  return request('PUT', `/coach/diet-templates/${id}`, data);
}

export async function apiDeleteDietTemplate(id) {
  return request('DELETE', `/coach/diet-templates/${id}`);
}

// ── Coach: Diets ──────────────────────────────────────────────────────────────
export async function apiGetDiets() {
  return request('GET', '/coach/diets');
}

export async function apiCreateDiet(data) {
  return request('POST', '/coach/diets', data);
}

export async function apiUpdateDiet(id, data) {
  return request('PUT', `/coach/diets/${id}`, data);
}

export async function apiDeleteDiet(id) {
  return request('DELETE', `/coach/diets/${id}`);
}

export async function apiCreateDietFromTemplate(templateId, name, goal) {
  return request('POST', '/coach/diets/from-template', { templateId, name, goal });
}

// ── Coach: Nutrition Thread ───────────────────────────────────────────────────
export async function apiGetClientThread(clientId) {
  return request('GET', `/coach/clients/${clientId}/thread`);
}

export async function apiSendCoachMessage(clientId, text) {
  return request('POST', `/coach/clients/${clientId}/thread`, { text });
}

// ── Store ─────────────────────────────────────────────────────────────────────
export async function apiGetProducts() {
  return request('GET', '/store/products');
}

export async function apiGetProduct(id) {
  return request('GET', `/store/products/${id}`);
}

export async function apiCheckout(items) {
  return request('POST', '/store/checkout', { items });
}
