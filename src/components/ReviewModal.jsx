import React, { useState } from 'react';
import { 
  X, Star, Check, HeartHandshake, Send
} from 'lucide-react';
import { ENDORSEMENT_OPTIONS } from '../data/mockData';

export const ReviewModal = ({
  isOpen,
  onClose,
  targetStudent,
  currentUser,
  onSubmitReview,
  theme = 'dark'
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [projectName, setProjectName] = useState('TeamWeaver Capstone (COS10026)');
  const [selectedTags, setSelectedTags] = useState(['Đúng Deadline ⚡', 'Zero Ghosting 🛡️']);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !targetStudent) return null;

  const isDark = theme === 'dark';

  const toggleTag = (tagLabel) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel)
        ? prev.filter((t) => t !== tagLabel)
        : [...prev, tagLabel]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    const newReview = {
      id: `rev_${Date.now()}`,
      authorId: currentUser?.id || 'me',
      authorName: currentUser?.name || 'Bạn',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      authorRole: currentUser?.primarySkillCategory || 'Đồng đội',
      projectName: projectName.trim() || 'Dự án Hợp tác',
      rating,
      date: new Date().toISOString().split('T')[0],
      comment: comment.trim(),
      tags: selectedTags
    };

    setTimeout(() => {
      onSubmitReview(targetStudent.id, newReview);
      setIsSubmitting(false);
      onClose();
      setComment('');
    }, 250);
  };

  return (
    <div
      className="modal-backdrop-anim"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 16, 24, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10002,
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
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: isDark ? '#202230' : '#FFFFFF',
          borderRadius: '24px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isDark
            ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(188, 238, 38, 0.08)'
            : '0 20px 45px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDark ? '#1C1D2A' : '#FAFBFC',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: isDark ? 'rgba(188, 238, 38, 0.14)' : 'rgba(140, 100, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#BCEE26' : '#8C64FF'
              }}
            >
              <HeartHandshake size={20} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 800,
                  color: isDark ? '#E2E5EE' : '#2D323E',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                Đánh giá & Tặng Credit
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
                Ghi nhận đóng góp và nâng uy tín cho <strong>{targetStudent.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-interactive"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              color: isDark ? '#9AA3B8' : '#647087',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Target Student Quick Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
              borderRadius: '14px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'
            }}
          >
            <img
              src={targetStudent.avatar}
              alt={targetStudent.name}
              style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: isDark ? '#E2E5EE' : '#2D323E' }}>
                {targetStudent.name}
              </div>
              <div style={{ fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
                {targetStudent.major} • {targetStudent.uniShort}
              </div>
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isDark ? '#BCEE26' : '#15803D',
                background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#DCFCE7',
                padding: '4px 8px',
                borderRadius: '8px'
              }}
            >
              Credit: {targetStudent.creditScore || 95}/100
            </div>
          </div>

          {/* Star Rating Selection */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '8px',
                color: isDark ? '#E2E5EE' : '#2D323E'
              }}
            >
              Mức độ hài lòng khi làm việc chung ({rating} / 5 ⭐)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isLit = (hoverRating || rating) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                    className="btn-interactive"
                  >
                    <Star
                      size={28}
                      fill={isLit ? '#FBBF24' : 'transparent'}
                      color={isLit ? '#FBBF24' : (isDark ? '#4A4F63' : '#CBD5E1')}
                      strokeWidth={1.8}
                    />
                  </button>
                );
              })}
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginLeft: '8px',
                  color: isDark ? '#9AA3B8' : '#647087'
                }}
              >
                {rating === 5 && 'Xuất sắc, rất muốn tiếp tục hợp tác!'}
                {rating === 4 && 'Rất tốt, hoàn thành đúng tiến độ'}
                {rating === 3 && 'Tương đối ổn định'}
                {rating <= 2 && 'Cần cải thiện giao tiếp hoặc tiến độ'}
              </span>
            </div>
          </div>

          {/* Project Context */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '6px',
                color: isDark ? '#E2E5EE' : '#2D323E'
              }}
            >
              Dự án / Môn học hợp tác
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="VD: Capstone COS10026, Hackathon 2024, Assignment MKT..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                background: isDark ? '#181924' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                color: isDark ? '#E2E5EE' : '#2D323E',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Endorsement Tags (Credit badges) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isDark ? '#E2E5EE' : '#2D323E'
                }}
              >
                Tặng Huy Hiệu Tín Nhiệm (Credit Badges)
              </label>
              <span style={{ fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087' }}>
                Đã chọn {selectedTags.length} huy hiệu
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ENDORSEMENT_OPTIONS.map((opt) => {
                const isSelected = selectedTags.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleTag(opt.label)}
                    className="btn-interactive"
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: isSelected
                        ? (isDark ? 'rgba(188, 238, 38, 0.18)' : '#F0FDF4')
                        : (isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9'),
                      border: isSelected
                        ? (isDark ? '1px solid #BCEE26' : '1px solid #16A34A')
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      color: isSelected
                        ? (isDark ? '#BCEE26' : '#15803D')
                        : (isDark ? '#9AA3B8' : '#647087')
                    }}
                  >
                    {isSelected && <Check size={13} />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment / Testimonial textarea */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '6px',
                color: isDark ? '#E2E5EE' : '#2D323E'
              }}
            >
              Lời nhận xét chân thực (Review cho đồng đội) *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="VD: Bạn ấy làm việc rất có trách nhiệm, chủ động nhận phần khó và phản hồi tin nhắn cực nhanh. Dự án hoàn thành sớm 2 ngày nhờ có bạn!"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: isDark ? '#181924' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                color: isDark ? '#E2E5EE' : '#2D323E',
                fontSize: '13px',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'none'
              }}
            />
          </div>

          {/* Quick preset suggestions */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: isDark ? '#6E768E' : '#94A3B8', alignSelf: 'center' }}>Gợi ý:</span>
            {[
              'Đúng hạn và giao tiếp nhanh!',
              'Kỹ năng chuyên môn rất cao',
              'Đồng đội tin cậy tuyệt đối, 5 sao!'
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setComment((prev) => (prev ? `${prev} ${preset}` : preset))}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                  border: 'none',
                  color: isDark ? '#9AA3B8' : '#647087',
                  cursor: 'pointer'
                }}
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Footer Submit Button */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-interactive"
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
                color: isDark ? '#E2E5EE' : '#475569',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="btn-interactive"
              style={{
                flex: 2,
                padding: '11px',
                borderRadius: '12px',
                background: isDark ? '#BCEE26' : '#8C64FF',
                color: isDark ? '#141824' : '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '13px',
                cursor: comment.trim() ? 'pointer' : 'not-allowed',
                opacity: comment.trim() ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isDark
                  ? '0 4px 15px rgba(188, 238, 38, 0.25)'
                  : '0 4px 15px rgba(140, 100, 255, 0.25)'
              }}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá & Credit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
