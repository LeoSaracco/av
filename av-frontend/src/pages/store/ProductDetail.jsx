/**
 * @file Página de detalle de producto. Muestra información completa,
 *       selección de variantes (talle, color, sabor), botón de agregar
 *       al carrito y productos relacionados de la misma categoría.
 * @route /store/:id
 * @auth Público — no requiere autenticación.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Loader from '../../components/ui/Loader';

const EMOJIS = { 'Ropa': '👕', 'Suplementos': '💊', 'Accesorios': '🏋️' };

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, cartCount, loadProducts, productsLoaded } = useApp();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (!productsLoaded) return <Loader fullPage text="Cargando producto..." />;

  const product = products.find(p => p.id === id);

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state">
        <h3>Producto no encontrado</h3>
        <button className="btn btn-primary" onClick={() => navigate('/store')}>Volver a tienda</button>
      </div>
    </div>
  );

  const handleAdd = () => {
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      flavor: selectedFlavor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

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
          ← Volver a tienda
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/store/cart')} style={{ position: 'relative' }}>
          🛒 {cartCount > 0 ? `(${cartCount})` : 'Carrito'}
        </button>
      </nav>

      <div className="container" style={{ padding: '32px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          {/* Image */}
          <div style={{
            aspectRatio: '1', background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80,
          }}>
            {EMOJIS[product.category] || '📦'}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                {product.category}
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', lineHeight: 1.2 }}>{product.name}</h1>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-accent)', marginTop: 10 }}>
                ${product.price.toLocaleString('es-AR')}
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.8 }}>{product.description}</p>

            {/* Sizes */}
            {product.sizes && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Talle</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13,
                        border: `2px solid ${selectedSize === s ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: selectedSize === s ? 'var(--color-accent-dim)' : 'transparent',
                        color: selectedSize === s ? 'var(--color-accent)' : 'var(--color-text-2)',
                        cursor: 'pointer', transition: 'var(--transition)',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Color</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13,
                        border: `2px solid ${selectedColor === c ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: selectedColor === c ? 'var(--color-accent-dim)' : 'transparent',
                        color: selectedColor === c ? 'var(--color-accent)' : 'var(--color-text-2)',
                        cursor: 'pointer', transition: 'var(--transition)',
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {product.flavors && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Sabor</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.flavors.map(f => (
                    <button key={f} onClick={() => setSelectedFlavor(f)}
                      style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13,
                        border: `2px solid ${selectedFlavor === f ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: selectedFlavor === f ? 'var(--color-accent-dim)' : 'transparent',
                        color: selectedFlavor === f ? 'var(--color-accent)' : 'var(--color-text-2)',
                        cursor: 'pointer', transition: 'var(--transition)',
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', ...(added ? { background: '#00aa00' } : {}) }}
                onClick={handleAdd}
              >
                {added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/store/cart')}>
                Ver carrito
              </button>
            </div>

            <div style={{ display: 'flex', gap: 20, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              {[
                { icon: '🚚', text: 'Envío a todo el país' },
                { icon: '↩️', text: 'Devolución en 30 días' },
                { icon: '✅', text: 'Calidad garantizada' },
              ].map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-2)' }}>
                  <span>{f.icon}</span><span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>También te puede interesar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {related.map(p => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/store/${p.id}`)}>
                  <div className="product-img" style={{ fontSize: 40 }}>{EMOJIS[p.category] || '📦'}</div>
                  <div className="product-info">
                    <div className="product-name" style={{ fontSize: 13 }}>{p.name}</div>
                    <div className="product-price" style={{ fontSize: 15 }}>${p.price.toLocaleString('es-AR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
