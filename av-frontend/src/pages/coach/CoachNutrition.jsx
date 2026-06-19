/**
 * @file Chat de nutrición del coach — vista tipo WhatsApp.
 *       Lista de chats a la izquierda, conversación a la derecha.
 *       En mobile, lista o chat full-screen con toggle.
 * @route /coach/nutrition
 * @auth Requiere rol "coach".
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

function timeAgo(date) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  return `${Math.floor(hrs / 24)} d`;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}

export default function CoachNutrition() {
  const {
    clients, getDiet, getDietAssignmentForClient,
    getNutritionThreadForClient, addNutritionMessage, loadThreadForClient,
    notifications, fetchNotifications, markThreadRead,
  } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeClientId = searchParams.get('client') || '';

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (activeClientId) loadThreadForClient(activeClientId);
  }, [activeClientId, loadThreadForClient]);

  const activeClient = useMemo(() =>
    clients.find(c => c.id === activeClientId), [clients, activeClientId]);

  const activeThread = useMemo(() =>
    getNutritionThreadForClient(activeClientId), [activeClientId, getNutritionThreadForClient]);

  const activeDietAssignment = useMemo(() =>
    getDietAssignmentForClient(activeClientId), [activeClientId, getDietAssignmentForClient]);

  const activeDiet = useMemo(() =>
    activeDietAssignment ? getDiet(activeDietAssignment.dietId) : null, [activeDietAssignment, getDiet]);

  const chatThreads = useMemo(() => {
    if (!notifications.length) return [];
    const mapped = notifications.map(n => {
      const client = clients.find(c => c.id === n.clientId);
      return {
        clientId: n.clientId,
        clientName: client?.name || n.clientName,
        dietName: n.dietName,
        lastMessage: n.lastMessage,
        lastSender: n.lastSender,
        updatedAt: n.updatedAt,
        unread: n.unread,
        initials: (client?.name || n.clientName).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      };
    });
    if (search) {
      const q = search.toLowerCase();
      return mapped.filter(t => t.clientName.toLowerCase().includes(q));
    }
    return mapped;
  }, [notifications, clients, search]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages?.length]);

  const handleSend = async () => {
    const text = inputMsg.trim();
    if (!text || !activeClientId || sending) return;
    setSending(true);
    setInputMsg('');
    await addNutritionMessage(activeClientId, 'coach', text);
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectClient = (clientId) => {
    markThreadRead(clientId);
    setSearchParams({ client: clientId });
  };

  const backToList = () => {
    setSearchParams({});
  };

  const showList = !isMobile || !activeClientId;

  return (
    <CoachLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--navbar-height, 60px) - 60px)', height: 'calc(100dvh - var(--navbar-height, 60px) - 60px)', gap: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>

        {/* ── Lista de chats ─────────────────────────────────────────────── */}
        {(!isMobile || showList) && (
          <div style={{
            width: isMobile ? '100%' : 320, flexShrink: 0,
            borderRight: isMobile ? 'none' : '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column',
            background: 'var(--color-bg-2)',
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-main)', fontSize: 18, margin: '0 0 12px 0' }}>
                Chats
              </h2>
              <div className="search-bar" style={{ maxWidth: '100%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {chatThreads.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: 13 }}>
                  {notifications.length === 0 ? (
                    <>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🥗</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Sin conversaciones</div>
                      <div>Asigná una dieta a un cliente desde su perfil para empezar</div>
                    </>
                  ) : (
                    'Sin resultados'
                  )}
                </div>
              ) : (
                chatThreads.map(t => (
                  <div key={t.clientId}
                    onClick={() => selectClient(t.clientId)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                      cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                      background: t.clientId === activeClientId ? 'var(--color-bg-3)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { if (t.clientId !== activeClientId) e.currentTarget.style.background = 'var(--color-bg-3)'; }}
                    onMouseLeave={e => { if (t.clientId !== activeClientId) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="avatar" style={{ width: 44, height: 44, fontSize: 14, flexShrink: 0 }}>
                      {t.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.clientName}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-3)', flexShrink: 0 }}>{timeAgo(t.updatedAt)}</span>
                      </div>
                      {t.dietName && (
                        <div style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 1 }}>🥗 {t.dietName}</div>
                      )}
                      <div style={{
                        fontSize: 12, color: t.unread ? 'var(--color-text)' : 'var(--color-text-3)',
                        fontWeight: t.unread ? 600 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
                      }}>
                        {t.lastMessage ? (
                          <>{t.lastSender === 'COACH' ? 'Tú: ' : ''}{t.lastMessage.slice(0, 40)}</>
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--color-text-3)' }}>Sin mensajes todavía</span>
                        )}
                      </div>
                    </div>
                    {t.unread && (
                      <span style={{
                        width: 10, height: 10, borderRadius: 5,
                        background: 'var(--color-accent)', flexShrink: 0,
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Chat ────────────────────────────────────────────────────────── */}
        {(!isMobile || !showList) && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {activeClientId && activeClient ? (
              <>
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                  borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-2)',
                }}>
                  {isMobile && (
                    <button onClick={backToList} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 18, padding: '4px', lineHeight: 1 }}>
                      ←
                    </button>
                  )}
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 12, cursor: 'pointer' }}
                    onClick={() => navigate(`/coach/clients/${activeClient.id}`)}>
                    {activeClient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/coach/clients/${activeClient.id}`)}>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)' }}>{activeClient.name}</div>
                    {activeDiet && <div style={{ fontSize: 11, color: 'var(--color-accent)' }}>🥗 {activeDiet.name}</div>}
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '16px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  {(activeThread?.messages?.length || 0) === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--color-text-3)' }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
                      <div style={{ fontSize: 13 }}>Iniciá la conversación</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Enviá el primer mensaje para coordinar la pauta nutricional</div>
                    </div>
                  ) : (
                    activeThread.messages.map(msg => {
                      const isCoach = msg.sender === 'COACH';
                      return (
                        <div key={msg.id} style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: isCoach ? 'flex-end' : 'flex-start',
                          maxWidth: '80%', alignSelf: isCoach ? 'flex-end' : 'flex-start',
                        }}>
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: isCoach ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: isCoach ? 'var(--color-accent-dim2)' : 'var(--color-bg-3)',
                            border: isCoach ? '1px solid rgba(0,255,0,0.15)' : '1px solid var(--color-border)',
                            fontSize: 14, lineHeight: 1.45,
                            color: 'var(--color-text)',
                            wordBreak: 'break-word',
                          }}>
                            {!isCoach && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 2 }}>{activeClient.name.split(' ')[0]}</div>}
                            {isCoach && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 2 }}>Tú</div>}
                            {msg.text}
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--color-text-3)', marginTop: 2, padding: '0 4px' }}>
                            {msg.date ? new Date(msg.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{
                  padding: '12px 16px', borderTop: '1px solid var(--color-border)',
                  background: 'var(--color-bg-2)', display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <input
                    ref={inputRef}
                    style={{
                      flex: 1, height: 48, borderRadius: 24, border: '1px solid var(--color-border)',
                      padding: '0 18px', fontSize: 14, background: 'var(--color-surface)',
                      color: 'var(--color-text)', outline: 'none', fontFamily: 'var(--font-body)',
                    }}
                    placeholder="Escribí un mensaje..."
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />
                  <button onClick={handleSend} disabled={!inputMsg.trim() || sending}
                    style={{
                      width: 48, height: 48, borderRadius: 24, border: 'none',
                      background: inputMsg.trim() ? 'var(--color-accent)' : 'var(--color-bg-3)',
                      color: inputMsg.trim() ? '#000' : 'var(--color-text-3)',
                      cursor: inputMsg.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0, transition: 'background 0.15s ease',
                    }}>
                    {sending ? <div style={inlineSpinnerStyle(16, '#000', 'rgba(0,0,0,0.25)')} /> : '➤'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--color-text-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-2)' }}>Seleccioná un chat</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Elegí un cliente de la lista para ver la conversación</div>
              </div>
            )}
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
