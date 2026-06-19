/**
 * @file Loader component with green spinner matching AV Fitness design.
 *       Supports fullPage (centered overlay), inline, and sm/md/lg sizes.
 */
import React from 'react';

/**
 * Reusable loading spinner with green accent color.
 *
 * @param {Object} props
 * @param {boolean} [props.fullPage=false] — Render as centered full-page overlay
 * @param {string}  [props.text]           — Optional loading text below spinner
 * @param {string}  [props.size='md']      — Spinner size: 'sm' (20px), 'md' (32px), 'lg' (48px)
 * @param {boolean} [props.inline=false]   — Render inline with centered flex row
 * @returns {JSX.Element}
 */
export default function Loader({ fullPage = false, text, size = 'md', inline = false }) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const px = sizeMap[size] || sizeMap.md;
  const border = Math.max(3, px / 8);

  const spinner = (
    <div
      className="loader-spinner"
      style={{
        width: px,
        height: px,
        border: `${border}px solid rgba(0,255,0,0.15)`,
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );

  if (inline) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '24px 0' }}>
        {spinner}
        {text && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-2)' }}>{text}</span>}
      </div>
    );
  }

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--color-bg)',
      }}>
        {spinner}
        {text && <span style={{ fontFamily: 'var(--font-main)', fontSize: 15, color: 'var(--color-text-2)' }}>{text}</span>}
      </div>
    );
  }

  return spinner;
}
