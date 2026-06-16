import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/apiClient';

const AppContext = createContext(null);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function AppProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [cart, setCart] = useState([]);
  const [dietTemplates, setDietTemplates] = useState([]);
  const [diets, setDiets] = useState([]);
  const [dietAssignments, setDietAssignments] = useState([]);
  const [nutritionThreads, setNutritionThreads] = useState([]);
  const [onboardingSubmissions, setOnboardingSubmissions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [coachLoaded, setCoachLoaded] = useState(false);
  const [clientLoaded, setClientLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchPublicPlans() {
      try {
        setPlans(await api.apiGetPlans());
      } catch (err) {
        setLoadError(err.message || 'No se pudo cargar la API');
      } finally {
        setLoaded(true);
      }
    }
    fetchPublicPlans();
  }, []);

  const loadProducts = useCallback(async () => {
    if (productsLoaded) return;
    try {
      setProducts(await api.apiGetProducts());
      setProductsLoaded(true);
    } catch (err) {
      setLoadError(err.message || 'No se pudieron cargar los productos');
    }
  }, [productsLoaded]);

  const loadCoachData = useCallback(async () => {
    if (coachLoaded) return;
    try {
      const [c, t, r] = await Promise.all([
        api.apiGetClients(),
        api.apiGetTemplates(),
        api.apiGetRoutines(),
      ]);
      setClients(c);
      setTemplates(t);
      setRoutines(r);
      try { setAssignments(await api.apiGetAssignments()); } catch { setAssignments([]); }
      try { setDietTemplates(await api.apiGetDietTemplates()); } catch { setDietTemplates([]); }
      try { setDiets(await api.apiGetDiets()); } catch { setDiets([]); }
      try { setNotes(await api.apiGetAllNotes()); } catch { setNotes([]); }
      setCoachLoaded(true);
    } catch (err) {
      setLoadError(err.message || 'No se pudieron cargar los datos del coach');
    }
  }, [coachLoaded]);

  const loadClientData = useCallback(async (user) => {
    if (clientLoaded || !user) return;
    const clientId = user.clientId || user.id;
    try {
      setClients([{ id: clientId, name: user.name, email: user.email, goal: user.goal }]);
      const [routine, diet, myProgress, myNotes] = await Promise.all([
        api.apiGetMyRoutine().catch(() => null),
        api.apiGetMyDiet().catch(() => null),
        api.apiGetMyProgress().catch(() => []),
        api.apiGetMyNotes().catch(() => []),
      ]);
      if (routine) {
        setRoutines([routine]);
        setAssignments([{ clientId, routineId: routine.id, assignedAt: routine.assignedAt || '', active: true }]);
      }
      if (diet) {
        setDiets([diet]);
        setDietAssignments([{ clientId, dietId: diet.id, assignedAt: diet.assignedAt || '', active: true }]);
      }
      setProgress(myProgress.map(item => ({ ...item, clientId })));
      setNotes(myNotes.map(item => ({ ...item, clientId })));
      setClientLoaded(true);
    } catch (err) {
      setLoadError(err.message || 'No se pudieron cargar los datos del cliente');
    }
  }, [clientLoaded]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: uid() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addClient = async (data) => {
    try { const created = await api.apiCreateClient(data); setClients(prev => [...prev, created]); showToast('Cliente creado'); }
    catch { showToast('Error al crear cliente', 'error'); }
  };
  const updateClient = async (id, data) => {
    try { const updated = await api.apiUpdateClient(id, data); setClients(prev => prev.map(c => c.id === id ? updated : c)); showToast('Cliente actualizado'); }
    catch { showToast('Error', 'error'); }
  };
  const deleteClient = async (id) => { try { await api.apiDeleteClient(id); setClients(prev => prev.filter(c => c.id !== id)); showToast('Cliente eliminado', 'info'); } catch { showToast('Error', 'error'); } };
  const getClient = (id) => clients.find(c => c.id === id);

  const addTemplate = async (data) => { try { const created = await api.apiCreateTemplate(data); setTemplates(prev => [...prev, created]); showToast('Template creado'); } catch { showToast('Error', 'error'); } };
  const updateTemplate = async (id, data) => { try { const updated = await api.apiUpdateTemplate(id, data); setTemplates(prev => prev.map(t => t.id === id ? updated : t)); showToast('Template actualizado'); } catch { showToast('Error', 'error'); } };
  const deleteTemplate = async (id) => { try { await api.apiDeleteTemplate(id); setTemplates(prev => prev.filter(t => t.id !== id)); showToast('Template eliminado', 'info'); } catch { showToast('Error', 'error'); } };
  const getTemplate = (id) => templates.find(t => t.id === id);

  const addRoutine = async (data) => { try { const created = await api.apiCreateRoutine(data); setRoutines(prev => [...prev, created]); showToast('Rutina creada'); } catch { showToast('Error', 'error'); } };
  const updateRoutine = async (id, data) => { try { const updated = await api.apiUpdateRoutine(id, data); setRoutines(prev => prev.map(r => r.id === id ? updated : r)); showToast('Rutina actualizada'); } catch { showToast('Error', 'error'); } };
  const deleteRoutine = async (id) => { try { await api.apiDeleteRoutine(id); setRoutines(prev => prev.filter(r => r.id !== id)); showToast('Rutina eliminada', 'info'); } catch { showToast('Error', 'error'); } };
  const getRoutine = (id) => routines.find(r => r.id === id);
  const duplicateRoutine = async (id) => {
    const original = routines.find(r => r.id === id);
    if (original) await addRoutine({ ...original, id: undefined, name: `${original.name} (copia)` });
  };
  const createRoutineFromTemplate = async (templateId, name, goal) => {
    try { const created = await api.apiCreateRoutineFromTemplate(templateId, name, goal); setRoutines(prev => [...prev, created]); showToast('Rutina creada desde template'); } catch { showToast('Error', 'error'); }
  };

  const assignRoutine = async (clientId, routineId, dietId) => {
    try {
      const created = await api.apiAssignRoutine(clientId, routineId, dietId);
      setAssignments(prev => prev.filter(a => a.clientId !== clientId).concat(created));
      showToast('Rutina asignada');
    } catch { showToast('Error', 'error'); }
  };
  const getAssignmentForClient = (clientId) => assignments.find(a => a.clientId === clientId && a.active);

  const addNote = async (clientId, text) => { try { const created = await api.apiCreateNote(clientId, text); setNotes(prev => [...prev, created]); showToast('Nota agregada'); } catch { showToast('Error', 'error'); } };
  const updateNote = async (id, text) => { try { const updated = await api.apiUpdateNote(id, text); setNotes(prev => prev.map(n => n.id === id ? updated : n)); showToast('Nota actualizada'); } catch { showToast('Error', 'error'); } };
  const deleteNote = async (id) => { try { await api.apiDeleteNote(id); setNotes(prev => prev.filter(n => n.id !== id)); showToast('Nota eliminada', 'info'); } catch { showToast('Error', 'error'); } };
  const getNotesForClient = (clientId) => notes.filter(n => n.clientId === clientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const addProgress = async (clientId, data) => { try { const created = await api.apiLogProgress(data.weight, data.date, data.comment); setProgress(prev => [...prev, { ...created, clientId }]); showToast('Progreso registrado'); } catch { showToast('Error', 'error'); } };
  const deleteProgress = async (id) => { try { await api.apiDeleteProgress(id); setProgress(prev => prev.filter(p => p.id !== id)); } catch { showToast('Error', 'error'); } };
  const getProgressForClient = (clientId) => progress.filter(p => p.clientId === clientId).sort((a, b) => new Date(a.date) - new Date(b.date));

  const addDietTemplate = async (data) => { try { const created = await api.apiCreateDietTemplate(data); setDietTemplates(prev => [...prev, created]); showToast('Dieta creada'); } catch { showToast('Error', 'error'); } };
  const updateDietTemplate = async (id, data) => { try { const updated = await api.apiUpdateDietTemplate(id, data); setDietTemplates(prev => prev.map(d => d.id === id ? updated : d)); } catch { showToast('Error', 'error'); } };
  const deleteDietTemplate = async (id) => { try { await api.apiDeleteDietTemplate(id); setDietTemplates(prev => prev.filter(d => d.id !== id)); } catch { showToast('Error', 'error'); } };
  const getDietTemplate = (id) => dietTemplates.find(d => d.id === id);

  const addDiet = async (data) => { try { const created = await api.apiCreateDiet(data); setDiets(prev => [...prev, created]); } catch { showToast('Error', 'error'); } };
  const updateDiet = async (id, data) => { try { const updated = await api.apiUpdateDiet(id, data); setDiets(prev => prev.map(d => d.id === id ? updated : d)); } catch { showToast('Error', 'error'); } };
  const deleteDiet = async (id) => { try { await api.apiDeleteDiet(id); setDiets(prev => prev.filter(d => d.id !== id)); } catch { showToast('Error', 'error'); } };
  const getDiet = (id) => diets.find(d => d.id === id);
  const createDietFromTemplate = async (templateId, name, goal) => {
    try { const created = await api.apiCreateDietFromTemplate(templateId, name, goal); setDiets(prev => [...prev, created]); } catch { showToast('Error', 'error'); }
  };
  const assignDiet = (clientId, dietId) => {
    setDietAssignments(prev => prev.filter(a => a.clientId !== clientId).concat({ clientId, dietId, assignedAt: new Date().toISOString(), active: true }));
  };
  const getDietAssignmentForClient = (clientId) => dietAssignments.find(a => a.clientId === clientId && a.active);

  const getNutritionThreadForClient = (clientId) => nutritionThreads.find(t => t.clientId === clientId) || { clientId, messages: [] };
  const addNutritionMessage = async (clientId, sender, text) => {
    try {
      const thread = sender === 'client'
        ? await api.apiSendMessage(text)
        : await api.apiSendCoachMessage(clientId, text);
      setNutritionThreads(prev => prev.filter(t => t.clientId !== clientId).concat(thread));
    } catch { showToast('Error al enviar mensaje', 'error'); }
  };

  const addToCart = (product, opts = {}) => {
    const key = `${product.id}_${opts.size || ''}_${opts.color || ''}_${opts.flavor || ''}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { key, product, qty: 1, ...opts }];
    });
  };
  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));
  const updateCartQty = (key, qty) => { if (qty < 1) removeFromCart(key); else setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i)); };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const createOnboardingSubmission = async (data) => {
    try {
      await api.apiSubmitOnboarding(data);
      const submission = { ...data, id: uid(), submittedAt: new Date().toISOString().slice(0, 10) };
      setOnboardingSubmissions(prev => [...prev, submission]);
      showToast('Cuestionario enviado');
      return submission;
    } catch {
      showToast('Error al enviar cuestionario', 'error');
      return null;
    }
  };
  const getOnboardingByEmail = (email) => onboardingSubmissions.find(s => s.email === email);

  return (
    <AppContext.Provider value={{
      clients, templates, routines, assignments, notes, progress, products, plans, cart, loaded, loadError,
      coachLoaded, clientLoaded, productsLoaded, loadCoachData, loadClientData, loadProducts,
      dietTemplates, diets, dietAssignments, nutritionThreads, onboardingSubmissions,
      addClient, updateClient, deleteClient, getClient,
      addTemplate, updateTemplate, deleteTemplate, getTemplate,
      addRoutine, updateRoutine, deleteRoutine, duplicateRoutine, getRoutine, createRoutineFromTemplate,
      assignRoutine, getAssignmentForClient,
      addNote, updateNote, deleteNote, getNotesForClient,
      addProgress, deleteProgress, getProgressForClient,
      addDietTemplate, updateDietTemplate, deleteDietTemplate, getDietTemplate,
      addDiet, updateDiet, deleteDiet, getDiet, createDietFromTemplate,
      assignDiet, getDietAssignmentForClient,
      getNutritionThreadForClient, addNutritionMessage,
      addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      createOnboardingSubmission, getOnboardingByEmail,
      toast, showToast, uid,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
