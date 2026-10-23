import React, { useState } from 'react';
import { 
  Mail, Lock, User, GraduationCap, ArrowRight, 
  CheckCircle, ShieldCheck, X, Sparkles, LogIn, UserPlus,
  Database, AlertCircle, RefreshCw
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { UNIVERSITIES, ALL_SKILLS } from '../data/mockData';
import { authSignIn, authSignUp } from '../services/dataService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSupabaseConfig,
  theme = 'dark'
}) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState(UNIVERSITIES[0].name);
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGpa] = useState('3.8');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Python']);
  const [expectation, setExpectation] = useState('High Distinction (HD)');
  const [availability, setAvailability] = useState('8 hours / week');
  const [workingStyle, setWorkingStyle] = useState('Proactive Communicator');
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isDark = theme === 'dark';
  const isDbConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        }
        const user = await authSignIn(email.trim(), password);
        onLoginSuccess(user);
        onClose();
      } else {
        // Register mode
        if (!email.trim() || !password) {
          throw new Error('Vui lòng nhập Email và Mật khẩu.');
        }
        if (password.length < 6) {
          throw new Error('Mật khẩu cần tối thiểu 6 ký tự.');
        }
        if (!fullName.trim()) {
          throw new Error('Vui lòng nhập Họ và tên sinh viên.');
        }

        const uniObj = UNIVERSITIES.find((u) => u.name === university) || UNIVERSITIES[0];
        const newProfileData = {
          name: fullName.trim(),
          email: email.trim(),
          university: university,
          uniShort: uniObj.short,
          studentId: studentId.trim() || `${Math.floor(20210000 + Math.random() * 80000)}`,
          major: major.trim() || 'Công nghệ thông tin',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80`,
          gpa: parseFloat(gpa) || 3.5,
          maxGpa: 4.0,
          gpaVerified: true,
          gpaConsentAgreed: agreedPrivacy,
          skills: selectedSkills.length > 0 ? selectedSkills : ['React', 'Python'],
          primarySkillCategory: 'Coding & Tech',
          expectation: expectation,
          targetScore: 'HD',
          availability: availability,
          scheduleDetail: 'Tối thứ 2 - 6 và cuối tuần',
          workingStyle: workingStyle,
          workingStyleTraits: ['Agile Sprints', 'Giao tiếp chủ động'],
          awards: ['Học bổng Sinh viên Xuất sắc'],
          bio: `Chào mọi người! Mình là ${fullName.trim()} (${uniObj.short}), rất vui được kết nối cùng các bạn làm đồ án và tham gia cuộc thi.`,
          radarScores: { skills: 88, schedule: 90, style: 85, goals: 95 },
          creditScore: 98,
          rating: 5.0,
          reviewCount: 0,
          completedProjectsCount: 0,
          completionRate: 100,
          likesGiven: [],
          isSeeking: true
        };

        const registeredUser = await authSignUp({
          email: email.trim(),
          password,
          profileData: newProfileData
        });

        onLoginSuccess(registeredUser);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 11, 16, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: authMode === 'register' ? '540px' : '440px',
          maxHeight: '92vh',
          background: isDark ? '#1C1D27' : '#FFFFFF',
          borderRadius: '28px',
          border: isDark ? '1px solid rgba(188, 238, 38, 0.25)' : '1px solid #CBD5E1',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(140, 114, 255, 0.15)',
          padding: '24px 26px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <BrandLogo size={32} layout="stacked" theme={theme} />
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Hệ thống tài khoản sinh viên TeamWeaver
          </p>
        </div>

        {/* Auth Mode Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: isDark ? '#262734' : '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'login' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
              color: authMode === 'login' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={14} />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'register' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
              color: authMode === 'register' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={14} />
            <span>Đăng ký tài khoản</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#F87171',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} style={{ overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
          {authMode === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '5px' }}>
                  Email sinh viên hoặc Email cá nhân:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="vidu@sis.hust.edu.vn hoặc user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '11px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '5px' }}>
                  Mật khẩu:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Lock size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '11px' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                  Họ và tên sinh viên:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <User size={15} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '11px', left: '11px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '12.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    Mật khẩu:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '12.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                  Trường Đại học:
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#141520' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.short})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    Chuyên ngành:
                  </label>
                  <input
                    type="text"
                    placeholder="Khoa học máy tính"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    MSSV:
                  </label>
                  <input
                    type="text"
                    placeholder="20224589"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    GPA:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
                  Kỹ năng sở trường (Chọn các thẻ):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '90px', overflowY: 'auto' }}>
                  {ALL_SKILLS.slice(0, 10).map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: isSelected ? '1px solid #BCEE26' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1'),
                          background: isSelected ? 'rgba(188, 238, 38, 0.15)' : 'transparent',
                          color: isSelected ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#94A3B8' : '#475569'),
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected && '✓ '} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-interactive"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: isDark ? '#BCEE26' : '#8C64FF',
              color: isDark ? '#141824' : '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: isDark ? '0 4px 14px rgba(188, 238, 38, 0.25)' : '0 4px 14px rgba(140, 100, 255, 0.25)'
            }}
          >
            {isLoading ? (
              <RefreshCw size={16} className="spin-anim" />
            ) : (
              <ArrowRight size={16} />
            )}
            <span>
              {isLoading
                ? 'Đang xử lý...'
                : authMode === 'login'
                ? 'Đăng Nhập Ngay'
                : 'Tạo Tài Khoản Sinh Viên'}
            </span>
          </button>
        </form>

        {/* Database Status & Quick Setup Link */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isDbConfigured ? '#10B981' : '#F59E0B'
              }}
            />
            <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              CSDL Supabase: <strong>{isDbConfigured ? 'Đã kết nối Cloud' : 'Chế độ Local'}</strong>
            </span>
          </div>

          {onOpenSupabaseConfig && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSupabaseConfig();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3ECF8E',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px'
              }}
            >
              <Database size={13} />
              <span>Cài đặt Supabase</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
