/**
 * @file CoachLayout.jsx
 * @description Layout principal del panel de coach con sidebar de navegación,
 *              barra superior móvil y área de contenido principal.
 *              Adaptable a dispositivos móviles con sidebar colapsable.
 */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Loader from '../ui/Loader';
import NotificationBell from '../ui/NotificationBell';
import NotificationPopover from '../ui/NotificationPopover';

// ── Navegación ─────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard', path: '/coach', icon: HomeIcon, exact: true },
  { label: 'Clientes', path: '/coach/clients', icon: UsersIcon },
  { label: 'Templates', path: '/coach/templates', icon: LayoutIcon },
  { label: 'Rutinas', path: '/coach/routines', icon: DumbbellIcon },
  { label: 'Dieta/Nutrición', path: '/coach/diet-templates', icon: AppleIcon },
  { label: 'Chats', path: '/coach/nutrition', icon: ChatIcon },
  { label: 'Asignaciones', path: '/coach/assign', icon: LinkIcon },
  { label: 'Observaciones', path: '/coach/notes', icon: NotesIcon },
];

/**
 * Layout del panel de coach.
 * Provee sidebar con navegación, barra superior para móviles y
 * área de contenido principal con animación de entrada.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar dentro del layout
 * @returns {JSX.Element} Estructura completa del layout de coach
 */
export function CoachLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [bellEl, setBellEl] = useState(null);
  const { user, logout } = useAuth();
  const { loadCoachData, coachLoaded, fetchNotifications } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadCoachData();
  }, [loadCoachData]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!coachLoaded) return <Loader fullPage text="Cargando panel..." />;

  return (
    <div className="coach-layout">
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`coach-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="coach-sidebar-logo">
          <div className="logo-text">Adrián Vila</div>
          <div className="logo-sub">Coach Panel</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Coach</div>
              </div>
            </div>
            <NotificationBell onClick={(e) => { setBellEl(e.currentTarget); setBellOpen(o => !o); }} />
          </div>
          <button className="sidebar-nav-item" style={{ color: 'var(--color-error)', width: '100%' }} onClick={handleLogout}>
            <LogoutIcon size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="coach-main">
        {/* Mobile topbar */}
        <div className="coach-topbar">
          <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen(true)}>
            <MenuIcon size={18} />
          </button>
          <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700 }}>Adrián Vila</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <NotificationBell onClick={(e) => { setBellEl(e.currentTarget); setBellOpen(o => !o); }} />
            <div style={{ width: 36 }} />
          </div>
        </div>

        <div className="coach-content animate-fade">
          {children}
        </div>
      </main>

      <NotificationPopover open={bellOpen} onClose={() => setBellOpen(false)} anchorEl={bellEl} />
    </div>
  );
}

// ── Íconos SVG inline ──────────────────────────────────────────────────────────
/**
 * Componente base para íconos SVG.
 * @param {Object} props
 * @param {number} [props.size=20] - Tamaño del ícono en píxeles
 * @param {React.ReactNode} props.children - Elementos SVG internos (paths, circles, etc.)
 * @returns {JSX.Element} Elemento SVG
 */
function Icon({ size = 20, children }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function HomeIcon({ size }) { return <Icon size={size}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>; }
function UsersIcon({ size }) { return <Icon size={size}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></Icon>; }
function LayoutIcon({ size }) { return <Icon size={size}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Icon>; }
function DumbbellIcon({ size }) { return <Icon size={size}><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4"/></Icon>; }
function LinkIcon({ size }) { return <Icon size={size}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></Icon>; }
function NotesIcon({ size }) { return <Icon size={size}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>; }
function MenuIcon({ size }) { return <Icon size={size}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>; }
function LogoutIcon({ size }) { return <Icon size={size}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>; }
function AppleIcon({ size }) { return <Icon size={size}><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></Icon>; }
function ChatIcon({ size }) { return <Icon size={size}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>; }
