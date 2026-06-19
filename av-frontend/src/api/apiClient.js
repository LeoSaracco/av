/**
 * @file Cliente HTTP para la API del backend.
 *       Usa cookies httpOnly + Authorization Bearer como fallback.
 *       Configurable mediante variable de entorno VITE_API_URL.
 *       Cubre 47 endpoints del backend.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

let bearerToken = null;

/**
 * Stores the access token in memory for Bearer header fallback.
 * Called by AuthContext after login/register/completePlanContract.
 * Set to null on logout.
 */
export function setBearerToken(token) {
  bearerToken = token || null;
}

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  return headers;
}

async function request(method, path, body = null) {
  const options = { method, headers: getAuthHeaders(), credentials: 'include' };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

function parseJsonField(value, fallback) {
  if (value == null) return fallback;
  if (Array.isArray(value) || typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizePlan(plan) {
  return { ...plan, features: parseJsonField(plan.features, []) };
}

function normalizeProduct(product) {
  return {
    ...product,
    sizes: parseJsonField(product.sizes, []),
    colors: parseJsonField(product.colors, []),
    flavors: parseJsonField(product.flavors, []),
  };
}

function normalizeRoutine(routine) {
  return { ...routine, exercises: parseJsonField(routine.exercises, []) };
}

function normalizeTemplate(template) {
  return { ...template, exercises: parseJsonField(template.exercises, []) };
}

function normalizeDiet(diet) {
  return { ...diet, meals: parseJsonField(diet.meals, []) };
}

function normalizeThread(thread) {
  if (!thread) return thread;
  return { ...thread, messages: parseJsonField(thread.messages, []) };
}

function stringifyJsonArray(data, field) {
  if (data && data[field] !== undefined && Array.isArray(data[field])) {
    return { ...data, [field]: JSON.stringify(data[field]) };
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function apiRegister(name, email, password) {
  return request('POST', '/auth/register', { name, email, password });
}

export async function apiLogin(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  return data.user || data;
}

export async function apiRefreshToken() {
  return request('POST', '/auth/refresh');
}

export async function apiVerifyEmail(email, code) {
  return request('POST', '/auth/verify-email', { email, code });
}

export async function apiLogout() {
  try { await request('POST', '/auth/logout'); } catch { /* ignore */ }
}

export async function apiSendVerificationCode(email) {
  return request('POST', '/auth/send-verification', { email });
}

export async function apiForgotPassword(email) {
  return request('POST', '/auth/forgot-password', { email });
}

export async function apiResetPassword(email, code, newPassword) {
  return request('POST', '/auth/reset-password', { email, code, newPassword });
}

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function apiGetPlans() {
  const plans = await request('GET', '/plans');
  return plans.map(normalizePlan);
}

// ── Onboarding ────────────────────────────────────────────────────────────────
export async function apiSubmitOnboarding(data) {
  return request('POST', '/onboarding', {
    planId: data.planId,
    clientId: data.clientId,
    name: data.name,
    email: data.email,
    phone: data.whatsapp,
    goal: data.purpose,
    formData: JSON.stringify(data),
  });
}

// ── Payment ───────────────────────────────────────────────────────────────────
export async function apiCreatePaymentPreference(planId) {
  return request('POST', '/payment/create-preference', { planId });
}

export async function apiCheckPaymentStatus(preferenceId) {
  return request('GET', `/payment/status/${preferenceId}`);
}

export async function apiStartPlanContract(planId) {
  return request('POST', '/plan-contracts/start', { planId });
}

export async function apiMockPlanPayment(contractId, preferenceId, status) {
  return request('POST', `/plan-contracts/${contractId}/mock-payment`, { preferenceId, status });
}

export async function apiCompletePlanContract(contractId, data) {
  const formData = { ...data };
  delete formData.password;
  return request('POST', `/plan-contracts/${contractId}/complete-onboarding`, {
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.whatsapp,
    goal: data.purpose,
    formData: JSON.stringify(formData),
  });
}

// ── Client (Me) ───────────────────────────────────────────────────────────────
export async function apiGetMyRoutine() {
  return normalizeRoutine(await request('GET', '/me/routine'));
}

export async function apiGetMyDiet() {
  return normalizeDiet(await request('GET', '/me/diet'));
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

export async function apiUpdateProgress(id, weight, date, comment) {
  return request('PUT', `/me/progress/${id}`, { weight, date, comment });
}

export async function apiGetMyNotes() {
  return request('GET', '/me/notes');
}

export async function apiGetMyThread() {
  return normalizeThread(await request('GET', '/me/thread'));
}

export async function apiSendMessage(text) {
  return normalizeThread(await request('POST', '/me/thread/message', { message: text }));
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
  const templates = await request('GET', '/coach/templates');
  return templates.map(normalizeTemplate);
}

export async function apiCreateTemplate(data) {
  return normalizeTemplate(await request('POST', '/coach/templates', stringifyJsonArray(data, 'exercises')));
}

export async function apiUpdateTemplate(id, data) {
  return normalizeTemplate(await request('PUT', `/coach/templates/${id}`, stringifyJsonArray(data, 'exercises')));
}

export async function apiDeleteTemplate(id) {
  return request('DELETE', `/coach/templates/${id}`);
}

// ── Coach: Routines ───────────────────────────────────────────────────────────
export async function apiGetRoutines() {
  const routines = await request('GET', '/coach/routines');
  return routines.map(normalizeRoutine);
}

export async function apiCreateRoutine(data) {
  return normalizeRoutine(await request('POST', '/coach/routines', stringifyJsonArray(data, 'exercises')));
}

export async function apiUpdateRoutine(id, data) {
  return normalizeRoutine(await request('PUT', `/coach/routines/${id}`, stringifyJsonArray(data, 'exercises')));
}

export async function apiDeleteRoutine(id) {
  return request('DELETE', `/coach/routines/${id}`);
}

export async function apiCreateRoutineFromTemplate(templateId, name, goal) {
  return normalizeRoutine(await request('POST', '/coach/routines/from-template', { templateId, name, goal }));
}

// ── Coach: Assignments ────────────────────────────────────────────────────────
export async function apiAssignRoutine(clientId, routineId, dietId, reason, observations) {
  return request('POST', '/coach/assignments',
    { clientId, routineId, dietId, reason, observations });
}

export async function apiGetAssignments() {
  const clients = await apiGetClients();
  const groups = await Promise.all(clients.map(client =>
    request('GET', `/coach/clients/${client.id}/assignments`).catch(() => [])
  ));
  return groups.flat();
}

// ── Coach: Notes ──────────────────────────────────────────────────────────────
export async function apiGetCoachNotes(clientId) {
  return request('GET', `/coach/clients/${clientId}/notes`);
}

export async function apiGetAllNotes() {
  const clients = await apiGetClients();
  const groups = await Promise.all(clients.map(client =>
    apiGetCoachNotes(client.id).catch(() => [])
  ));
  return groups.flat();
}

export async function apiCreateNote(clientId, text) {
  return request('POST', `/coach/clients/${clientId}/notes`, { text });
}

export async function apiUpdateNote(id, text) {
  return request('PUT', `/coach/notes/${id}`, { text });
}

export async function apiDeleteNote(id) {
  return request('DELETE', `/coach/notes/${id}`);
}

// ── Coach: Diet Templates ─────────────────────────────────────────────────────
export async function apiGetDietTemplates() {
  const templates = await request('GET', '/coach/diet-templates');
  return templates.map(normalizeDiet);
}

export async function apiCreateDietTemplate(data) {
  return normalizeDiet(await request('POST', '/coach/diet-templates', stringifyJsonArray(data, 'meals')));
}

export async function apiUpdateDietTemplate(id, data) {
  return normalizeDiet(await request('PUT', `/coach/diet-templates/${id}`, stringifyJsonArray(data, 'meals')));
}

export async function apiDeleteDietTemplate(id) {
  return request('DELETE', `/coach/diet-templates/${id}`);
}

// ── Coach: Diets ──────────────────────────────────────────────────────────────
export async function apiGetDiets() {
  const diets = await request('GET', '/coach/diets');
  return diets.map(normalizeDiet);
}

export async function apiCreateDiet(data) {
  return normalizeDiet(await request('POST', '/coach/diets', stringifyJsonArray(data, 'meals')));
}

export async function apiUpdateDiet(id, data) {
  return normalizeDiet(await request('PUT', `/coach/diets/${id}`, stringifyJsonArray(data, 'meals')));
}

export async function apiDeleteDiet(id) {
  return request('DELETE', `/coach/diets/${id}`);
}

export async function apiCreateDietFromTemplate(templateId, name, goal) {
  return normalizeDiet(await request('POST', '/coach/diets/from-template', { templateId, name, goal }));
}

// ── Coach: Nutrition Thread ───────────────────────────────────────────────────
export async function apiGetClientThread(clientId) {
  return normalizeThread(await request('GET', `/coach/clients/${clientId}/thread`));
}

export async function apiSendCoachMessage(clientId, text) {
  return normalizeThread(await request('POST', `/coach/clients/${clientId}/thread/message`, { message: text }));
}

export async function apiGetNotifications() {
  return request('GET', '/coach/notifications');
}

export async function apiMarkThreadRead(clientId) {
  return request('PUT', `/coach/threads/${clientId}/read`);
}

export async function apiAssignDiet(clientId, dietId) {
  return request('POST', `/coach/clients/${clientId}/diet-assignment`, { dietId });
}

// ── Store ─────────────────────────────────────────────────────────────────────
export async function apiGetProducts() {
  const products = await request('GET', '/products');
  return products.map(normalizeProduct);
}

export async function apiGetProduct(id) {
  return normalizeProduct(await request('GET', `/products/${id}`));
}

export async function apiCheckout(items) {
  return request('POST', '/products/checkout', { items });
}
