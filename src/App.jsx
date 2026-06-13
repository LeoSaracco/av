/**
 * @file Punto de entrada de la aplicación. Define el enrutamiento principal
 *       con HashRouter, protege rutas de coach y cliente con guards de rol,
 *       e integra los providers de autenticación y contexto global.
 * @route Múltiples rutas (ver Routes internos).
 * @auth Mixto — rutas públicas, de coach y de cliente con guards.
 */
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Toast } from './components/ui/Modals';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';

// Coach pages
import CoachDashboard from './pages/coach/CoachDashboard';
import Clients from './pages/coach/Clients';
import ClientDetail from './pages/coach/ClientDetail';
import Templates from './pages/coach/Templates';
import DietTemplates from './pages/coach/DietTemplates';
import Routines from './pages/coach/Routines';
import Assign from './pages/coach/Assign';
import Notes from './pages/coach/Notes';

// Client pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientRoutine from './pages/client/ClientRoutine';
import ClientProgress from './pages/client/ClientProgress';
import ClientGoals from './pages/client/ClientGoals';
import ClientNutrition from './pages/client/ClientNutrition';
import ClientNotes from './pages/client/ClientNotes';
import ClientAIAssistant from './pages/client/ClientAIAssistant';

// Store pages
import Store from './pages/store/Store';
import ProductDetail from './pages/store/ProductDetail';
import Cart from './pages/store/Cart';

// Onboarding
import PaymentSimulator from './pages/PaymentSimulator';
import Onboarding from './pages/Onboarding';

// ── Route guards ──────────────────────────────────────────────────────────────
/**
 * Guard de ruta para coach. Redirige al login si no hay usuario,
 * o al dashboard de cliente si el rol no es coach.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children - Componente hijo protegido.
 * @returns {JSX.Element} Componente hijo si el rol es coach, o redirección.
 */
function CoachRoute({ children }) {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isCoach) return <Navigate to="/client" replace />;
  return children;
}

/**
 * Guard de ruta para cliente. Redirige al login si no hay usuario,
 * o al dashboard de coach si el rol no es cliente.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children - Componente hijo protegido.
 * @returns {JSX.Element} Componente hijo si el rol es cliente, o redirección.
 */
function ClientRoute({ children }) {
  const { user, isClient } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isClient) return <Navigate to="/coach" replace />;
  return children;
}

/**
 * redirección autom tica segÃºn rol.
 * Si el usuario est  autenticado, lo envía al dashboard que corresponda
 * (coach o cliente). Si no, redirige al login.
 *
 * @returns {JSX.Element} Elemento Navigate hacia la ruta correspondiente.
 */
function AuthRedirect() {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={isCoach ? '/coach' : '/client'} replace />;
}

// ── Componente principal ────────────────────────────────────────────────────
/**
 * Componente Raíz de la aplicación.
 * Envuelve todo el áárbol de componentes con AuthProvider y AppProvider,
 * define el sistema de rutas completo (públicas, coach, cliente, tienda y
 * onboarding) con guards de autenticación y redirecciones.
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con enrutamiento.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Toast />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Auto-redirect */}
            <Route path="/dashboard" element={<AuthRedirect />} />

            {/* Coach */}
            <Route path="/coach" element={<CoachRoute><CoachDashboard /></CoachRoute>} />
            <Route path="/coach/clients" element={<CoachRoute><Clients /></CoachRoute>} />
            <Route path="/coach/clients/:id" element={<CoachRoute><ClientDetail /></CoachRoute>} />
            <Route path="/coach/templates" element={<CoachRoute><Templates /></CoachRoute>} />
            <Route path="/coach/diet-templates" element={<CoachRoute><DietTemplates /></CoachRoute>} />
            <Route path="/coach/routines" element={<CoachRoute><Routines /></CoachRoute>} />
            <Route path="/coach/assign" element={<CoachRoute><Assign /></CoachRoute>} />
            <Route path="/coach/notes" element={<CoachRoute><Notes /></CoachRoute>} />

            {/* Client */}
            <Route path="/client" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
            <Route path="/client/routine" element={<ClientRoute><ClientRoutine /></ClientRoute>} />
            <Route path="/client/progress" element={<ClientRoute><ClientProgress /></ClientRoute>} />
            <Route path="/client/goals" element={<ClientRoute><ClientGoals /></ClientRoute>} />
            <Route path="/client/nutrition" element={<ClientRoute><ClientNutrition /></ClientRoute>} />
            <Route path="/client/ai-assistant" element={<ClientRoute><ClientAIAssistant /></ClientRoute>} />
            <Route path="/client/notes" element={<ClientRoute><ClientNotes /></ClientRoute>} />

            {/* Store — public */}
            <Route path="/store" element={<Store />} />
            <Route path="/store/:id" element={<ProductDetail />} />
            <Route path="/store/cart" element={<Cart />} />

            {/* Onboarding flow — public */}
            <Route path="/pago" element={<PaymentSimulator />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
