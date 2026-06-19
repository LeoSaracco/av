/**
 * @file Página de plan nutricional del cliente. Muestra la dieta asignada
 *       con indicaciones y comidas diarias, junto con un chat de consultas
 *       (Q&A) bidireccional con el coach.
 * @route /client/nutrition
 * @auth Requiere rol "client".
 */
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

export default function ClientNutrition() {
  const { user } = useAuth();
  const { getDietAssignmentForClient, getDiet, getNutritionThreadForClient, addNutritionMessage } = useApp();

  const clientId = user.clientId;
  const assignment = getDietAssignmentForClient(clientId);
  const diet = assignment ? getDiet(assignment.dietId) : null;
  const thread = getNutritionThreadForClient(clientId);

  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  const handleSend = async () => {
    if (inputMsg.trim()) {
      setSending(true);
      setInputMsg('');
      await addNutritionMessage(clientId, 'client', inputMsg.trim());
      setSending(false);
    }
  };

  return (
    <ClientLayout>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Mi Nutrición 🥗</h1>
          <p>Plan alimentario y consultas con tu coach</p>
        </div>
      </div>

      {!diet ? (
        <div className="empty-state">
          <span style={{ fontSize: 64 }}>🍽️</span>
          <h3>Aún no tenés un plan alimentario</h3>
          <p>Tu coach todavía no te asignó una dieta.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Diet Info */}
          <div className="card" style={{ gap: 16 }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: 24, margin: 0 }}>{diet.name}</h2>
                <span className="badge badge-success">Activo</span>
              </div>
              <p style={{ color: 'var(--color-accent)', fontWeight: 600, marginTop: 4 }}>🎯 {diet.goal}</p>
            </div>

            {diet.indications && (
              <div style={{ background: 'var(--color-bg-3)', padding: 16, borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
                <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 8 }}>Indicaciones del Coach</h4>
                <p style={{ fontSize: 15, lineHeight: 1.6 }}>{diet.indications}</p>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>Comidas Diarias</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {diet.meals?.map((m, i) => (
                  <div key={m.id} style={{ background: 'var(--color-bg-3)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-text-2)' }}>{i + 1}</div>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{m.name}</span>
                    </div>
                    <p style={{ fontSize: 15, paddingLeft: 32, lineHeight: 1.5 }}>{m.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Q&A Thread */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-3)' }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>💬 Consultas al Coach</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-3)', margin: 0 }}>Dejá tus dudas sobre la dieta</p>
            </div>
            
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: 350, overflowY: 'auto' }}>
              {thread.messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-3)' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                  Aún no hay mensajes. Iniciá la conversación.
                </div>
              ) : (
                thread.messages.map(msg => {
                  const isMe = msg.sender === 'client';
                  // Ignore AI messages in this thread if they were created during testing
                  if (msg.sender === 'ai') return null;

                  return (
                    <div key={msg.id} style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: isMe ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      borderBottomRightRadius: isMe ? 0 : 'var(--radius-md)',
                      borderBottomLeftRadius: !isMe ? 0 : 'var(--radius-md)',
                    }}>
                      <div style={{ fontSize: 11, color: isMe ? 'var(--color-accent)' : 'var(--color-text-3)', marginBottom: 4, fontWeight: 600 }}>
                        {isMe ? 'Vos' : 'Coach Adrián'} • {msg.date}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={{ padding: 12, borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-3)', display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="Escribir mensaje..." value={inputMsg} onChange={e => setInputMsg(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }} />
              <button className="btn btn-primary" onClick={handleSend} disabled={!inputMsg.trim() || sending}
                style={sending ? { minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
                {sending ? <div style={inlineSpinnerStyle(16, '#000', 'rgba(0,0,0,0.25)')} /> : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
