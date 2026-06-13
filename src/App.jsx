/**
 * @file Punto de entrada de la aplicación. Define el enrutamiento principal
 *       con HashRouter, protege rutas de coach y cliente con guards de rol,
 *       e integra los providers de autenticación y contexto global.
 *       Usa React.lazy para code splitting de rutas coach, cliente y store.
 * @route Múltiples rutas (ver Routes internos).
 * @auth Mixto — rutas públicas, de coach y de cliente con guards.
 */
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Toast } from './components/ui/Modals';

// ── Carga perezosa para code splitting ────────────────────────────────────────
// Los chunks de coach, cliente y tienda solo se descargan al navegar a esas rutas

// Public (carga inmediata — landing y login son la primera impresión)
import Landing from './pages/Landing';
import Login from './pages/Login';
import PaymentSimulator from './pages/PaymentSimulator';
import Onboarding from './pages/Onboarding';

// Coach — lazy
const CoachDashboard = lazy(() => import('./pages/coach/CoachDashboard'));
const Clients = lazy(() => import('./pages/coach/Clients'));
const ClientDetail = lazy(() => import('./pages/coach/ClientDetail'));
const Templates = lazy(() => import('./pages/coach/Templates'));
const DietTemplates = lazy(() => import('./pages/coach/DietTemplates'));
const Routines = lazy(() => import('./pages/coach/Routines'));
const Assign = lazy(() => import('./pages/coach/Assign'));
const Notes = lazy(() => import('./pages/coach/Notes'));

// Client — lazy
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const ClientRoutine = lazy(() => import('./pages/client/ClientRoutine'));
const ClientProgress = lazy(() => import('./pages/client/ClientProgress'));
const ClientGoals = lazy(() => import('./pages/client/ClientGoals'));
const ClientNutrition = lazy(() => import('./pages/client/ClientNutrition'));
const ClientNotes = lazy(() => import('./pages/client/ClientNotes'));
const ClientAIAssistant = lazy(() => import('./pages/client/ClientAIAssistant'));

// Store — lazy
const Store = lazy(() => import('./pages/store/Store'));
const ProductDetail = lazy(() => import('./pages/store/ProductDetail'));
const Cart = lazy(() => import('./pages/store/Cart'));

// ── Fallback de carga ─────────────────────────────────────────────────────────
function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', color: 'var(--color-text-2)', fontSize: 14,
    }}>
      Cargando...
    </div>
  );
}

// ── Route guards ──────────────────────────────────────────────────────────────
function CoachRoute({ children }) {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isCoach) return <Navigate to="/client" replace />;
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

function ClientRoute({ children }) {
  const { user, isClient } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isClient) return <Navigate to="/coach" replace />;
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

function LazyRoute({ children }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

function AuthRedirect() {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={isCoach ? '/coach' : '/client'} replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Toast />
          <Routes>
            {/* Public — carga inmediata */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AuthRedirect />} />

            {/* Coach — lazy */}
            <Route path="/coach" element={<CoachRoute><CoachDashboard /></CoachRoute>} />
            <Route path="/coach/clients" element={<CoachRoute><Clients /></CoachRoute>} />
            <Route path="/coach/clients/:id" element={<CoachRoute><ClientDetail /></CoachRoute>} />
            <Route path="/coach/templates" element={<CoachRoute><Templates /></CoachRoute>} />
            <Route path="/coach/diet-templates" element={<CoachRoute><DietTemplates /></CoachRoute>} />
            <Route path="/coach/routines" element={<CoachRoute><Routines /></CoachRoute>} />
            <Route path="/coach/assign" element={<CoachRoute><Assign /></CoachRoute>} />
            <Route path="/coach/notes" element={<CoachRoute><Notes /></CoachRoute>} />

            {/* Client — lazy */}
            <Route path="/client" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
            <Route path="/client/routine" element={<ClientRoute><ClientRoutine /></ClientRoute>} />
            <Route path="/client/progress" element={<ClientRoute><ClientProgress /></ClientRoute>} />
            <Route path="/client/goals" element={<ClientRoute><ClientGoals /></ClientRoute>} />
            <Route path="/client/nutrition" element={<ClientRoute><ClientNutrition /></ClientRoute>} />
            <Route path="/client/ai-assistant" element={<ClientRoute><ClientAIAssistant /></ClientRoute>} />
            <Route path="/client/notes" element={<ClientRoute><ClientNotes /></ClientRoute>} />

            {/* Store — lazy, público */}
            <Route path="/store" element={<LazyRoute><Store /></LazyRoute>} />
            <Route path="/store/:id" element={<LazyRoute><ProductDetail /></LazyRoute>} />
            <Route path="/store/cart" element={<LazyRoute><Cart /></LazyRoute>} />

            {/* Onboarding — carga inmediata */}
            <Route path="/pago" element={<PaymentSimulator />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
