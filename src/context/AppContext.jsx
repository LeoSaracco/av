import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SEED_CLIENTS, SEED_TEMPLATES, SEED_ROUTINES,
  SEED_ASSIGNMENTS, SEED_NOTES, SEED_PROGRESS, SEED_PRODUCTS,
  SEED_DIET_TEMPLATES, SEED_DIETS, SEED_DIET_ASSIGNMENTS, SEED_NUTRITION_THREADS
} from '../data/seed';

const AppContext = createContext(null);

function loadOrSeed(key, seed) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function AppProvider({ children }) {
  const [clients, setClients] = useState(() => loadOrSeed('av_clients', SEED_CLIENTS));
  const [templates, setTemplates] = useState(() => loadOrSeed('av_templates', SEED_TEMPLATES));
  const [routines, setRoutines] = useState(() => loadOrSeed('av_routines', SEED_ROUTINES));
  const [assignments, setAssignments] = useState(() => loadOrSeed('av_assignments', SEED_ASSIGNMENTS));
  const [notes, setNotes] = useState(() => loadOrSeed('av_notes', SEED_NOTES));
  const [progress, setProgress] = useState(() => loadOrSeed('av_progress', SEED_PROGRESS));
  const [products] = useState(() => loadOrSeed('av_products', SEED_PRODUCTS));
  const [cart, setCart] = useState(() => loadOrSeed('av_cart', []));
  
  // Nutrition Data
  const [dietTemplates, setDietTemplates] = useState(() => loadOrSeed('av_diet_templates', SEED_DIET_TEMPLATES));
  const [diets, setDiets] = useState(() => loadOrSeed('av_diets', SEED_DIETS));
  const [dietAssignments, setDietAssignments] = useState(() => loadOrSeed('av_diet_assignments', SEED_DIET_ASSIGNMENTS));
  const [nutritionThreads, setNutritionThreads] = useState(() => loadOrSeed('av_nutrition_threads', SEED_NUTRITION_THREADS));

  const [toast, setToast] = useState(null);

  // Persist on change
  useEffect(() => { save('av_clients', clients); }, [clients]);
  useEffect(() => { save('av_templates', templates); }, [templates]);
  useEffect(() => { save('av_routines', routines); }, [routines]);
  useEffect(() => { save('av_assignments', assignments); }, [assignments]);
  useEffect(() => { save('av_notes', notes); }, [notes]);
  useEffect(() => { save('av_progress', progress); }, [progress]);
  useEffect(() => { save('av_cart', cart); }, [cart]);
  useEffect(() => { save('av_diet_templates', dietTemplates); }, [dietTemplates]);
  useEffect(() => { save('av_diets', diets); }, [diets]);
  useEffect(() => { save('av_diet_assignments', dietAssignments); }, [dietAssignments]);
  useEffect(() => { save('av_nutrition_threads', nutritionThreads); }, [nutritionThreads]);

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: uid() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── CLIENTS ────────────────────────────────────────────────────────────────
  const addClient = (data) => {
    const client = { ...data, id: uid(), joinDate: new Date().toISOString().slice(0, 10) };
    setClients(prev => [...prev, client]);
    showToast('Cliente creado correctamente');
    return client;
  };
  const updateClient = (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('Cliente actualizado');
  };
  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Cliente eliminado', 'info');
  };
  const getClient = (id) => clients.find(c => c.id === id);

  // ── TEMPLATES ──────────────────────────────────────────────────────────────
  const addTemplate = (data) => {
    const t = { ...data, id: uid(), createdAt: new Date().toISOString().slice(0, 10) };
    setTemplates(prev => [...prev, t]);
    showToast('Template creado');
    return t;
  };
  const updateTemplate = (id, data) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Template actualizado');
  };
  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    showToast('Template eliminado', 'info');
  };
  const getTemplate = (id) => templates.find(t => t.id === id);

  // ── ROUTINES ───────────────────────────────────────────────────────────────
  const addRoutine = (data) => {
    const r = { ...data, id: uid(), createdAt: new Date().toISOString().slice(0, 10) };
    setRoutines(prev => [...prev, r]);
    showToast('Rutina creada');
    return r;
  };
  const updateRoutine = (id, data) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    showToast('Rutina actualizada');
  };
  const deleteRoutine = (id) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
    showToast('Rutina eliminada', 'info');
  };
  const duplicateRoutine = (id) => {
    const original = routines.find(r => r.id === id);
    if (!original) return;
    const copy = {
      ...original,
      id: uid(),
      name: `${original.name} (copia)`,
      exercises: original.exercises.map(e => ({ ...e, id: uid() })),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRoutines(prev => [...prev, copy]);
    showToast('Rutina duplicada');
    return copy;
  };
  const getRoutine = (id) => routines.find(r => r.id === id);
  const createRoutineFromTemplate = (templateId, name, goal) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return null;
    return addRoutine({
      name: name || `${tpl.name} – nueva`,
      goal: goal || tpl.goal,
      templateId,
      exercises: tpl.exercises.map(e => ({ ...e, id: uid() })),
    });
  };

  // ── ASSIGNMENTS ────────────────────────────────────────────────────────────
  const assignRoutine = (clientId, routineId) => {
    setAssignments(prev => {
      const filtered = prev.filter(a => a.clientId !== clientId);
      return [...filtered, { id: uid(), clientId, routineId, assignedAt: new Date().toISOString().slice(0, 10), active: true }];
    });
    showToast('Rutina asignada correctamente');
  };
  const getAssignmentForClient = (clientId) => assignments.find(a => a.clientId === clientId && a.active);

  // ── NOTES ──────────────────────────────────────────────────────────────────
  const addNote = (clientId, text) => {
    const note = { id: uid(), clientId, text, createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) };
    setNotes(prev => [...prev, note]);
    showToast('Observación agregada');
  };
  const updateNote = (id, text) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text, updatedAt: new Date().toISOString().slice(0, 10) } : n));
    showToast('Observación actualizada');
  };
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Observación eliminada', 'info');
  };
  const getNotesForClient = (clientId) => notes.filter(n => n.clientId === clientId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // ── PROGRESS ───────────────────────────────────────────────────────────────
  const addProgress = (clientId, data) => {
    const entry = { ...data, id: uid(), clientId };
    setProgress(prev => [...prev, entry]);
    showToast('Registro agregado');
  };
  const deleteProgress = (id) => {
    setProgress(prev => prev.filter(p => p.id !== id));
    showToast('Registro eliminado', 'info');
  };
  const getProgressForClient = (clientId) =>
    progress.filter(p => p.clientId === clientId).sort((a, b) => a.date.localeCompare(b.date));

  // ── NUTRITION: TEMPLATES ───────────────────────────────────────────────────
  const addDietTemplate = (data) => {
    const t = { ...data, id: uid(), createdAt: new Date().toISOString().slice(0, 10) };
    setDietTemplates(prev => [...prev, t]);
    showToast('Plantilla de dieta creada');
    return t;
  };
  const updateDietTemplate = (id, data) => {
    setDietTemplates(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Plantilla de dieta actualizada');
  };
  const deleteDietTemplate = (id) => {
    setDietTemplates(prev => prev.filter(t => t.id !== id));
    showToast('Plantilla de dieta eliminada', 'info');
  };
  const getDietTemplate = (id) => dietTemplates.find(t => t.id === id);

  // ── NUTRITION: DIETS ───────────────────────────────────────────────────────
  const addDiet = (data) => {
    const d = { ...data, id: uid(), createdAt: new Date().toISOString().slice(0, 10) };
    setDiets(prev => [...prev, d]);
    showToast('Dieta persistida');
    return d;
  };
  const updateDiet = (id, data) => {
    setDiets(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    showToast('Dieta actualizada');
  };
  const deleteDiet = (id) => {
    setDiets(prev => prev.filter(d => d.id !== id));
  };
  const getDiet = (id) => diets.find(d => d.id === id);
  const createDietFromTemplate = (templateId, name, goal) => {
    const tpl = dietTemplates.find(t => t.id === templateId);
    if (!tpl) return null;
    return addDiet({
      name: name || `${tpl.name} – nueva`,
      goal: goal || tpl.goal,
      templateId,
      indications: tpl.indications,
      meals: tpl.meals.map(m => ({ ...m, id: uid() })),
    });
  };

  // ── NUTRITION: ASSIGNMENTS ─────────────────────────────────────────────────
  const assignDiet = (clientId, dietId) => {
    setDietAssignments(prev => {
      const filtered = prev.filter(a => a.clientId !== clientId);
      return [...filtered, { id: uid(), clientId, dietId, assignedAt: new Date().toISOString().slice(0, 10), active: true }];
    });
    showToast('Dieta asignada correctamente');
  };
  const getDietAssignmentForClient = (clientId) => dietAssignments.find(a => a.clientId === clientId && a.active);

  // ── NUTRITION: THREADS ─────────────────────────────────────────────────────
  const getNutritionThreadForClient = (clientId) => {
    let thread = nutritionThreads.find(th => th.clientId === clientId);
    if (!thread) {
       thread = { id: uid(), clientId, messages: [] };
       // we don't save it immediately to avoid empty threads, but we return a valid structure
    }
    return thread;
  };
  const addNutritionMessage = (clientId, sender, text) => {
    const message = {
      id: uid(),
      sender,
      text,
      date: new Date().toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')
    };
    
    setNutritionThreads(prev => {
      const existing = prev.find(th => th.clientId === clientId);
      if (existing) {
        return prev.map(th => th.clientId === clientId ? { ...th, messages: [...th.messages, message] } : th);
      } else {
        return [...prev, { id: uid(), clientId, messages: [message] }];
      }
    });
  };

  // ── CART ───────────────────────────────────────────────────────────────────
  const addToCart = (product, opts = {}) => {
    setCart(prev => {
      const key = `${product.id}-${opts.size || ''}-${opts.color || opts.flavor || ''}`;
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { key, product, qty: 1, ...opts }];
    });
    showToast(`${product.name} agregado al carrito`);
  };
  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));
  const updateCartQty = (key, qty) => {
    if (qty < 1) { removeFromCart(key); return; }
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };
  const clearCart = () => { setCart([]); showToast('Compra realizada (demo)'); };
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AppContext.Provider value={{
      // data
      clients, templates, routines, assignments, notes, progress, products, cart,
      dietTemplates, diets, dietAssignments, nutritionThreads,
      // clients
      addClient, updateClient, deleteClient, getClient,
      // templates
      addTemplate, updateTemplate, deleteTemplate, getTemplate,
      // routines
      addRoutine, updateRoutine, deleteRoutine, duplicateRoutine, getRoutine, createRoutineFromTemplate,
      // assignments
      assignRoutine, getAssignmentForClient,
      // notes
      addNote, updateNote, deleteNote, getNotesForClient,
      // progress
      addProgress, deleteProgress, getProgressForClient,
      // nutrition
      addDietTemplate, updateDietTemplate, deleteDietTemplate, getDietTemplate,
      addDiet, updateDiet, deleteDiet, getDiet, createDietFromTemplate,
      assignDiet, getDietAssignmentForClient,
      getNutritionThreadForClient, addNutritionMessage,
      // cart
      addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      // utils
      toast, showToast, uid,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
