/**
 * @file App.jsx — Application root: route definitions, auth context provider, and route guards.
 *
 * Route structure:
 *   /              Landing (public)
 *   /login         Login (public)
 *   /coach/*        Coach routes (requires COACH role)
 *   /client/*       Client routes (requires CLIENT role)
 *   /store/*        Store (public)
 *   /pago          Payment flow (public)
 *   /onboarding     Onboarding flow (public)
 *
 * @uses AuthProvider — wraps the entire app for auth state
 * @uses AppProvider  — wraps the app for business data state
 * @uses HashRouter   — hash-based routing for Railway SPA compatibility
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
 * Guards coach routes, redirects to /login if not authenticated or /client if not a coach.
 */
function CoachRoute({ children }) {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isCoach) return <Navigate to="/client" replace />;
  return children;
}

/**
 * Guards client routes, redirects to /login if not authenticated or /coach if not a client.
 */
function ClientRoute({ children }) {
  const { user, isClient } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isClient) return <Navigate to="/coach" replace />;
  return children;
}

/**
 * Auto-redirects logged-in users to /coach or /client based on role.
 */
function AuthRedirect() {
  const { user, isCoach } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={isCoach ? '/coach' : '/client'} replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────

/**
 * Application root component. Wraps the app with AuthProvider, AppProvider, and
 * HashRouter, then defines all public and role-guarded routes.
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
