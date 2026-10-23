import React, { useState } from 'react';
import { 
  X, ShieldCheck, Clock, Target, 
  Sparkles, Heart, ThumbsDown, GraduationCap, Briefcase,
  Star, PlusCircle
} from 'lucide-react';
import CompatibilityRadar from './CompatibilityRadar';

export const ProfileDetailModal = ({
  student,
  currentUser,
  onClose,
  onLike,
  onPass,
  onOpenReview,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'reviews' | 'compatibility'
  const isDark = theme === 'dark';

  if (!student) return null;

  // Calculate synergy score
  const synergyScore = student.radarScores 
    ? Math.round((student.radarScores.skills + student.radarScores.schedule + student.radarScores.style + student.radarScores.goals) / 4)
    : 88;

  const creditScore = student.creditScore || 96;
  const rating = student.rating || 4.9;
  const reviewCount = student.reviews?.length || student.reviewCount || 12;
  const completionRate = student.completionRate || 98;
  const completedProjects = student.completedProjectsCount || 4;

  return (
    <div
      className="modal-backdrop-anim"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 16, 24, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content-anim"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          background: isDark ? '#202230' : '#FFFFFF',
          borderRadius: '26px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isDark
            ? '0 25px 60px rgba(0, 0, 0, 0.5)'
            : '0 20px 50px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Tab Switcher & Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            background: isDark ? '#1C1D2A' : '#FAFBFC'
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)',
              padding: '3px',
              borderRadius: '12px',
              overflowX: 'auto'
            }}
          >
            <button
              onClick={() => setActiveTab('profile')}
              className="btn-interactive"
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'profile' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
                color: activeTab === 'profile' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              Hồ sơ
            </button>

            {/* Requirement 1: Credit & Reviews Tab */}
            <button
              onClick={() => setActiveTab('reviews')}
              className="btn-interactive"
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'reviews' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
                color: activeTab === 'reviews' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Star size={13} fill={activeTab === 'reviews' ? 'currentColor' : 'none'} />
              <span>Đánh giá & Tín nhiệm ({reviewCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className="btn-interactive"
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'compatibility' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
                color: activeTab === 'compatibility' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={13} />
              <span>Tương thích ({synergyScore}%)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn-interactive"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              color: isDark ? '#E2E5EE' : '#2D323E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* TAB 1: PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="tab-view-container">
              {/* Profile Header Card */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      border: '2px solid rgba(188, 238, 38, 0.5)'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#10B981',
                      border: isDark ? '2px solid #202230' : '2px solid #FFFFFF'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                      {student.name}, {student.age}
                    </h2>
                    {student.gpaVerified && (
                      <span
                        title="GPA Verified"
                        style={{
                          background: isDark ? 'rgba(188, 238, 38, 0.15)' : '#DCFCE7',
                          color: isDark ? '#BCEE26' : '#15803D',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ShieldCheck size={12} />
                        <span>GPA {student.gpa}</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#9AA3B8' : '#647087', fontSize: '13px', marginTop: '4px' }}>
                    <GraduationCap size={15} color="#8C64FF" />
                    <span>{student.university}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#BCEE26' : '#6D28D9', fontSize: '12.5px', fontWeight: 600, marginTop: '3px' }}>
                    <Briefcase size={14} />
                    <span>{student.major}</span>
                  </div>
                </div>
              </div>

              {/* Requirement 1: Credit & Rating Quick Strip */}
              <div
                style={{
                  background: isDark ? 'rgba(188, 238, 38, 0.08)' : '#F0FDF4',
                  border: isDark ? '1px solid rgba(188, 238, 38, 0.2)' : '1px solid #BBF7D0',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('reviews')}
                className="btn-interactive"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#FBBF24',
                      color: '#1C1917',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '12px'
                    }}
                  >
                    <Star size={13} fill="#1C1917" />
                    <span>{rating}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                      Điểm Tín Nhiệm Hợp Tác: <strong>{creditScore}/100</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087' }}>
                      {completionRate}% đúng hạn • {completedProjects} dự án nhóm thành công
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: isDark ? '#BCEE26' : '#15803D',
                    textDecoration: 'underline'
                  }}
                >
                  Xem {reviewCount} nhận xét →
                </span>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#9AA3B8' : '#647087', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Giới thiệu bản thân
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: isDark ? '#E2E5EE' : '#334155' }}>
                  {student.bio}
                </p>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#9AA3B8' : '#647087', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Kỹ năng chuyên môn
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {student.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                        color: isDark ? '#E2E5EE' : '#334155',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #E2E8F0'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target & Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', padding: '12px', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#BCEE26' : '#8C64FF', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    <Target size={14} />
                    <span>Mục tiêu điểm số</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                    {student.expectation}
                  </div>
                </div>

                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', padding: '12px', borderRadius: '14px', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#BCEE26' : '#8C64FF', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    <Clock size={14} />
                    <span>Thời gian rảnh</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                    {student.availability}
                  </div>
                </div>
              </div>

              {/* Working Style Traits */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#9AA3B8' : '#647087', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Phong cách làm việc ({student.workingStyle})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {student.workingStyleTraits?.map((trait, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(140, 100, 255, 0.12)' : 'rgba(140, 100, 255, 0.08)',
                        color: isDark ? '#C4B5FD' : '#6D28D9',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      ✓ {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS & COLLABORATION CREDITS (Requirement 1) */}
          {activeTab === 'reviews' && (
            <div className="tab-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Credit Metric Overview Card */}
              <div
                style={{
                  background: isDark ? 'linear-gradient(135deg, rgba(34, 36, 50, 0.9) 0%, rgba(24, 25, 36, 0.9) 100%)' : '#FFFFFF',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  border: isDark ? '1px solid rgba(188, 238, 38, 0.25)' : '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#9AA3B8' : '#647087', textTransform: 'uppercase' }}>
                      Điểm Uy Tín Hợp Tác
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#BCEE26' : '#15803D', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {creditScore}
                      </span>
                      <span style={{ fontSize: '14px', color: isDark ? '#9AA3B8' : '#647087' }}>/100 điểm tín nhiệm</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill="#FBBF24" color="#FBBF24" />
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E', marginTop: '4px' }}>
                      {rating} / 5.0 ({reviewCount} lượt đánh giá)
                    </div>
                  </div>
                </div>

                {/* Reliability Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: isDark ? '#9AA3B8' : '#647087', marginBottom: '6px' }}>
                    <span>Tỉ lệ hoàn thành nhiệm vụ đúng hạn:</span>
                    <strong style={{ color: isDark ? '#BCEE26' : '#15803D' }}>{completionRate}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${completionRate}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #8C64FF 0%, #BCEE26 100%)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Endorsements / Credit Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                    Huy Hiệu Tín Nhiệm Được Tặng
                  </div>
                  <button
                    onClick={() => onOpenReview && onOpenReview(student)}
                    className="btn-interactive"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#BCEE26' : '#6D28D9',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <PlusCircle size={13} />
                    <span>Viết đánh giá</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {student.endorsements?.map((end, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isDark ? '#E2E5EE' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{end.label}</span>
                      <span
                        style={{
                          background: isDark ? 'rgba(188, 238, 38, 0.15)' : '#E0E7FF',
                          color: isDark ? '#BCEE26' : '#4338CA',
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '6px'
                        }}
                      >
                        +{end.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peer Reviews List */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E', marginBottom: '10px' }}>
                  Nhận xét từ các đồng đội cũ ({student.reviews?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {student.reviews && student.reviews.length > 0 ? (
                    student.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                          borderRadius: '16px',
                          padding: '14px',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={rev.authorAvatar}
                              alt={rev.authorName}
                              style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                                {rev.authorName}
                              </div>
                              <div style={{ fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087' }}>
                                {rev.authorRole} • {rev.projectName}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={s <= rev.rating ? '#FBBF24' : 'none'}
                                color={s <= rev.rating ? '#FBBF24' : '#64748B'}
                              />
                            ))}
                          </div>
                        </div>

                        <p style={{ margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.5, color: isDark ? '#E2E5EE' : '#334155' }}>
                          "{rev.comment}"
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {rev.tags?.map((t, tidx) => (
                            <span
                              key={tidx}
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: '6px',
                                background: isDark ? 'rgba(188, 238, 38, 0.1)' : '#DCFCE7',
                                color: isDark ? '#BCEE26' : '#15803D'
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: isDark ? '#9AA3B8' : '#647087', fontSize: '13px' }}>
                      Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá bạn này sau khi hợp tác!
                    </div>
                  )}
                </div>
              </div>

              {/* Call to action button to review */}
              <button
                onClick={() => onOpenReview && onOpenReview(student)}
                className="btn-interactive"
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  background: isDark ? 'rgba(188, 238, 38, 0.12)' : 'rgba(140, 100, 255, 0.1)',
                  border: isDark ? '1px solid #BCEE26' : '1px solid #8C64FF',
                  color: isDark ? '#BCEE26' : '#6D28D9',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <PlusCircle size={15} />
                <span>Viết Đánh Giá & Tặng Credit Cho {student.name}</span>
              </button>
            </div>
          )}

          {/* TAB 3: COMPATIBILITY RADAR */}
          {activeTab === 'compatibility' && (
            <div className="tab-view-container" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                  Chỉ số tương thích đồng đội
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#9AA3B8' : '#647087' }}>
                  Phân tích 4 yếu tố then chốt tạo nên một nhóm sinh viên xuất sắc
                </p>
              </div>

              <CompatibilityRadar
                userScores={currentUser?.radarScores || { skills: 85, schedule: 80, style: 90, goals: 90 }}
                candidateScores={student.radarScores || { skills: 92, schedule: 85, style: 88, goals: 95 }}
                overallScore={synergyScore}
                theme={theme}
              />

              {/* Highlights analysis */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                <div style={{ background: isDark ? 'rgba(188, 238, 38, 0.08)' : '#F0FDF4', border: '1px solid rgba(188, 238, 38, 0.22)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#BCEE26' : '#15803D', marginBottom: '2px' }}>
                    ⚡ Kỹ năng bổ trợ lý tưởng ({student.radarScores?.skills || 90}%)
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#334155' }}>
                    Bạn và {student.name} có sự kết hợp hài hoà giữa kỹ năng kỹ thuật, thiết kế và kinh doanh. Không bị trùng chéo vai trò!
                  </div>
                </div>

                <div style={{ background: isDark ? 'rgba(140, 100, 255, 0.08)' : '#FAF5FF', border: '1px solid rgba(140, 100, 255, 0.22)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#C4B5FD' : '#7E22CE', marginBottom: '2px' }}>
                    🎯 Đồng điệu mục tiêu ({student.radarScores?.goals || 94}%)
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#334155' }}>
                    Cả hai đều nhắm tới điểm số tối đa ({student.targetScore}) và có mức độ cam kết cao trên 8 tiếng/tuần.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions: Pass and Match buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '14px 20px',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            background: isDark ? '#1C1D2A' : '#FAFBFC'
          }}
        >
          <button
            onClick={() => {
              onPass(student.id);
              onClose();
            }}
            className="btn-interactive"
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '999px',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
              color: isDark ? '#CBD5E1' : '#475569',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ThumbsDown size={15} />
            <span>Pass (Bỏ qua)</span>
          </button>

          <button
            onClick={() => {
              onLike(student);
              onClose();
            }}
            className="btn-interactive"
            style={{
              flex: 1.5,
              padding: '11px',
              borderRadius: '999px',
              background: isDark ? '#BCEE26' : '#8C64FF',
              border: 'none',
              color: isDark ? '#141824' : '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isDark
                ? '0 6px 20px rgba(188, 238, 38, 0.25)'
                : '0 6px 20px rgba(140, 100, 255, 0.25)'
            }}
          >
            <Heart size={16} fill="currentColor" />
            <span>Interested (Ghép đôi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;
