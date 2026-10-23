import React, { useState, useRef } from 'react';
import { 
  Heart, X, Star, ShieldCheck, Clock, 
  GraduationCap, Info, RotateCcw, Check, Search, Undo2, Award
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/mockData';

export const DiscoverSwipe = ({
  students = [],
  currentUser,
  onLike,
  onPass,
  onSuperlike,
  onViewDetails,
  theme = 'dark'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUni, setSelectedUni] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right' | 'up' | null
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]); // for undo/rewind
  const startPosRef = useRef({ x: 0, y: 0 });

  const isDark = theme === 'dark';

  // Filter students
  const availableStudents = students.filter((s) => {
    if (s.id === currentUser?.id) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchMajor = s.major.toLowerCase().includes(q);
      const matchSkills = s.skills.some((sk) => sk.toLowerCase().includes(q));
      if (!matchName && !matchMajor && !matchSkills) return false;
    }

    // University filter
    if (selectedUni !== 'All' && s.uniShort !== selectedUni) {
      return false;
    }

    // Category filter
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Coding & Tech') {
      return s.skills.some((sk) => ['React', 'Python', 'Node.js', 'AI/ML', 'Cloud'].includes(sk));
    }
    if (selectedCategory === 'Design & UI/UX') {
      return s.skills.some((sk) => ['Figma', 'UI/UX Design', 'Canva', 'Graphic Design'].includes(sk));
    }
    if (selectedCategory === 'Marketing & Growth') {
      return s.skills.some((sk) => ['Marketing', 'Content Creation', 'Market Research'].includes(sk));
    }
    if (selectedCategory === 'Finance & Business') {
      return s.skills.some((sk) => ['Financial Modeling', 'Pitching & Presentation', 'Business Strategy'].includes(sk));
    }
    return true;
  });

  const currentStudent = availableStudents[currentIndex];
  const nextStudent = availableStudents[currentIndex + 1];

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches ? e.touches[0] : e;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 85) {
      triggerSwipe('right');
    } else if (dragOffset.x < -85) {
      triggerSwipe('left');
    } else if (dragOffset.y < -85) {
      triggerSwipe('up');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const triggerSwipe = (direction) => {
    if (!currentStudent) return;
    setSwipeDirection(direction);
    setHistory((prev) => [...prev, { student: currentStudent, direction, index: currentIndex }]);

    setTimeout(() => {
      if (direction === 'right') {
        onLike(currentStudent);
      } else if (direction === 'left') {
        onPass(currentStudent.id);
      } else if (direction === 'up') {
        onSuperlike(currentStudent);
      }
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setCurrentIndex((prev) => prev + 1);
    }, 280);
  };

  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setDragOffset({ x: 0, y: 0 });
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistory([]);
    setDragOffset({ x: 0, y: 0 });
  };

  // Fluid Card Physics & Visual Cues
  const dragProgress = Math.min(Math.abs(dragOffset.x) / 120, 1);
  const dragProgressY = Math.min(Math.max(-dragOffset.y, 0) / 120, 1);
  const rotation = dragOffset.x * 0.08;
  const opacity = Math.max(0.65, 1 - Math.abs(dragOffset.x) / 550);

  return (
    <div
      className="discover-swipe-container tab-view-container"
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Tìm theo kỹ năng, chuyên ngành..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '999px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
              background: isDark ? '#212330' : '#FFFFFF',
              color: isDark ? '#E2E5EE' : '#2D323E',
              fontSize: '12px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          />
          <Search size={14} color={isDark ? '#9AA3B8' : '#647087'} style={{ position: 'absolute', top: '10px', left: '11px' }} />
        </div>

        <select
          value={selectedUni}
          onChange={(e) => {
            setSelectedUni(e.target.value);
            setCurrentIndex(0);
          }}
          style={{
            padding: '8px 10px',
            borderRadius: '999px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
            background: isDark ? '#212330' : '#FFFFFF',
            color: isDark ? '#E2E5EE' : '#2D323E',
            fontSize: '11px',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="All">Tất cả trường</option>
          <option value="HUST">HUST</option>
          <option value="Swinburne">Swinburne</option>
          <option value="RMIT">RMIT</option>
          <option value="FTU">FTU</option>
          <option value="HCMUT">HCMUT</option>
        </select>
      </div>

      {/* Top Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 4px 10px', scrollbarWidth: 'none' }}>
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className="btn-interactive"
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: isSelected
                  ? (isDark ? '1px solid #BCEE26' : '1px solid #8C64FF')
                  : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                background: isSelected
                  ? (isDark ? '#BCEE26' : '#8C64FF')
                  : (isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF'),
                color: isSelected
                  ? (isDark ? '#141824' : '#FFFFFF')
                  : (isDark ? '#E2E5EE' : '#475569'),
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Card Deck Area with Under-card peek animation */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Next Card Background Layer (Peeking with smooth scale transition) */}
        {nextStudent && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              maxHeight: '520px',
              borderRadius: '26px',
              overflow: 'hidden',
              background: isDark ? '#1C1D2A' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0',
              transform: `scale(${0.95 + dragProgress * 0.05}) translateY(${8 - dragProgress * 8}px)`,
              opacity: 0.65 + dragProgress * 0.35,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <img
              src={nextStudent.avatar}
              alt={nextStudent.name}
              style={{ width: '100%', height: '58%', objectFit: 'cover', opacity: 0.5 }}
            />
          </div>
        )}

        {/* Current Active Top Card */}
        {currentStudent ? (
          <div
            className="swipe-card-wrapper"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxHeight: '520px',
              userSelect: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 2,
              transform: swipeDirection === 'right'
                ? 'translateX(120%) rotate(22deg)'
                : swipeDirection === 'left'
                ? 'translateX(-120%) rotate(-22deg)'
                : swipeDirection === 'up'
                ? 'translateY(-120%) scale(0.92)'
                : `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.45}px, 0) rotate(${rotation}deg)`,
              opacity: swipeDirection ? 0 : opacity,
              transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease'
            }}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Student Card Container */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '26px',
                overflow: 'hidden',
                position: 'relative',
                background: isDark ? '#212330' : '#FFFFFF',
                boxShadow: isDark
                  ? '0 18px 45px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                  : '0 18px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Photo & Overlays */}
              <div style={{ position: 'relative', width: '100%', height: '56%', overflow: 'hidden' }}>
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Gradient overlay for soft text legibility */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(15,16,24,0.15) 0%, rgba(15,16,24,0.88) 100%)'
                  }}
                />

                {/* Top Badges: University & GPA Verified */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      background: 'rgba(24, 25, 36, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#E2E5EE',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <GraduationCap size={13} color="#BCEE26" />
                    <span>{currentStudent.uniShort}</span>
                  </div>

                  {currentStudent.gpaVerified && (
                    <div
                      style={{
                        background: 'rgba(188, 238, 38, 0.95)',
                        color: '#141824',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 4px 12px rgba(188, 238, 38, 0.3)'
                      }}
                    >
                      <ShieldCheck size={14} />
                      <span>GPA {currentStudent.gpa} (Verified)</span>
                    </div>
                  )}
                </div>

                {/* Name, Major, and Requirement 1: Credit & Rating Badge */}
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {currentStudent.name}, {currentStudent.age}
                    </h2>

                    {/* Requirement 1: Credit score pill */}
                    <div
                      style={{
                        background: 'rgba(188, 238, 38, 0.2)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #BCEE26',
                        color: '#BCEE26',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Điểm Tín Nhiệm Hợp Tác"
                    >
                      <Award size={13} />
                      <span>Credit {currentStudent.creditScore || 96}</span>
                    </div>
                  </div>

                  <p style={{ margin: '2px 0 0', color: '#BCEE26', fontSize: '13px', fontWeight: 600 }}>
                    {currentStudent.major}
                  </p>
                </div>

                {/* Dynamic Stamp Indicators during Drag (Smooth Fade & Spring) */}
                {dragOffset.x > 30 && (
                  <div
                    className="stamp-active"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: '18px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '3px solid #BCEE26',
                      color: '#BCEE26',
                      background: 'rgba(20, 22, 32, 0.8)',
                      fontSize: '20px',
                      fontWeight: 800,
                      transform: 'rotate(-12deg)',
                      letterSpacing: '1px',
                      opacity: dragProgress,
                      boxShadow: '0 8px 24px rgba(188, 238, 38, 0.3)'
                    }}
                  >
                    MATCH 💜
                  </div>
                )}
                {dragOffset.x < -30 && (
                  <div
                    className="stamp-active"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      right: '18px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '3px solid #EF4444',
                      color: '#EF4444',
                      background: 'rgba(20, 22, 32, 0.8)',
                      fontSize: '20px',
                      fontWeight: 800,
                      transform: 'rotate(12deg)',
                      letterSpacing: '1px',
                      opacity: dragProgress,
                      boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    PASS ❌
                  </div>
                )}
                {dragOffset.y < -30 && Math.abs(dragOffset.x) < 40 && (
                  <div
                    className="stamp-active"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(-4deg)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '3px solid #FBBF24',
                      color: '#FBBF24',
                      background: 'rgba(20, 22, 32, 0.85)',
                      fontSize: '18px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      opacity: dragProgressY,
                      boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    SUPERLIKE ⭐
                  </div>
                )}
              </div>

              {/* Card Body Information */}
              <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Requirement 1: Peer Review & Credit Highlights Pill */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(currentStudent);
                    }}
                    className="btn-interactive"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={13} fill="#FBBF24" color="#FBBF24" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                        {currentStudent.rating || 4.9} ({currentStudent.reviewCount || 12} đánh giá)
                      </span>
                      <span style={{ fontSize: '11px', color: isDark ? '#BCEE26' : '#15803D', fontWeight: 600 }}>
                        • {currentStudent.completionRate || 98}% đúng hạn
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', color: isDark ? '#8C64FF' : '#6D28D9', fontWeight: 700 }}>
                      Chi tiết →
                    </span>
                  </div>

                  {/* Skills Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                    {currentStudent.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                          color: isDark ? '#E2E5EE' : '#334155',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {currentStudent.skills.length > 4 && (
                      <span style={{ fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087', alignSelf: 'center' }}>
                        +{currentStudent.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Bio snippet */}
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: '12px',
                      lineHeight: 1.45,
                      color: isDark ? '#9AA3B8' : '#475569',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    "{currentStudent.bio}"
                  </p>
                </div>

                {/* Footer details: Commitment + View Compatibility */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087' }}>
                    <Clock size={12} color="#BCEE26" />
                    <span>{currentStudent.availability}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(currentStudent);
                    }}
                    className="btn-interactive"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#BCEE26' : '#6D28D9',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      padding: '4px 6px'
                    }}
                  >
                    <Info size={13} />
                    <span>Xem Hồ Sơ & Đánh Giá</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / All Profiles Reviewed State */
          <div
            style={{
              textAlign: 'center',
              padding: '36px 20px',
              background: isDark ? 'rgba(33, 35, 48, 0.7)' : '#FFFFFF',
              borderRadius: '24px',
              border: isDark ? '1px dashed rgba(255, 255, 255, 0.12)' : '1px dashed #CBD5E1',
              maxWidth: '360px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(188, 238, 38, 0.14)',
                color: '#BCEE26',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px'
              }}
            >
              <Check size={26} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
              {students.length <= 1 ? 'Chưa có thành viên nào khác' : 'Bạn đã xem hết hồ sơ phù hợp!'}
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: isDark ? '#9AA3B8' : '#647087', lineHeight: 1.45 }}>
              {students.length <= 1 
                ? 'Hãy mời các bạn trong nhóm cùng mở web và Đăng ký tài khoản để xuất hiện tại đây và bắt đầu ghép đôi nhé!'
                : 'Hãy đổi bộ lọc hoặc kiểm tra tab Matches & Chat để trò chuyện với những đồng đội đã ghép đôi.'}
            </p>
            <button
              onClick={handleResetDeck}
              className="btn-interactive"
              style={{
                padding: '9px 18px',
                borderRadius: '999px',
                background: isDark ? '#BCEE26' : '#8C64FF',
                border: 'none',
                color: isDark ? '#141824' : '#FFFFFF',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} />
              <span>Xem lại từ đầu</span>
            </button>
          </div>
        )}
      </div>

      {/* Swipe Action Controls (Rewind, Pass, Superlike, Match) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '12px 0 6px'
        }}
      >
        {/* Rewind / Undo Button */}
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          aria-label="Undo"
          title="Quay lại lượt trước"
          className="btn-interactive"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isDark ? '#212330' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
            color: isDark ? '#9AA3B8' : '#647087',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: history.length > 0 ? 'pointer' : 'default',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            opacity: history.length > 0 ? 1 : 0.4
          }}
        >
          <Undo2 size={17} />
        </button>

        {/* Pass Button */}
        <button
          onClick={() => triggerSwipe('left')}
          disabled={!currentStudent}
          aria-label="Pass"
          className="btn-interactive"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isDark ? '#212330' : '#FFFFFF',
            border: '2px solid rgba(239, 68, 68, 0.35)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentStudent ? 'pointer' : 'default',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            opacity: currentStudent ? 1 : 0.4
          }}
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        {/* Superlike Button */}
        <button
          onClick={() => triggerSwipe('up')}
          disabled={!currentStudent}
          aria-label="Superlike"
          className="btn-interactive"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isDark ? '#212330' : '#FFFFFF',
            border: '2px solid rgba(251, 191, 36, 0.35)',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentStudent ? 'pointer' : 'default',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            opacity: currentStudent ? 1 : 0.4
          }}
        >
          <Star size={20} fill="#FBBF24" />
        </button>

        {/* Interested / Match Button */}
        <button
          onClick={() => triggerSwipe('right')}
          disabled={!currentStudent}
          aria-label="Interested"
          className="btn-interactive"
          style={{
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            background: isDark
              ? 'linear-gradient(135deg, #BCEE26 0%, #8C64FF 100%)'
              : 'linear-gradient(135deg, #BCEE26 0%, #7C3AED 100%)',
            border: 'none',
            color: '#141824',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentStudent ? 'pointer' : 'default',
            boxShadow: '0 8px 22px rgba(188, 238, 38, 0.3)',
            opacity: currentStudent ? 1 : 0.4
          }}
        >
          <Heart size={26} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </div>
  );
};

export default DiscoverSwipe;
