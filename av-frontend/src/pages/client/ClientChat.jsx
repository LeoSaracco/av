/**
 * @file Chat del cliente con el coach — vista full-screen tipo WhatsApp.
 * @route /client/chat
 * @auth Requiere rol "client".
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

export default function ClientChat() {
  const { user } = useAuth();
  const { getDietAssignmentForClient, getDiet, getNutritionThreadForClient, addNutritionMessage, markThreadRead } = useApp();
  const navigate = useNavigate();
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const clientId = user?.clientId;
  const thread = getNutritionThreadForClient(clientId);
  const dietAssignment = getDietAssignmentForClient(clientId);
  const diet = dietAssignment ? getDiet(dietAssignment.dietId) : null;

  useEffect(() => {
    if (clientId) {
      try { markThreadRead(clientId); } catch { /* ignore */ }
    }
  }, [clientId, markThreadRead]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  const handleSend = async () => {
    const text = inputMsg.trim();
    if (!text || !clientId || sending) return;
    setSending(true);
    setInputMsg('');
    await addNutritionMessage(clientId, 'client', text);
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ClientLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--navbar-height, 60px) - 80px)' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-2)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 18, padding: '4px', lineHeight: 1 }}>
            ←
          </button>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-main)' }}>Coach Adrián</div>
            {diet && <div style={{ fontSize: 11, color: 'var(--color-accent)' }}>🥗 {diet.name}</div>}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {(thread?.messages?.length || 0) === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--color-text-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-2)' }}>Sin mensajes aún</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Enviá tu primera consulta sobre la dieta</div>
            </div>
          ) : (
            thread.messages.map(msg => {
              if (msg.sender === 'ai') return null;
              const isMe = msg.sender === 'CLIENT' || msg.sender === 'client';
              return (
                <div key={msg.id} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%', alignSelf: isMe ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMe ? 'var(--color-accent-dim2)' : 'var(--color-bg-3)',
                    border: isMe ? '1px solid rgba(0,255,0,0.15)' : '1px solid var(--color-border)',
                    fontSize: 14, lineHeight: 1.45,
                    color: 'var(--color-text)',
                    wordBreak: 'break-word',
                  }}>
                    {!isMe && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 2 }}>Coach</div>}
                    {isMe && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 2 }}>Vos</div>}
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
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
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
      </div>
    </ClientLayout>
  );
}
