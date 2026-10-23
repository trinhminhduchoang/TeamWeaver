import React from 'react';

/**
 * CompatibilityRadar - SVG 4-axis radar chart
 * Axes: Skills, Schedule, Work Style, Goals
 */
export const CompatibilityRadar = ({
  userScores = { skills: 85, schedule: 80, style: 90, goals: 90 },
  candidateScores = { skills: 92, schedule: 85, style: 88, goals: 95 },
  overallScore = 88,
  size = 260,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const center = size / 2;
  const radius = size * 0.38;

  // 4 axes: Top = Skills (270 deg), Right = Schedule (0 deg), Bottom = Goals (90 deg), Left = Work Style (180 deg)
  const axes = [
    { key: 'skills', label: 'Skills', angle: -Math.PI / 2, subtext: 'Kỹ năng chuyên môn' },
    { key: 'schedule', label: 'Schedule', angle: 0, subtext: 'Lịch rảnh & Cam kết' },
    { key: 'goals', label: 'Goals', angle: Math.PI / 2, subtext: 'Mục tiêu điểm số' },
    { key: 'style', label: 'Work Style', angle: Math.PI, subtext: 'Phong cách làm việc' },
  ];

  const getCoordinates = (value, angle) => {
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build polygon path string for a score object
  const buildPath = (scores) => {
    return axes
      .map((axis) => {
        const val = Math.min(100, Math.max(20, scores[axis.key] || 75));
        const coords = getCoordinates(val, axis.angle);
        return `${coords.x},${coords.y}`;
      })
      .join(' ');
  };

  const userPolygon = buildPath(userScores);
  const candidatePolygon = buildPath(candidateScores);

  return (
    <div className="compatibility-radar-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D6FF3F" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8C72FF" stopOpacity="0.02" />
            </radialGradient>
            <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8C72FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8C72FF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="candidateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D6FF3F" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D6FF3F" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Background web concentric circles */}
          {[0.25, 0.5, 0.75, 1].map((level, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius * level}
              fill={level === 1 ? 'url(#radarCenterGlow)' : 'none'}
              stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
              strokeDasharray={level === 1 ? 'none' : '3 3'}
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {axes.map((axis, i) => {
            const end = getCoordinates(100, axis.angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke={isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth="1.2"
              />
            );
          })}

          {/* User polygon (Soft Violet) */}
          <polygon
            points={userPolygon}
            fill="url(#userGrad)"
            stroke="#8C72FF"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Teammate polygon (Neon Lime) */}
          <polygon
            points={candidatePolygon}
            fill="url(#candidateGrad)"
            stroke="#D6FF3F"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Corner points */}
          {axes.map((axis, i) => {
            const cUser = getCoordinates(userScores[axis.key] || 80, axis.angle);
            const cCand = getCoordinates(candidateScores[axis.key] || 85, axis.angle);
            return (
              <g key={i}>
                <circle cx={cUser.x} cy={cUser.y} r="3.5" fill="#8C72FF" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx={cCand.x} cy={cCand.y} r="4" fill="#D6FF3F" stroke="#1A1A1A" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>

        {/* Center Compatibility Score Badge */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: isDark ? 'rgba(34, 35, 46, 0.95)' : '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(214, 255, 63, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px',
              fontWeight: 800,
              color: isDark ? '#D6FF3F' : '#1A1A1A',
              lineHeight: 1
            }}
          >
            {overallScore}%
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              marginTop: '2px'
            }}
          >
            Match
          </span>
        </div>

        {/* Axis Labels */}
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>Skills</span>
        </div>
        <div style={{ position: 'absolute', top: '50%', right: 4, transform: 'translateY(-50%)', textAlign: 'right', pointerEvents: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>Schedule</span>
        </div>
        <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>Goals</span>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: 4, transform: 'translateY(-50%)', textAlign: 'left', pointerEvents: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>Work Style</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8C72FF', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#CBD5E1' : '#475569' }}>Bạn (You)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D6FF3F', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>Đồng đội (Teammate)</span>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityRadar;
