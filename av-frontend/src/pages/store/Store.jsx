/**
 * @file Tienda oficial de Adrián Vila. Lista productos con filtros por
 *       categoría y búsqueda textual. Permite agregar al carrito y
 *       navegar al detalle de cada producto.
 * @route /store
 * @auth Público — no requiere autenticación.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NAV_HEIGHT = 64;

export default function Store() {
  const { products, addToCart, cartCount, loadProducts } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p =>
    (category === 'Todos' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const EMOJIS = { 'Ropa': '👕', 'Suplementos': '💊', 'Accesorios': '🏋️' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: NAV_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', fontSize: 13 }}>
          ← Volver
        </button>
        <span style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 18 }}>
          Adrián <span style={{ color: 'var(--color-accent)' }}>Vila</span> · Tienda
        </span>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/store/cart')} style={{ position: 'relative' }}>
          🛒 Carrito
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--color-accent)', color: '#000',
              width: 18, height: 18, borderRadius: '50%',
              fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</span>
          )}
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(0,255,0,0.07) 0%, transparent 70%)',
        padding: '40px 20px 32px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900, marginBottom: 8 }}>
          Tienda <span style={{ color: 'var(--color-accent)' }}>Oficial</span>
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
          Ropa fitness premium, suplementos y accesorios seleccionados por Adrián.
        </p>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tabs" style={{ flex: 1, minWidth: 240 }}>
            {categories.map(c => (
              <button key={c} className={`tab-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="search-bar" style={{ width: 220 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Products grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} className="product-card" onClick={() => navigate(`/store/${p.id}`)}>
              <div className="product-img">
                {EMOJIS[p.category] || '📦'}
              </div>
              <div className="product-info">
                <div className="product-category">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div className="product-price">${p.price.toLocaleString('es-AR')}</div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={e => { e.stopPropagation(); addToCart(p, {}); }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 48 }}>🔍</span>
            <h3>Sin resultados</h3>
            <p>Probá con otra categoría o búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
