import React, { useState, useEffect } from 'react';
import { 
  Database, Check, Copy, AlertCircle, X, ExternalLink, 
  RefreshCw, CheckCircle2, Table, ShieldCheck, KeyRound, Globe,
  Users, Trash2, UserCheck, ShieldAlert, Cpu
} from 'lucide-react';
import { 
  getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, 
  testSupabaseConnection, isSupabaseConfigured 
} from '../lib/supabaseClient';

export const SupabaseConfigModal = ({
  isOpen,
  onClose,
  onConnectionUpdated,
  students = [],
  onDeleteUser,
  onUpdateUserRole,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'users' | 'fields' | 'schema'

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setAnonKey(config.key || '');
      setTestResult(null);
      setCopiedSql(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url, anonKey);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = async () => {
    saveSupabaseConfig(url, anonKey);
    const result = await testSupabaseConnection(url, anonKey);
    setTestResult(result);
    if (onConnectionUpdated) {
      onConnectionUpdated();
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({ success: false, message: 'Đã ngắt kết nối Supabase' });
    if (onConnectionUpdated) {
      onConnectionUpdated();
    }
  };

  const handleCopySchemaSql = () => {
    const sqlCode = `-- =========================================================================
-- TEAMWEAVER SUPABASE SCHEMA
-- Mở Supabase Dashboard -> SQL Editor -> Dán mã này và bấm RUN
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'developer')),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar TEXT,
    university TEXT,
    uni_short TEXT,
    student_id TEXT,
    major TEXT,
    gpa NUMERIC(3, 2) DEFAULT 3.6,
    max_gpa NUMERIC(3, 2) DEFAULT 4.0,
    gpa_verified BOOLEAN DEFAULT false,
    gpa_consent_agreed BOOLEAN DEFAULT false,
    phone TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    bio TEXT,
    skills JSONB DEFAULT '["React", "Python"]'::jsonb,
    primary_skill_category TEXT DEFAULT 'Coding & Tech',
    expectation TEXT DEFAULT 'High Distinction (HD)',
    target_score TEXT DEFAULT 'HD',
    availability TEXT DEFAULT '8 hours / week',
    schedule_detail TEXT,
    working_style TEXT,
    working_style_traits JSONB DEFAULT '[]'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    radar_scores JSONB DEFAULT '{"skills": 85, "schedule": 88, "style": 82, "goals": 90}'::jsonb,
    credit_score INTEGER DEFAULT 98,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    completed_projects_count INTEGER DEFAULT 0,
    completion_rate INTEGER DEFAULT 100,
    likes_given JSONB DEFAULT '[]'::jsonb,
    is_seeking BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    student_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    synergy_score INTEGER DEFAULT 90,
    status TEXT DEFAULT 'matched',
    last_message TEXT,
    last_message_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT,
    sender_avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    target_student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    author_avatar TEXT,
    author_role TEXT,
    project_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    members JSONB DEFAULT '[]'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR ALL USING (true);
CREATE POLICY "Messages are accessible by everyone" ON public.messages FOR ALL USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Teams are accessible by everyone" ON public.teams FOR ALL USING (true);

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.messages, public.matches, public.profiles;
COMMIT;
`;

    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const isConfigured = isSupabaseConfigured();

  const databaseTables = [
    {
      name: 'profiles',
      description: 'Hồ sơ người dùng & nhà phát triển (role, name, email, university, gpa...)',
      fields: [
        { name: 'id', type: 'UUID (Khóa chính)', desc: 'ID tài khoản từ Supabase Auth' },
        { name: 'role', type: 'TEXT', desc: "'student' (Người dùng) hoặc 'developer' (Nhà phát triển)" },
        { name: 'name', type: 'TEXT', desc: 'Họ và tên' },
        { name: 'email', type: 'TEXT', desc: 'Email liên hệ' },
        { name: 'university', type: 'TEXT', desc: 'Trường Đại học' },
        { name: 'student_id', type: 'TEXT', desc: 'Mã số sinh viên (MSSV)' },
        { name: 'major', type: 'TEXT', desc: 'Chuyên ngành học' },
        { name: 'gpa', type: 'NUMERIC(3,2)', desc: 'Điểm GPA hệ 4.0' },
        { name: 'gpa_verified', type: 'BOOLEAN', desc: 'Trạng thái xác thực GPA' },
        { name: 'skills', type: 'JSONB Array', desc: 'Danh sách kỹ năng' },
        { name: 'credit_score', type: 'INTEGER', desc: 'Điểm tín nhiệm làm việc (95 - 100)' },
        { name: 'phone', type: 'TEXT', desc: 'Số điện thoại / Zalo' }
      ]
    },
    {
      name: 'matches',
      description: 'Dữ liệu ghép đôi 2 chiều giữa 2 sinh viên',
      fields: [
        { name: 'id', type: 'TEXT (Khóa chính)', desc: 'Mã lượt ghép đôi' },
        { name: 'student_id_1', type: 'UUID', desc: 'ID sinh viên thứ nhất' },
        { name: 'student_id_2', type: 'UUID', desc: 'ID sinh viên thứ hai' },
        { name: 'synergy_score', type: 'INTEGER', desc: 'Tỷ lệ tương hợp kỹ năng (%)' },
        { name: 'status', type: 'TEXT', desc: 'Trạng thái ghép đôi (matched, archived)' },
        { name: 'last_message', type: 'TEXT', desc: 'Tin nhắn gần nhất' }
      ]
    },
    {
      name: 'messages',
      description: 'Tin nhắn trò chuyện thời gian thực (Supabase Realtime kích hoạt)',
      fields: [
        { name: 'id', type: 'TEXT (Khóa chính)', desc: 'Mã tin nhắn' },
        { name: 'match_id', type: 'TEXT', desc: 'Liên kết với cuộc trò chuyện' },
        { name: 'sender_id', type: 'UUID', desc: 'ID người gửi tin nhắn' },
        { name: 'sender_name', type: 'TEXT', desc: 'Tên người gửi hiển thị' },
        { name: 'text', type: 'TEXT', desc: 'Nội dung tin nhắn' },
        { name: 'created_at', type: 'TIMESTAMPTZ', desc: 'Thời điểm gửi tin nhắn' }
      ]
    },
    {
      name: 'reviews',
      description: 'Đánh giá đồng đội sau khi hoàn thành đề tài',
      fields: [
        { name: 'id', type: 'TEXT (Khóa chính)', desc: 'Mã đánh giá' },
        { name: 'target_student_id', type: 'UUID', desc: 'Sinh viên nhận đánh giá' },
        { name: 'author_id', type: 'UUID', desc: 'Đồng đội gửi đánh giá' },
        { name: 'rating', type: 'INTEGER (1-5)', desc: 'Số sao đánh giá' },
        { name: 'comment', type: 'TEXT', desc: 'Lời nhận xét chi tiết' },
        { name: 'tags', type: 'JSONB Array', desc: 'Huy hiệu khen ngợi (Đúng Deadline, Zero Ghosting...)' }
      ]
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 11, 16, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 10002,
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
          maxWidth: '740px',
          maxHeight: '90vh',
          background: isDark ? '#1C1D27' : '#FFFFFF',
          borderRadius: '26px',
          border: isDark ? '1px solid rgba(188, 238, 38, 0.35)' : '1px solid #CBD5E1',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDark ? '#222332' : '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #BCEE26 0%, #15803D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#141824',
                fontWeight: 900
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E293B' }}>
                  Bảng Điều Khiển Nhà Phát Triển & Quản Trị CSDL
                </h3>
                <span
                  style={{
                    background: '#BCEE26',
                    color: '#141824',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}
                >
                  DEV ONLY
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConfigured ? '#10B981' : '#F59E0B'
                  }}
                />
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  {isConfigured ? 'Supabase Cloud: Đã kết nối' : 'Supabase: Đang chạy dữ liệu cục bộ (Local)'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              color: isDark ? '#FFFFFF' : '#1E293B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '10px 24px 0',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '8px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'settings' ? '2.5px solid #BCEE26' : '2.5px solid transparent',
              color: activeTab === 'settings' ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#94A3B8' : '#64748B'),
              fontWeight: activeTab === 'settings' ? 800 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ⚙️ Kết nối Supabase
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'users' ? '2.5px solid #BCEE26' : '2.5px solid transparent',
              color: activeTab === 'users' ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#94A3B8' : '#64748B'),
              fontWeight: activeTab === 'users' ? 800 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            👥 Quản lý Tài khoản ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('fields')}
            style={{
              padding: '8px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'fields' ? '2.5px solid #BCEE26' : '2.5px solid transparent',
              color: activeTab === 'fields' ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#94A3B8' : '#64748B'),
              fontWeight: activeTab === 'fields' ? 800 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🗂️ Quản lý các trường CSDL
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            style={{
              padding: '8px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'schema' ? '2.5px solid #BCEE26' : '2.5px solid transparent',
              color: activeTab === 'schema' ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#94A3B8' : '#64748B'),
              fontWeight: activeTab === 'schema' ? 800 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📋 Schema SQL
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: isDark ? 'rgba(188, 238, 38, 0.08)' : '#ECFDF5',
                  border: '1px solid rgba(188, 238, 38, 0.25)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: isDark ? '#E2E5EE' : '#065F46',
                  lineHeight: 1.5
                }}
              >
                🛠️ <strong>Dành riêng cho Nhà phát triển:</strong> Chỉ bạn mới có quyền xem và chỉnh sửa kết nối Supabase API keys tại đây. Người dùng sinh viên thông thường hoàn toàn không thấy bảng điều khiển này.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
                  Supabase Project URL:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                      background: isDark ? '#14151E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Globe size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '12px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: isDark ? '#CBD5E1' : '#334155', marginBottom: '6px' }}>
                  Supabase Anon Key (Public Key):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                      background: isDark ? '#14151E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <KeyRound size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ position: 'absolute', top: '12px', left: '12px' }} />
                </div>
              </div>

              {testResult && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: testResult.success
                      ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7')
                      : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2'),
                    color: testResult.success
                      ? (isDark ? '#34D399' : '#15803D')
                      : (isDark ? '#F87171' : '#B91C1C'),
                    border: testResult.success ? '1px solid #10B981' : '1px solid #EF4444'
                  }}
                >
                  {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting || !url || !anonKey}
                  className="btn-interactive"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                    color: isDark ? '#FFFFFF' : '#1E293B',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: (!url || !anonKey || isTesting) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: (!url || !anonKey || isTesting) ? 0.6 : 1
                  }}
                >
                  <RefreshCw size={15} className={isTesting ? 'spin-anim' : ''} />
                  <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!url || !anonKey}
                  className="btn-interactive"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    background: '#BCEE26',
                    border: 'none',
                    color: '#141824',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: (!url || !anonKey) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: (!url || !anonKey) ? 0.6 : 1
                  }}
                >
                  <Check size={16} />
                  <span>Lưu & Kết Nối CSDL</span>
                </button>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="btn-interactive"
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    Ngắt kết nối
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Tổng cộng <strong>{students.length}</strong> tài khoản thực tế trong hệ thống:
                </span>
              </div>

              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}>
                  Chưa có tài khoản nào. Hãy mời các thành viên trong nhóm bạn tự bấm Đăng ký tài khoản!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {students.map((u) => {
                    const isDev = u.role === 'developer';

                    return (
                      <div
                        key={u.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          background: isDark ? '#141520' : '#F8FAFC',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '14px', color: isDark ? '#E2E5EE' : '#1E293B' }}>
                                {u.name}
                              </strong>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  background: isDev ? '#BCEE26' : (isDark ? 'rgba(140, 100, 255, 0.15)' : '#EDE9FE'),
                                  color: isDev ? '#141824' : '#8C64FF'
                                }}
                              >
                                {isDev ? 'DEVELOPER' : 'STUDENT'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                              {u.email} • {u.uniShort || 'UNI'} • {u.major}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {onUpdateUserRole && (
                            <button
                              onClick={() => onUpdateUserRole(u.id, isDev ? 'student' : 'developer')}
                              className="btn-interactive"
                              title={isDev ? 'Chuyển về quyền Sinh viên' : 'Thăng cấp thành Nhà phát triển'}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                                border: 'none',
                                color: isDark ? '#E2E5EE' : '#334155',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <UserCheck size={13} color="#8C64FF" />
                              <span>{isDev ? 'Hạ xuống Student' : 'Lên Developer'}</span>
                            </button>
                          )}

                          {onDeleteUser && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${u.name}"?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="btn-interactive"
                              title="Xóa tài khoản này"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: 'none',
                                color: '#EF4444',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Xóa</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fields' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Hệ thống TeamWeaver quản lý 4 bảng cơ sở dữ liệu chính:
              </p>

              {databaseTables.map((tbl) => (
                <div
                  key={tbl.name}
                  style={{
                    background: isDark ? '#141520' : '#F8FAFC',
                    borderRadius: '14px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      background: isDark ? '#212332' : '#F1F5F9',
                      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Table size={15} color="#BCEE26" />
                      <strong style={{ fontSize: '13.5px', color: isDark ? '#BCEE26' : '#15803D' }}>
                        public.{tbl.name}
                      </strong>
                    </div>
                    <span style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                      {tbl.description}
                    </span>
                  </div>

                  <div style={{ padding: '6px 14px', maxHeight: '180px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ color: isDark ? '#64748B' : '#94A3B8', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0', textAlign: 'left' }}>
                          <th style={{ padding: '5px 4px' }}>Trường</th>
                          <th style={{ padding: '5px 4px' }}>Kiểu</th>
                          <th style={{ padding: '5px 4px' }}>Mô tả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.fields.map((f, i) => (
                          <tr key={i} style={{ borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.03)' : '1px solid #F1F5F9' }}>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: isDark ? '#E2E5EE' : '#1E293B', fontWeight: 600 }}>
                              {f.name}
                            </td>
                            <td style={{ padding: '5px 4px', color: '#8C64FF', fontSize: '11px' }}>
                              {f.type}
                            </td>
                            <td style={{ padding: '5px 4px', color: isDark ? '#94A3B8' : '#475569' }}>
                              {f.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schema' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Sao chép đoạn mã SQL này và dán vào Supabase SQL Editor rồi bấm RUN:
                </p>

                <button
                  type="button"
                  onClick={handleCopySchemaSql}
                  className="btn-interactive"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: copiedSql ? '#10B981' : '#BCEE26',
                    border: 'none',
                    color: '#141824',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}</span>
                </button>
              </div>

              <div
                style={{
                  background: isDark ? '#10111A' : '#1E293B',
                  borderRadius: '14px',
                  padding: '16px',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #334155',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: '#A7F3D0'
                }}
              >
                <pre style={{ margin: 0 }}>
{`-- 1. BẢNG PROFILES (PHÂN QUYỀN: student / developer)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'developer')),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    ...
);

-- BẬT SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfigModal;
