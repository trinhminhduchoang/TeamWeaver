import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Sparkles, Star, MessageSquare, CheckCheck, 
  Wifi, ShieldCheck, Smile
} from 'lucide-react';
import { ICEBREAKER_TEMPLATES } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { subscribeToRealtimeMessages } from '../services/dataService';

export const ChatView = ({
  matches = [],
  messages = {},
  students = [],
  currentUser,
  selectedMatchId,
  onSelectMatch,
  onSendMessage,
  onInviteToTeam,
  onOpenReview,
  theme = 'dark'
}) => {
  const [inputText, setInputText] = useState('');
  const [activeMatchId, setActiveMatchId] = useState(selectedMatchId || matches[0]?.id || null);
  const messagesEndRef = useRef(null);

  const isDark = theme === 'dark';
  const isRealtimeReady = isSupabaseConfigured();

  // Sync activeMatchId if selectedMatchId changes from outside
  useEffect(() => {
    if (selectedMatchId) {
      setActiveMatchId(selectedMatchId);
    } else if (!activeMatchId && matches.length > 0) {
      setActiveMatchId(matches[0].id);
    }
  }, [selectedMatchId, matches]);

  // Subscribe to Realtime messages for current active match
  useEffect(() => {
    if (!activeMatchId) return;

    const unsubscribe = subscribeToRealtimeMessages(activeMatchId, (newMsg) => {
      // If message is from someone else, append it
      if (newMsg && newMsg.senderId !== currentUser?.id) {
        onSendMessage(activeMatchId, {
          ...newMsg,
          isMe: false
        }, false); // false: do not broadcast back to db
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [activeMatchId, currentUser?.id]);

  // Find active match object and partner student
  const activeMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  
  const partnerId = activeMatch
    ? (activeMatch.studentId1 === currentUser?.id ? activeMatch.studentId2 : activeMatch.studentId1)
    : null;

  const partnerStudent = students.find((s) => s.id === partnerId) || {
    id: partnerId || 'partner_unknown',
    name: 'Đồng đội sinh viên',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    university: 'Trường Đại học',
    uniShort: 'UNI',
    major: 'Chuyên ngành',
    gpa: 3.8,
    creditScore: 96
  };

  const currentChatMessages = activeMatch ? (messages[activeMatch.id] || []) : [];

  // Auto scroll to bottom smoothly
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatMessages]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeMatch) return;

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser?.id,
      senderName: currentUser?.name || 'Bạn',
      senderAvatar: currentUser?.avatar || '',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      isMe: true
    };

    onSendMessage(activeMatch.id, newMsg, true);
    setInputText('');
  };

  return (
    <div
      className="chat-view-container tab-view-container"
      style={{
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        minHeight: '520px',
        background: isDark ? '#212330' : '#FFFFFF',
        borderRadius: '24px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: isDark ? '0 12px 36px rgba(0, 0, 0, 0.35)' : '0 8px 30px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Top Match Contact Avatars Strip */}
      <div
        style={{
          padding: '12px 18px',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          background: isDark ? '#1C1D2A' : '#FAFBFC'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0' }}>
          <MessageSquare size={16} color="#8C64FF" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#E2E5EE' : '#334155', whiteSpace: 'nowrap' }}>
            Hội thoại ({matches.length}):
          </span>
        </div>

        {matches.map((m) => {
          const pId = m.studentId1 === currentUser?.id ? m.studentId2 : m.studentId1;
          const pStudent = students.find((s) => s.id === pId) || partnerStudent;
          const isSelected = m.id === activeMatchId;

          return (
            <button
              key={m.id}
              onClick={() => {
                setActiveMatchId(m.id);
                if (onSelectMatch) onSelectMatch(m.id);
              }}
              className="btn-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: isSelected
                  ? (isDark ? '1.5px solid #BCEE26' : '1.5px solid #8C64FF')
                  : (isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'),
                background: isSelected
                  ? (isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4')
                  : 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <img
                src={pStudent.avatar}
                alt={pStudent.name}
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '12px', fontWeight: isSelected ? 800 : 600, color: isSelected ? (isDark ? '#BCEE26' : '#15803D') : (isDark ? '#E2E5EE' : '#475569') }}>
                {pStudent.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {activeMatch ? (
        <>
          {/* Active Conversation Header */}
          <div
            style={{
              padding: '12px 18px',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isDark ? '#212330' : '#FFFFFF',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={partnerStudent.avatar}
                  alt={partnerStudent.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #BCEE26' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: isDark ? '2px solid #212330' : '2px solid #FFFFFF'
                  }}
                  title="Đang hoạt động"
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                    {partnerStudent.name}
                  </h3>
                  <span style={{ fontSize: '11px', background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#DCFCE7', color: isDark ? '#BCEE26' : '#15803D', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                    GPA {partnerStudent.gpa}
                  </span>
                  <span style={{ fontSize: '11px', background: isDark ? 'rgba(140, 100, 255, 0.12)' : '#EDE9FE', color: isDark ? '#C4B5FD' : '#6D28D9', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                    Credit {partnerStudent.creditScore || 96}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: isDark ? '#9AA3B8' : '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{partnerStudent.uniShort} • {partnerStudent.major}</span>
                  <span>•</span>
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Wifi size={11} /> {isRealtimeReady ? 'Supabase Realtime' : 'Trực tuyến'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions: Review & Invite */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onOpenReview && (
                <button
                  onClick={() => onOpenReview(partnerStudent)}
                  className="btn-interactive"
                  title="Đánh giá & Tặng Credit cho đồng đội"
                  style={{
                    padding: '7px 12px',
                    borderRadius: '999px',
                    background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4',
                    border: isDark ? '1px solid rgba(188, 238, 38, 0.3)' : '1px solid #BBF7D0',
                    color: isDark ? '#BCEE26' : '#15803D',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Star size={13} fill="currentColor" />
                  <span>Đánh giá tín nhiệm</span>
                </button>
              )}

              <button
                onClick={() => onInviteToTeam(partnerStudent)}
                className="btn-interactive"
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: isDark ? '#BCEE26' : '#8C64FF',
                  border: 'none',
                  color: isDark ? '#141824' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isDark ? '0 4px 12px rgba(188, 238, 38, 0.25)' : '0 4px 12px rgba(140, 100, 255, 0.25)'
                }}
              >
                <Users size={14} />
                <span>Mời vào Team Hub</span>
              </button>
            </div>
          </div>

          {/* Message Thread Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: isDark ? '#181924' : '#F8FAFC'
            }}
          >
            {/* Mutual Match Banner */}
            <div
              style={{
                textAlign: 'center',
                margin: '4px auto 10px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: isDark ? 'rgba(140, 100, 255, 0.12)' : 'rgba(140, 100, 255, 0.08)',
                border: isDark ? '1px solid rgba(140, 100, 255, 0.25)' : '1px solid rgba(140, 100, 255, 0.2)',
                color: isDark ? '#C4B5FD' : '#6D28D9',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              <span>Các bạn đã ghép đôi thành công ({activeMatch.synergyScore || 92}% tương thích)! Hãy trao đổi và cùng làm việc nhé.</span>
            </div>

            {/* Messages */}
            {currentChatMessages.map((msg) => {
              const isSenderMe = msg.isMe || msg.senderId === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isSenderMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSenderMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: isSenderMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isSenderMe
                        ? (isDark ? '#BCEE26' : '#8C64FF')
                        : (isDark ? '#262838' : '#FFFFFF'),
                      color: isSenderMe
                        ? (isDark ? '#141824' : '#FFFFFF')
                        : (isDark ? '#E2E5EE' : '#2D323E'),
                      fontSize: '13.5px',
                      lineHeight: 1.5,
                      border: isSenderMe ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'),
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', padding: '0 4px' }}>
                    <span style={{ fontSize: '10.5px', color: isDark ? '#6E768E' : '#94A3B8' }}>
                      {msg.timestamp}
                    </span>
                    {isSenderMe && (
                      <CheckCheck size={12} color={isDark ? '#BCEE26' : '#8C64FF'} />
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Icebreaker Suggestions */}
          <div
            style={{
              padding: '8px 14px',
              background: isDark ? '#1C1D2A' : '#F1F5F9',
              borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', whiteSpace: 'nowrap', fontWeight: 600 }}>
              Gợi ý mở lời:
            </span>
            {ICEBREAKER_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(tmpl)}
                className="btn-interactive"
                style={{
                  padding: '4px 11px',
                  borderRadius: '999px',
                  background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                  color: isDark ? '#CBD5E1' : '#475569',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: isDark ? '#212330' : '#FFFFFF',
              borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #E2E8F0'
            }}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn trao đổi công việc, đề tài COS10026..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '999px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                background: isDark ? '#181924' : '#F8FAFC',
                color: isDark ? '#E2E5EE' : '#2D323E',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn-interactive"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isDark ? '#BCEE26' : '#8C64FF',
                border: 'none',
                color: isDark ? '#141824' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                opacity: inputText.trim() ? 1 : 0.5,
                boxShadow: isDark ? '0 4px 12px rgba(188, 238, 38, 0.25)' : '0 4px 12px rgba(140, 100, 255, 0.25)'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: isDark ? '#9AA3B8' : '#647087', padding: '24px', textAlign: 'center' }}>
          <MessageSquare size={48} strokeWidth={1.5} color={isDark ? '#3E4154' : '#CBD5E1'} style={{ marginBottom: '12px' }} />
          <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: isDark ? '#E2E5EE' : '#334155' }}>
            Chưa có cuộc trò chuyện nào
          </h4>
          <p style={{ margin: 0, fontSize: '13px', maxWidth: '340px' }}>
            Hãy chuyển sang mục <strong>Discover</strong> và lướt phải (Swipe Right) để tìm kiếm những bạn đồng đội tương hợp nhất!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatView;
