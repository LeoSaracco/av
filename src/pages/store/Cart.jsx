import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const EMOJIS = { 'Ropa': '👕', 'Suplementos': '💊', 'Accesorios': '🏋️' };

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal } = useApp();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setChecked(true);
  };

  if (checked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, background: 'var(--color-bg)' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--color-accent-dim)', color: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
          border: '2px solid var(--color-accent)',
        }}>✓</div>
        <h2 style={{ fontSize: 24, fontFamily: 'var(--font-main)' }}>¡Pedido confirmado!</h2>
        <p style={{ color: 'var(--color-text-2)', textAlign: 'center', maxWidth: 340, fontSize: 14, lineHeight: 1.6 }}>
          Esto es una demo. En un sistema real, acá procesaríamos el pago y enviaríamos la confirmación por email.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => navigate('/store')}>Seguir comprando</button>
          <button className="btn btn-ghost" onClick={() => navigate(-2)}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <button onClick={() => navigate('/store')} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', fontSize: 13 }}>
          ← Seguir comprando
        </button>
        <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700 }}>Carrito</span>
        <div style={{ width: 100 }} />
      </nav>

      <div className="container" style={{ padding: '28px 20px 60px', maxWidth: 680 }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Tu carrito {cart.length > 0 && `(${cart.length})`}</h1>

        {cart.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 56 }}>🛒</span>
            <h3>Tu carrito está vacío</h3>
            <p>Explorá la tienda y agregá productos</p>
            <button className="btn btn-primary" onClick={() => navigate('/store')}>Ir a la tienda</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {cart.map(item => (
              <div key={item.key} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: 'var(--color-bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>
                  {EMOJIS[item.product.category] || '📦'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>
                    {[item.size, item.color, item.flavor].filter(Boolean).join(' · ') || item.product.category}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 700, marginTop: 4 }}>
                    ${(item.product.price * item.qty).toLocaleString('es-AR')}
                  </div>
                </div>

                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateCartQty(item.key, item.qty - 1)}
                    style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer', fontSize: 14 }}>
                    −
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.key, item.qty + 1)}
                    style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer', fontSize: 14 }}>
                    +
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.key)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: '4px 8px', fontSize: 16 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="card" style={{ gap: 16 }}>
            <h3 style={{ fontSize: 16 }}>Resumen del pedido</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cart.map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-2)' }}>
                  <span>{item.product.name} × {item.qty}</span>
                  <span>${(item.product.price * item.qty).toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontFamily: 'var(--font-main)', fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-accent)' }}>${cartTotal.toLocaleString('es-AR')}</span>
            </div>

            <div style={{ background: 'rgba(0,255,0,0.05)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 12, color: 'var(--color-accent)' }}>
              ✓ Demo — No se realizará ningún cargo real
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} onClick={handleCheckout}>
              Confirmar pedido (Demo) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
