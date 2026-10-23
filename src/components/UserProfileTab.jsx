import React from 'react';
import { 
  ShieldCheck, Clock, Target, Flame, 
  Award, Edit3, LogOut, GraduationCap, Briefcase,
  Star, Mail, Phone, Database, CheckCircle, Globe, ExternalLink
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const UserProfileTab = ({
  currentUser,
  onOpenEdit,
  onOpenAuth,
  onOpenGpaConsent,
  onOpenSupabaseConfig,
  onSignOut,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const isDbConnected = isSupabaseConfigured();

  const creditScore = currentUser?.creditScore || 98;
  const rating = currentUser?.rating || 5.0;
  const reviewCount = currentUser?.reviews?.length || currentUser?.reviewCount || 0;
  const completionRate = currentUser?.completionRate || 100;
  const completedProjects = currentUser?.completedProjectsCount || 0;

  return (
    <div
      className="user-profile-tab tab-view-container"
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: '30px'
      }}
    >
      {/* Top Profile Card */}
      <div
        style={{
          background: isDark ? '#212330' : '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 8px 25px rgba(0, 0, 0, 0.06)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={currentUser?.name}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '24px',
                objectFit: 'cover',
                border: '3px solid #BCEE26',
                boxShadow: '0 6px 18px rgba(188, 238, 38, 0.25)'
              }}
            />
            {currentUser?.gpaVerified && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  background: '#BCEE26',
                  color: '#141824',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isDark ? '2px solid #212330' : '2px solid #FFFFFF'
                }}
                title="GPA đã xác thực chính thức"
              >
                <ShieldCheck size={14} />
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 800,
                    color: isDark ? '#E2E5EE' : '#2D323E',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {currentUser?.name}
                </h2>
                <span
                  style={{
                    background: currentUser?.role === 'developer' ? '#BCEE26' : (isDark ? 'rgba(140, 100, 255, 0.15)' : '#EDE9FE'),
                    color: currentUser?.role === 'developer' ? '#141824' : '#8C64FF',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {currentUser?.role === 'developer' ? 'NHÀ PHÁT TRIỂN' : 'SINH VIÊN'}
                </span>
                <span
                  style={{
                    background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#DCFCE7',
                    color: isDark ? '#BCEE26' : '#15803D',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  GPA {currentUser?.gpa || '3.8'}/4.0
                </span>
              </div>

              <button
                onClick={onOpenEdit}
                className="btn-interactive"
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                  color: isDark ? '#E2E5EE' : '#2D323E',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#9AA3B8' : '#647087', fontSize: '13px', marginTop: '6px' }}>
              <GraduationCap size={15} color="#8C64FF" />
              <span>{currentUser?.university} (MSSV: {currentUser?.studentId || 'Chưa cập nhật'})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#BCEE26' : '#6D28D9', fontSize: '12.5px', fontWeight: 600, marginTop: '3px' }}>
              <Briefcase size={14} />
              <span>{currentUser?.major}</span>
            </div>

            {/* Contact details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
              {currentUser?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} color="#8C64FF" />
                  <span>{currentUser.email}</span>
                </div>
              )}
              {currentUser?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} color="#10B981" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser?.githubUrl && (
                <a
                  href={currentUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDark ? '#BCEE26' : '#2563EB', textDecoration: 'none' }}
                >
                  <Globe size={13} />
                  <span>Github / Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ margin: '16px 0 0', fontSize: '13.5px', lineHeight: 1.5, color: isDark ? '#CBD5E1' : '#475569', fontStyle: 'italic', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9', paddingTop: '12px' }}>
          "{currentUser?.bio || 'Chưa có lời giới thiệu.'}"
        </p>
      </div>

      {/* Credit & Peer Reviews Card */}
      <div
        style={{
          background: isDark ? '#212330' : '#FFFFFF',
          borderRadius: '22px',
          padding: '20px',
          border: isDark ? '1px solid rgba(188, 238, 38, 0.22)' : '1px solid #E2E8F0',
          boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.25)' : '0 8px 25px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: isDark ? 'rgba(188, 238, 38, 0.15)' : '#DCFCE7',
                color: isDark ? '#BCEE26' : '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                Hồ Sơ Tín Nhiệm & Credit Làm Việc
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087' }}>
                Điểm uy tín tích lũy từ các lần hợp tác nhóm thực tế trên TeamWeaver
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: isDark ? '#BCEE26' : '#15803D', lineHeight: 1 }}>
              {creditScore}<span style={{ fontSize: '14px', color: isDark ? '#9AA3B8' : '#647087' }}>/100</span>
            </div>
            <div style={{ fontSize: '10.5px', color: isDark ? '#9AA3B8' : '#647087', fontWeight: 600 }}>
              Credit Score
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div
            style={{
              background: isDark ? '#181924' : '#F8FAFC',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
              {rating.toFixed(1)} ⭐
            </div>
            <div style={{ fontSize: '10.5px', color: isDark ? '#9AA3B8' : '#64748B', marginTop: '2px' }}>
              {reviewCount} đánh giá
            </div>
          </div>

          <div
            style={{
              background: isDark ? '#181924' : '#F8FAFC',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981' }}>
              {completionRate}%
            </div>
            <div style={{ fontSize: '10.5px', color: isDark ? '#9AA3B8' : '#64748B', marginTop: '2px' }}>
              Đúng Deadline
            </div>
          </div>

          <div
            style={{
              background: isDark ? '#181924' : '#F8FAFC',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#8C64FF' }}>
              {completedProjects}
            </div>
            <div style={{ fontSize: '10.5px', color: isDark ? '#9AA3B8' : '#64748B', marginTop: '2px' }}>
              Dự án hoàn thành
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div
        style={{
          background: isDark ? '#212330' : '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 20px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
        }}
      >
        <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
          Kỹ năng & Chuyên môn sở trường
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {currentUser?.skills?.map((skill, i) => (
            <span
              key={i}
              style={{
                background: isDark ? 'rgba(188, 238, 38, 0.1)' : '#F0FDF4',
                border: isDark ? '1px solid rgba(188, 238, 38, 0.25)' : '1px solid #BBF7D0',
                color: isDark ? '#BCEE26' : '#15803D',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Goal, Availability & Style Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div
          style={{
            background: isDark ? '#212330' : '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8C64FF', marginBottom: '6px' }}>
            <Target size={15} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Mục tiêu học tập</span>
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
            {currentUser?.expectation || 'High Distinction (HD)'}
          </div>
        </div>

        <div
          style={{
            background: isDark ? '#212330' : '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#BCEE26' : '#15803D', marginBottom: '6px' }}>
            <Flame size={15} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Phong cách</span>
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
            {currentUser?.workingStyle || 'Proactive Communicator'}
          </div>
        </div>
      </div>

      <div
        style={{
          background: isDark ? '#212330' : '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', marginBottom: '6px' }}>
          <Clock size={15} />
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Thời gian cam kết</span>
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
          {currentUser?.availability || '8 hours / week'} ({currentUser?.scheduleDetail || 'Linh hoạt'})
        </div>
      </div>

      {/* Awards section if exists */}
      {currentUser?.awards && currentUser.awards.length > 0 && (
        <div
          style={{
            background: isDark ? '#212330' : '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
          }}
        >
          <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#2D323E' }}>
            🏆 Giải thưởng & Chứng nhận:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentUser.awards.map((aw, idx) => (
              <div key={idx} style={{ fontSize: '12.5px', color: isDark ? '#CBD5E1' : '#475569' }}>
                • {aw}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Management & Sign Out Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
        {currentUser?.role === 'developer' && onOpenSupabaseConfig && (
          <button
            onClick={onOpenSupabaseConfig}
            className="btn-interactive"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4',
              border: isDark ? '1px solid rgba(188, 238, 38, 0.35)' : '1px solid #BBF7D0',
              color: isDark ? '#BCEE26' : '#15803D',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Database size={15} />
            <span>Bảng Quản Trị CSDL Dev ({isDbConnected ? 'Đã kết nối' : 'Cấu hình'})</span>
          </button>
        )}

        <button
          onClick={onSignOut || onOpenAuth}
          className="btn-interactive"
          style={{
            padding: '12px 18px',
            borderRadius: '14px',
            background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={15} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileTab;
