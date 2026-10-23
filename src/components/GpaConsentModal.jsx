import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, AlertTriangle, X, University } from 'lucide-react';

export const GpaConsentModal = ({
  studentName = 'Sinh viên',
  universityName = 'Đại học Bách Khoa Hà Nội (HUST)',
  currentGpa = 3.85,
  isOpen,
  onClose,
  onConfirmConsent,
  theme = 'dark'
}) => {
  const [agreedPolicy, setAgreedPolicy] = useState(true);
  const [agreedSharing, setAgreedSharing] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmConsent(true);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 11, 16, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
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
          maxWidth: '480px',
          background: isDark ? '#1C1D27' : '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid rgba(214, 255, 63, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(214, 255, 63, 0.2)',
          padding: '28px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: isDark ? '#94A3B8' : '#64748B',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'rgba(214, 255, 63, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D6FF3F'
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
              Xác thực GPA từ Cổng Trường
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#8C72FF', fontWeight: 600 }}>
              TeamWeaver Academic Integrity System
            </p>
          </div>
        </div>

        {/* Student portal simulation box */}
        <div
          style={{
            background: isDark ? '#232431' : '#F8FAFC',
            borderRadius: '16px',
            padding: '14px 16px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
            <University size={14} color="#D6FF3F" />
            <span>Đồng bộ từ Cổng thông tin đào tạo:</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
            {universityName}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#475569' }}>
              Điểm trung bình tích lũy:
            </span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#D6FF3F', background: isDark ? 'rgba(0,0,0,0.3)' : '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
              {currentGpa} / 4.0
            </span>
          </div>
        </div>

        {/* Policy Terms */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreedPolicy}
              onChange={(e) => setAgreedPolicy(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#D6FF3F', width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '12px', lineHeight: 1.4, color: isDark ? '#CBD5E1' : '#334155' }}>
              <strong>Chính sách minh chứng học tập:</strong> Tôi đồng ý liên kết dữ liệu kết quả học tập từ hệ thống trường đại học vào TeamWeaver.
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreedSharing}
              onChange={(e) => setAgreedSharing(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#D6FF3F', width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '12px', lineHeight: 1.4, color: isDark ? '#CBD5E1' : '#334155' }}>
              <strong>Đồng ý chia sẻ GPA:</strong> Tôi đồng thuận hiển thị huy hiệu <em>GPA Đã xác thực ({currentGpa})</em> công khai cho các bạn sinh viên khác trên app như một minh chứng năng lực để tìm nhóm phù hợp.
            </span>
          </label>
        </div>

        {/* Security badge notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '20px' }}>
          <Lock size={12} color="#10B981" />
          <span>Dữ liệu được mã hóa TLS và tuân thủ chuẩn bảo vệ dữ liệu sinh viên.</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleVerify}
          disabled={!agreedPolicy || !agreedSharing || isVerifying}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '999px',
            background: (agreedPolicy && agreedSharing) ? '#D6FF3F' : (isDark ? '#2B2C3A' : '#CBD5E1'),
            border: 'none',
            color: '#1A1A1A',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 800,
            cursor: (agreedPolicy && agreedSharing && !isVerifying) ? 'pointer' : 'not-allowed',
            boxShadow: (agreedPolicy && agreedSharing) ? '0 8px 24px rgba(214, 255, 63, 0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isVerifying ? (
            <span>Đang xác thực với cổng trường...</span>
          ) : (
            <>
              <CheckCircle size={16} />
              <span>Đồng ý & Kích hoạt Huy hiệu GPA Verified</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GpaConsentModal;
