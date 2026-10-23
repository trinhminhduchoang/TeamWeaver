import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageSquare, Users, Sparkles, X, ArrowRight } from 'lucide-react';
import { BrandIcon } from './BrandLogo';

export const MatchCelebrationModal = ({
  currentUser,
  matchedStudent,
  onClose,
  onStartChat,
  onCreateTeam,
  theme = 'dark'
}) => {
  if (!matchedStudent) return null;

  // Trigger celebratory confetti on mount
  useEffect(() => {
    // Custom brand confetti with Neon Lime and Soft Violet
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#D6FF3F', '#8C72FF', '#FFFFFF', '#A88DFF']
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className="match-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 11, 16, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="match-modal-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: isDark
            ? 'linear-gradient(180deg, #1E1F2A 0%, #161720 100%)'
            : '#FFFFFF',
          borderRadius: '32px',
          border: '1px solid rgba(214, 255, 63, 0.25)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(140, 114, 255, 0.25)',
          padding: '36px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(214, 255, 63, 0.2) 0%, rgba(140, 114, 255, 0.15) 60%, transparent 100%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title & Sparkles */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#D6FF3F" />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#D6FF3F'
            }}
          >
            Mutual Match
          </span>
          <Sparkles size={20} color="#D6FF3F" />
        </div>

        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-1px',
            margin: '0 0 10px',
            color: isDark ? '#FFFFFF' : '#1A1A1A'
          }}
        >
          It's a Match!
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: isDark ? '#CBD5E1' : '#64748B',
            marginBottom: '32px'
          }}
        >
          Two minds. One goal. You both swiped right on each other!
        </p>

        {/* Dual Avatars with Center Infinity Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
            position: 'relative'
          }}
        >
          {/* User Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'}
              alt={currentUser?.name || 'You'}
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #8C72FF',
                boxShadow: '0 8px 24px rgba(140, 114, 255, 0.4)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#8C72FF',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                whiteSpace: 'nowrap'
              }}
            >
              Bạn ({currentUser?.name?.split(' ')[0] || 'You'})
            </div>
          </div>

          {/* Infinity Weave Connector */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#292A35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(214, 255, 63, 0.5)',
              boxShadow: '0 0 20px rgba(214, 255, 63, 0.4)',
              zIndex: 2,
              animation: 'pulseGlow 2s infinite'
            }}
          >
            <BrandIcon size={32} />
          </div>

          {/* Matched Teammate Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={matchedStudent.avatar}
              alt={matchedStudent.name}
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #D6FF3F',
                boxShadow: '0 8px 24px rgba(214, 255, 63, 0.4)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#D6FF3F',
                color: '#1A1A1A',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                whiteSpace: 'nowrap'
              }}
            >
              {matchedStudent.name.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Complementary Skills Highlight Banner */}
        <div
          style={{
            background: isDark ? 'rgba(214, 255, 63, 0.08)' : 'rgba(214, 255, 63, 0.2)',
            border: '1px solid rgba(214, 255, 63, 0.3)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '28px'
          }}
        >
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: isDark ? '#F1F5F9' : '#1E293B',
              margin: '0 0 6px'
            }}
          >
            ✨ You and {matchedStudent.name} have complementary skills!
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {matchedStudent.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                  color: isDark ? '#D6FF3F' : '#334155',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '20px'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onStartChat(matchedStudent);
              onClose();
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '999px',
              background: '#D6FF3F',
              color: '#1A1A1A',
              border: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(214, 255, 63, 0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            <MessageSquare size={18} />
            <span>Start Chat & Connect</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => {
              onCreateTeam(matchedStudent);
              onClose();
            }}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '999px',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              color: isDark ? '#FFFFFF' : '#1A1A1A',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <Users size={16} />
            <span>Invite into Team Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCelebrationModal;
