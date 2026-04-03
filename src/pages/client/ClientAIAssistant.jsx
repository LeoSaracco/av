import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { useNavigate } from 'react-router-dom';

export default function ClientAIAssistant() {
  const { user } = useAuth();
  const { getDietAssignmentForClient, getDiet } = useApp();
  const navigate = useNavigate();

  const clientId = user.clientId;
  const assignment = getDietAssignmentForClient(clientId);
  const diet = assignment ? getDiet(assignment.dietId) : null;
  const dietGoal = diet?.goal || 'Mejorar hábitos alimenticios';

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial AI greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'initial',
          sender: 'ai',
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `¡Hola ${user?.name?.split(' ')[0]}! Soy tu asistente nutricional de IA. Vi que tu coach te asignó el objetivo: "${dietGoal}". ¿En qué comida necesitas ideas hoy?`
        }
      ]);
    }
  }, [dietGoal, messages.length, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'client',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMsg
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let response = `Considerando tu objetivo de "${dietGoal}", te sugiero una opción fresca y rápida: Ensalada con pechuga de pollo, palta y semillas. ¡Mucha proteína y grasas saludables!`;
      
      if (dietGoal.toLowerCase().includes('volumen') || dietGoal.toLowerCase().includes('masa')) {
        response = `Para alcanzar tu superávit en "${dietGoal}", podés sumar un batido rápido: 1 banana, crema de maní, avena y leche. Eso te va a dar la densidad calórica que necesitás.`;
      } else if (newMsg.text.toLowerCase().includes('desayuno')) {
        response = `¡Buenísimo! Para desayunar y mantenerte en "${dietGoal}", probá unos huevos revueltos con una tostada integral y café negro. Te dará saciedad por más tiempo.`;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <ClientLayout>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>← Volver</button>
      </div>

      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Asistente IA ✨</h1>
          <p>Lluvia de ideas inteligente para tu plan</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', height: '65vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', background: 'rgba(138, 43, 226, 0.1)', borderBottom: '1px solid rgba(138, 43, 226, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#b180ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
            <div>
              <h3 style={{ fontSize: 16, margin: 0, color: '#b180ff' }}>NutriBot IA</h3>
              <p style={{ fontSize: 12, color: 'var(--color-text-3)', margin: 0 }}>En línea</p>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', background: 'var(--color-surface)' }}>
          {messages.map(msg => {
            const isMe = msg.sender === 'client';
            return (
              <div key={msg.id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: isMe ? 'var(--color-accent-dim)' : 'rgba(138, 43, 226, 0.15)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                borderBottomRightRadius: isMe ? 4 : 'var(--radius-lg)',
                borderBottomLeftRadius: !isMe ? 4 : 'var(--radius-lg)',
                border: isMe ? 'none' : '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: 11, color: isMe ? 'var(--color-accent)' : '#b180ff', marginBottom: 6, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {isMe ? 'Vos' : 'Asistente IA'} • {msg.date}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>{msg.text}</div>
              </div>
            );
          })}
          
          {isTyping && (
             <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(138, 43, 226, 0.1)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              borderBottomLeftRadius: 4,
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="dot-typing" style={{ animationDelay: '0s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: 16, borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-3)', display: 'flex', gap: 10 }}>
          <input className="form-input" placeholder="Preguntame qué comer..." value={inputMsg} onChange={e => setInputMsg(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }} style={{ borderRadius: 'var(--radius-full)', paddingLeft: 20 }} />
          <button className="btn btn-primary" onClick={handleSend} disabled={!inputMsg.trim() || isTyping} style={{ borderRadius: 'var(--radius-full)', padding: '0 20px' }}>
            Enviar
          </button>
        </div>
      </div>
    </ClientLayout>
  );
}
