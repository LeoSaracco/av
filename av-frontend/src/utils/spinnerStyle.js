/**
 * Shared CSS-in-JS spinner style for use inside buttons and modals.
 * Black variant for green buttons, white variant for red danger buttons.
 *
 * @param {number} [size=16]   — spinner diameter in px
 * @param {string} [color='#000'] — border-top-color (the visible spinning arc)
 * @param {string} [bg='rgba(0,0,0,0.25)'] — base border color (the track)
 * @returns {Object} inline style object
 */
export function inlineSpinnerStyle(size = 16, color = '#000', bg = 'rgba(0,0,0,0.25)') {
  return {
    width: size,
    height: size,
    border: `2px solid ${bg}`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
}
