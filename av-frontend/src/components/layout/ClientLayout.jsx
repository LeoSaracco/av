/**
 * @file ClientLayout.jsx
 * @description Layout principal del panel de cliente con barra de navegación
 *              superior, contenido central y barra de navegación inferior fija.
 *              Incluye campanita de notificaciones con polling cada 30s.
 */
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Loader from '../ui/Loader';
import NotificationBell from '../ui/NotificationBell';

/**
 * Layout del panel de cliente.
 * Incluye navbar superior con avatar, campanita y logout, área de contenido
 * y barra de navegación inferior con accesos rápidos.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar dentro del layout
 * @returns {JSX.Element} Estructura completa del layout de cliente
 */
export function ClientLayout({ children }) {
  const { user, logout } = useAuth();
  const { loadClientData, clientLoaded, fetchClientNotifications } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadClientData(user);
  }, [loadClientData, user]);

  useEffect(() => {
    fetchClientNotifications();
    const interval = setInterval(fetchClientNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchClientNotifications]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!clientLoaded) return <Loader fullPage text="Cargando panel..." />;

  return (
    <div className="client-layout">
      {/* Top navbar */}
      <nav className="client-navbar">
        <NavLink to="/" style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>
          Adrián Vila
        </NavLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NotificationBell onClick={() => navigate('/client/chat')} />
          <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      {/* Content */}
      <div className="client-content animate-fade">
        {children}
      </div>

      {/* Bottom nav */}
      <div className="client-bottom-nav">
        <NavLink to="/client" end className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <HomeIcon /><span>Inicio</span>
        </NavLink>
        <NavLink to="/client/routine" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <DumbbellIcon /><span>Rutina</span>
        </NavLink>
        <NavLink to="/client/progress" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <ChartIcon /><span>Evolución</span>
        </NavLink>
        <NavLink to="/client/goals" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <TargetIcon /><span>Objetivos</span>
        </NavLink>
        <NavLink to="/client/nutrition" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <AppleIcon /><span>Dieta</span>
        </NavLink>
        <NavLink to="/client/chat" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <ChatIcon /><span>Chats</span>
        </NavLink>
        <NavLink to="/client/ai-assistant" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <SparklesIcon /><span>✨ IA</span>
        </NavLink>
        <NavLink to="/client/notes" className={({ isActive }) => `client-bottom-nav-item ${isActive ? 'active' : ''}`}>
          <NotesIcon /><span>Notas</span>
        </NavLink>
      </div>
    </div>
  );
}

// ── Íconos SVG inline ──────────────────────────────────────────────────────────
/** @param {Object} props @param {number} [props.size=20] @param {React.ReactNode} props.children @returns {JSX.Element} */
function Icon({ size = 20, children }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function HomeIcon() { return <Icon><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>; }
function DumbbellIcon() { return <Icon><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4"/></Icon>; }
function ChartIcon() { return <Icon><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>; }
function TargetIcon() { return <Icon><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Icon>; }
function NotesIcon() { return <Icon><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></Icon>; }
function AppleIcon() { return <Icon><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></Icon>; }
function SparklesIcon() { return <Icon><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></Icon>; }
function ChatIcon() { return <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>; }
