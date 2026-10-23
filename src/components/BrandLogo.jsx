import React from 'react';

/**
 * TeamWeaver Brand Logo
 * Uses the official logo.jpg — 3D Möbius ribbon (lime + violet)
 * Drop-in replacement: same props API as before.
 */
export const BrandIcon = ({ size = 38, className = '' }) => {
  const height = size * 0.75;

  return (
    <img
      src="/logo.png"
      alt="TeamWeaver Logo"
      className={className}
      width={size}
      height={height}
      style={{
        width: size,
        height: height,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        // PNG with transparent background — renders cleanly on any bg
        mixBlendMode: 'normal'
      }}
      draggable={false}
    />
  );
};

export const BrandLogo = ({
  size = 32,
  layout = 'horizontal', // 'horizontal' | 'stacked' | 'icon-only'
  showTagline = true,
  className = '',
  theme = 'dark' // 'dark' | 'light'
}) => {
  if (layout === 'icon-only') {
    return <BrandIcon size={size} className={className} />;
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`brand-logo-container ${layout === 'stacked' ? 'brand-stacked' : 'brand-horizontal'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: layout === 'stacked' ? 'column' : 'row',
        gap: layout === 'stacked' ? '8px' : '10px',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Official Logo Image */}
      <div
        className="brand-icon-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <BrandIcon size={size} />
      </div>

      {/* Brand Typography */}
      <div
        className="brand-text-wrapper"
        style={{
          textAlign: layout === 'stacked' ? 'center' : 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          className="brand-title"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            fontSize: size * 0.72,
            letterSpacing: '-0.6px',
            lineHeight: 1.05,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1px'
          }}
        >
          {/* "Team" in Soft Navy/Charcoal (Light mode) or Soft Crisp Slate (Dark mode) */}
          <span
            style={{
              color: isDark ? '#EDF0F7' : '#141824',
              transition: 'color 0.2s ease'
            }}
          >
            Team
          </span>

          {/* "Weaver" in Brand Lime */}
          <span
            style={{
              color: '#B5F228',
              textShadow: isDark
                ? '0 0 18px rgba(181, 242, 40, 0.35)'
                : '0 1px 2px rgba(181, 242, 40, 0.25)',
              transition: 'color 0.2s ease'
            }}
          >
            Weaver
          </span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div
            className="brand-tagline"
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontSize: Math.max(size * 0.3, 11),
              fontWeight: 500,
              color: isDark ? '#9DA6B8' : '#3E4554',
              letterSpacing: '-0.1px',
              marginTop: '2px',
              lineHeight: 1.2
            }}
          >
            Weave Your Dream Team.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
