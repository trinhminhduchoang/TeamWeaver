import React, { useState } from 'react';
import { 
  X, ShieldCheck, Check, Plus, Trash2, Award, 
  GraduationCap, Clock, Target, Flame, Sparkles, Image as ImageIcon,
  Phone, Globe, ExternalLink
} from 'lucide-react';
import { UNIVERSITIES, ALL_SKILLS } from '../data/mockData';
import GpaConsentModal from './GpaConsentModal';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
];

export const ProfileEditModal = ({
  currentUser,
  isOpen,
  onClose,
  onSaveProfile,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const [name, setName] = useState(currentUser?.name || '');
  const [university, setUniversity] = useState(currentUser?.university || UNIVERSITIES[0].name);
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl || '');
  const [gpa, setGpa] = useState(currentUser?.gpa || 3.8);
  const [gpaVerified, setGpaVerified] = useState(currentUser?.gpaVerified || false);
  const [gpaConsentAgreed, setGpaConsentAgreed] = useState(currentUser?.gpaConsentAgreed || false);
  const [selectedSkills, setSelectedSkills] = useState(currentUser?.skills || ['React', 'UI/UX Design']);
  const [expectation, setExpectation] = useState(currentUser?.expectation || 'High Distinction (HD)');
  const [availability, setAvailability] = useState(currentUser?.availability || '8 hours / week');
  const [scheduleDetail, setScheduleDetail] = useState(currentUser?.scheduleDetail || 'Mon - Fri Evenings');
  const [workingStyle, setWorkingStyle] = useState(currentUser?.workingStyle || 'Proactive Communicator');
  const [awards, setAwards] = useState(currentUser?.awards || ['Dean List 2024']);
  const [newAwardInput, setNewAwardInput] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);

  if (!isOpen) return null;

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddAward = (e) => {
    e.preventDefault();
    if (!newAwardInput.trim()) return;
    setAwards([...awards, newAwardInput.trim()]);
    setNewAwardInput('');
  };

  const handleRemoveAward = (idx) => {
    setAwards(awards.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name,
      university,
      uniShort: UNIVERSITIES.find((u) => u.name === university)?.short || 'UNI',
      studentId,
      major,
      avatar,
      bio,
      phone,
      githubUrl,
      linkedinUrl,
      gpa: parseFloat(gpa) || 3.5,
      gpaVerified,
      gpaConsentAgreed,
      skills: selectedSkills,
      expectation,
      availability,
      scheduleDetail,
      workingStyle,
      awards
    };

    onSaveProfile(updatedUser);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 11, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
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
            maxWidth: '600px',
            maxHeight: '92vh',
            background: isDark ? '#1C1D27' : '#FFFFFF',
            borderRadius: '28px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 22px',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isDark ? '#232431' : '#F8FAFC'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                Chỉnh sửa Hồ sơ Sinh viên (Student Profile)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Hồ sơ chỉn chu sẽ tăng 3x cơ hội match với đồng đội xuất sắc!
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                color: isDark ? '#FFFFFF' : '#1A1A1A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form scroll area */}
          <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Mã số sinh viên (MSSV)
                </label>
                <input
                  type="text"
                  placeholder="2021xxxx"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* University & Major */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Trường đại học *
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Chuyên ngành học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Software Engineering, Marketing..."
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Contact info: Phone & Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Số điện thoại / Zalo
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="0987xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 34px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#262736' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Phone size={15} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '10px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Github / Portfolio URL
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 34px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      background: isDark ? '#262736' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Globe size={15} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '10px' }} />
                </div>
              </div>
            </div>

            {/* Avatar URL & Preset Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                Ảnh đại diện (Chọn nhanh hoặc nhập URL):
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px'
                  }}
                />
                {avatar && (
                  <img
                    src={avatar}
                    alt="Preview"
                    style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #BCEE26' }}
                  />
                )}
              </div>

              {/* Quick Preset Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>Avatar mẫu:</span>
                {PRESET_AVATARS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setAvatar(preset)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: avatar === preset ? '2px solid #BCEE26' : '1px solid transparent',
                      transform: avatar === preset ? 'scale(1.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* GPA Verification & Privacy Policy Section */}
            <div
              style={{
                background: isDark ? 'rgba(188, 238, 38, 0.08)' : '#F0FDF4',
                border: '1px solid rgba(188, 238, 38, 0.3)',
                borderRadius: '16px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#BCEE26" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                    Minh chứng Điểm GPA & Cổng trường
                  </span>
                </div>

                {gpaVerified ? (
                  <span
                    style={{
                      background: '#BCEE26',
                      color: '#141824',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={12} />
                    <span>ĐÃ XÁC THỰC TRƯỜNG</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConsentModal(true)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: '#8C64FF',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Xác thực ngay
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B', marginBottom: '4px' }}>
                    Điểm GPA (/4.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="4.0"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                      background: isDark ? '#232431' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      fontWeight: 700,
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ fontSize: '11.5px', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
                  {gpaConsentAgreed ? (
                    <span>
                      ✓ Bạn đã đồng thuận với Điều khoản Bảo mật & chia sẻ GPA để làm bằng chứng tin cậy cho đồng đội tìm kiếm bạn.
                    </span>
                  ) : (
                    <span>
                      ⚠️ Cần đồng ý chính sách bảo mật để chia sẻ GPA làm minh chứng chính thức. Nhấn "Xác thực ngay" ở trên.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Skills selection */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: isDark ? '#CBD5E1' : '#475569' }}>
                Kỹ năng của bạn (Chọn các kỹ năng thế mạnh)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ALL_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        border: isSelected
                          ? '1px solid #BCEE26'
                          : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1'),
                        background: isSelected
                          ? '#BCEE26'
                          : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'),
                        color: isSelected ? '#141824' : (isDark ? '#E2E5EE' : '#475569'),
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expectation / Goals & Working Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Kỳ vọng kết quả (Expectation)
                </label>
                <select
                  value={expectation}
                  onChange={(e) => setExpectation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="High Distinction (HD)">High Distinction (HD)</option>
                  <option value="Distinction (D)">Distinction (D)</option>
                  <option value="Top 3 Contest">Top 3 Cuộc thi</option>
                  <option value="Top 5 Contest">Top 5 Cuộc thi</option>
                  <option value="Pass (PA)">Pass (PA)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Phong cách làm việc ưa thích
                </label>
                <select
                  value={workingStyle}
                  onChange={(e) => setWorkingStyle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Proactive Communicator">Proactive Communicator</option>
                  <option value="Night Owl Builder">Night Owl Builder (Cú đêm)</option>
                  <option value="Agile Team Coordinator">Agile Sprints & Standup</option>
                  <option value="Visual Storyteller">Visual Storyteller</option>
                  <option value="Deep Tech Specialist">Deep Tech & Autonomous</option>
                </select>
              </div>
            </div>

            {/* Availability & Time Commitment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Số giờ cam kết / tuần
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="2 - 4 hours / week">2 - 4 tiếng / tuần</option>
                  <option value="5 - 8 hours / week">5 - 8 tiếng / tuần</option>
                  <option value="8 - 12 hours / week">8 - 12 tiếng / tuần</option>
                  <option value="15+ hours / week (Hackathon Mode)">15+ tiếng / tuần (Hackathon)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Khung giờ rảnh
                </label>
                <input
                  type="text"
                  placeholder="Tối thứ 2-6, hoặc cuối tuần..."
                  value={scheduleDetail}
                  onChange={(e) => setScheduleDetail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* About Me Bio */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                Giới thiệu bản thân (Bio)
              </label>
              <textarea
                rows={3}
                placeholder="Nói ngắn gọn về thế mạnh và đề tài bạn đang quan tâm..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                  background: isDark ? '#262736' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1A1A1A',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Awards list */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                Giải thưởng & Thành tích học tập
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {awards.map((aw, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                      fontSize: '12px'
                    }}
                  >
                    <span>🏆 {aw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(idx)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Thêm giải thưởng mới..."
                  value={newAwardInput}
                  onChange={(e) => setNewAwardInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    background: isDark ? '#262736' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '12px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAward}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#8C64FF',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-interactive"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                  color: isDark ? '#CBD5E1' : '#475569',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="btn-interactive"
                style={{
                  flex: 1.5,
                  padding: '12px',
                  borderRadius: '14px',
                  background: '#BCEE26',
                  border: 'none',
                  color: '#141824',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(188, 238, 38, 0.3)'
                }}
              >
                <Check size={16} />
                <span>Lưu Hồ Sơ & CSDL</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* GPA Consent Modal */}
      <GpaConsentModal
        studentName={name}
        universityName={university}
        currentGpa={gpa}
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConfirmConsent={() => {
          setGpaVerified(true);
          setGpaConsentAgreed(true);
          setShowConsentModal(false);
        }}
        theme={theme}
      />
    </>
  );
};

export default ProfileEditModal;
