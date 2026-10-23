import React, { useState } from 'react';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, 
  ShieldCheck, ArrowRight, Sparkles, RefreshCw, AlertCircle,
  Code2, Check, Sun, Moon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { UNIVERSITIES, ALL_SKILLS } from '../data/mockData';
import { authSignIn, authSignUp } from '../services/dataService';

export const AuthView = ({
  onAuthSuccess,
  theme = 'dark',
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'developer'
  const [developerPin, setDeveloperPin] = useState('');

  // Form fields
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
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        onAuthSuccess(user);
      } else {
        // Register mode
        if (!email.trim() || !password) {
          throw new Error('Vui lòng nhập Email và Mật khẩu.');
        }
        if (password.length < 6) {
          throw new Error('Mật khẩu cần tối thiểu 6 ký tự.');
        }
        if (!fullName.trim()) {
          throw new Error('Vui lòng nhập Họ và tên.');
        }

        // Developer role check
        if (selectedRole === 'developer') {
          if (developerPin.trim() && developerPin.trim() !== 'dev2026') {
            throw new Error('Mã PIN bảo mật Nhà phát triển không chính xác (Gợi ý mặc định: dev2026)');
          }
        }

        const uniObj = UNIVERSITIES.find((u) => u.name === university) || UNIVERSITIES[0];
        const newProfileData = {
          role: selectedRole,
          name: fullName.trim(),
          email: email.trim(),
          university: selectedRole === 'developer' ? 'TeamWeaver Core Team' : university,
          uniShort: selectedRole === 'developer' ? 'DEV' : uniObj.short,
          studentId: selectedRole === 'developer' ? 'ADMIN_DEV' : (studentId.trim() || `${Math.floor(20210000 + Math.random() * 80000)}`),
          major: selectedRole === 'developer' ? 'System Architecture & Dev' : (major.trim() || 'Công nghệ thông tin'),
          avatar: selectedRole === 'developer'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
          gpa: selectedRole === 'developer' ? 4.0 : (parseFloat(gpa) || 3.6),
          maxGpa: 4.0,
          gpaVerified: true,
          gpaConsentAgreed: true,
          phone: phone.trim() || '',
          skills: selectedSkills.length > 0 ? selectedSkills : ['React', 'Python', 'Cloud'],
          primarySkillCategory: selectedRole === 'developer' ? 'Coding & Tech' : 'Coding & Tech',
          expectation: expectation,
          targetScore: 'HD',
          availability: availability,
          scheduleDetail: 'Tối thứ 2 - 6 và cuối tuần',
          workingStyle: selectedRole === 'developer' ? 'System Architect' : 'Proactive Communicator',
          workingStyleTraits: ['Agile Sprints', 'Giao tiếp chủ động'],
          awards: selectedRole === 'developer' ? ['TeamWeaver Founder / Developer'] : ['Sinh viên tích cực'],
          bio: selectedRole === 'developer'
            ? 'Nhà phát triển và quản trị hệ thống TeamWeaver Platform.'
            : `Chào mọi người! Mình là ${fullName.trim()} (${uniObj.short}), rất vui được kết nối cùng các bạn làm đồ án.`,
          radarScores: { skills: 95, schedule: 90, style: 90, goals: 95 },
          creditScore: 100,
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
          role: selectedRole,
          profileData: newProfileData
        });

        onAuthSuccess(registeredUser);
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
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: isDark
          ? 'radial-gradient(circle at 50% 10%, #202230 0%, #14151E 100%)'
          : 'radial-gradient(circle at 50% 10%, #FFFFFF 0%, #EEF2F6 100%)',
        color: isDark ? '#E2E5EE' : '#2D323E',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Top Controls: Theme Toggle */}
      <div style={{ position: 'absolute', top: '18px', right: '18px' }}>
        <button
          onClick={onToggleTheme}
          title="Đổi giao diện sáng/tối"
          className="btn-interactive"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
            background: isDark ? '#212330' : '#FFFFFF',
            color: isDark ? '#BCEE26' : '#8C64FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: authMode === 'register' ? '560px' : '440px',
          background: isDark ? '#1C1D27' : '#FFFFFF',
          borderRadius: '28px',
          border: isDark ? '1px solid rgba(188, 238, 38, 0.28)' : '1px solid #CBD5E1',
          boxShadow: isDark
            ? '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 45px rgba(140, 100, 255, 0.15)'
            : '0 20px 50px rgba(0, 0, 0, 0.08)',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '8px' }}>
            <BrandLogo size={40} layout="stacked" theme={theme} showTagline={false} />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>
            Nền tảng kết nối đồng đội sinh viên thực chiến
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: isDark ? '#262734' : '#F1F5F9',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className="btn-interactive"
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: authMode === 'login' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
              color: authMode === 'login' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className="btn-interactive"
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: authMode === 'register' ? (isDark ? '#BCEE26' : '#8C64FF') : 'transparent',
              color: authMode === 'register' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} />
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
              borderRadius: '12px',
              fontSize: '12.5px',
              marginBottom: '16px',
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
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'login' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '5px' }}>
                  Email đăng nhập:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="tenban@edu.vn hoặc email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '13px', left: '12px' }} />
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
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#141520' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Lock size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '13px', left: '12px' }} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Requirement 2: Role Selection (Sinh viên vs Nhà phát triển) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
                  Chọn loại tài khoản đăng ký:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div
                    onClick={() => setSelectedRole('student')}
                    className="btn-interactive"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: selectedRole === 'student'
                        ? (isDark ? '1.5px solid #BCEE26' : '1.5px solid #8C64FF')
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      background: selectedRole === 'student'
                        ? (isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4')
                        : (isDark ? '#141520' : '#F8FAFC'),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <GraduationCap size={18} color={selectedRole === 'student' ? '#BCEE26' : '#8C64FF'} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                        Sinh viên
                      </div>
                      <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>
                        Người dùng thông thường
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('developer')}
                    className="btn-interactive"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: selectedRole === 'developer'
                        ? (isDark ? '1.5px solid #BCEE26' : '1.5px solid #8C64FF')
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      background: selectedRole === 'developer'
                        ? (isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4')
                        : (isDark ? '#141520' : '#F8FAFC'),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Code2 size={18} color={selectedRole === 'developer' ? '#BCEE26' : '#8C64FF'} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                        Nhà phát triển
                      </div>
                      <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>
                        Quản trị & CSDL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRole === 'developer' && (
                <div
                  style={{
                    background: isDark ? 'rgba(140, 100, 255, 0.12)' : '#F5F3FF',
                    border: '1px solid rgba(140, 100, 255, 0.3)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '11.5px'
                  }}
                >
                  <label style={{ display: 'block', fontWeight: 700, color: isDark ? '#DDD6FE' : '#6D28D9', marginBottom: '4px' }}>
                    Mã xác nhận Nhà phát triển (Developer PIN):
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập dev2026"
                    value={developerPin}
                    onChange={(e) => setDeveloperPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(140, 100, 255, 0.4)',
                      background: isDark ? '#1C1D27' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#1E1B4B',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '10.5px', color: isDark ? '#94A3B8' : '#6B7280', marginTop: '3px', display: 'block' }}>
                    * Giúp phân quyền tài khoản quản trị CSDL Supabase và hệ thống. (Mã mặc định: <code>dev2026</code>)
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                  Họ và tên *:
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
                  <User size={15} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '12px' }} />
                </div>
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                    Email *:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
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
                    Mật khẩu *:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
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

              {selectedRole === 'student' && (
                <>
                  {/* University */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '4px' }}>
                      Trường Đại học:
                    </label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
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

                  {/* Major & StudentId & GPA */}
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
                          padding: '9px 10px',
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
                          padding: '9px 10px',
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
                          padding: '9px 10px',
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

                  {/* Skills selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '5px' }}>
                      Kỹ năng sở trường (Chọn các thẻ):
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {ALL_SKILLS.slice(0, 9).map((skill) => {
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
                </>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-interactive"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '14px',
              background: isDark ? '#BCEE26' : '#8C64FF',
              color: isDark ? '#141824' : '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: isDark ? '0 4px 16px rgba(188, 238, 38, 0.28)' : '0 4px 16px rgba(140, 100, 255, 0.28)'
            }}
          >
            {isLoading ? (
              <RefreshCw size={17} className="spin-anim" />
            ) : (
              <ArrowRight size={17} />
            )}
            <span>
              {isLoading
                ? 'Đang xử lý...'
                : authMode === 'login'
                ? 'Đăng Nhập Ngay'
                : selectedRole === 'developer'
                ? 'Đăng Ký Tài Khoản Nhà Phát Triển'
                : 'Tạo Tài Khoản Sinh Viên'}
            </span>
          </button>
        </form>

        {/* Security & Privacy Footer Note */}
        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '11px', color: isDark ? '#6E768E' : '#94A3B8' }}>
          🔒 Bảo mật chuẩn Supabase Auth. Mật khẩu được mã hóa an toàn. Chỉ thông tin công khai hồ sơ được hiển thị cho bạn cùng nhóm.
        </div>
      </div>
    </div>
  );
};

export default AuthView;

