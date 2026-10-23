import React, { useState } from 'react';
import { 
  Flame, MessageSquare, Users, User, Moon, Sun, 
  ChevronDown, Database, LogOut, Edit3, Settings
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const Navigation = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onOpenProfileEdit,
  onOpenSupabaseConfig,
  onSignOut,
  unreadMessagesCount = 0
}) => {
  const isDark = theme === 'dark';
  const isDbConnected = isSupabaseConfigured();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Flame, badge: null },
    { id: 'chat', label: 'Matches & Chat', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'team', label: 'Team Hub', icon: Users, badge: null },
    { id: 'profile', label: 'Hồ sơ', icon: User, badge: null },
  ];

  return (
    <>
      {/* Top Global Header Bar (Desktop & Mobile) */}
      <header
        className="top-navbar-root"
        style={{
          width: '100%',
          padding: '12px 24px',
          background: isDark ? 'rgba(24, 25, 36, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxSizing: 'border-box'
        }}
      >
        {/* Brand Logo with exact 3D ribbon icon and tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            onClick={() => onTabChange('discover')}
            style={{ cursor: 'pointer' }}
          >
            <BrandLogo size={32} theme={theme} showTagline={true} />
          </div>
        </div>

        {/* Main Nav Tabs for Desktop (Hidden on mobile via CSS) */}
        <nav className="desktop-nav-tabs" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive
                    ? (isDark ? '#BCEE26' : '#8C64FF')
                    : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'transparent'),
                  color: isActive
                    ? (isDark ? '#141824' : '#FFFFFF')
                    : (isDark ? '#9AA3B8' : '#556075'),
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '10px',
                      marginLeft: '2px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Database Status, Theme Toggle, User Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Supabase Database Connection Button - ONLY VISIBLE TO DEVELOPER */}
          {currentUser?.role === 'developer' && onOpenSupabaseConfig && (
            <button
              onClick={onOpenSupabaseConfig}
              title="Quản lý kết nối Cơ sở dữ liệu Supabase (Quyền Nhà phát triển)"
              className="btn-interactive db-status-btn"
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: isDbConnected
                  ? (isDark ? '1px solid rgba(188, 238, 38, 0.4)' : '1px solid #BBF7D0')
                  : (isDark ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid #FDE68A'),
                background: isDbConnected
                  ? (isDark ? 'rgba(188, 238, 38, 0.12)' : '#F0FDF4')
                  : (isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7'),
                color: isDbConnected
                  ? (isDark ? '#BCEE26' : '#15803D')
                  : (isDark ? '#F59E0B' : '#B45309'),
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Database size={14} />
              <span className="db-btn-text">
                {isDbConnected ? 'Supabase Dev' : 'Cấu hình CSDL'}
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isDbConnected ? '#10B981' : '#F59E0B'
                }}
              />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title="Đổi giao diện sáng/tối"
            className="btn-interactive"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
              background: isDark ? '#212330' : '#FFFFFF',
              color: isDark ? '#BCEE26' : '#8C64FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Account Menu Chip */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="btn-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                borderRadius: '999px',
                border: isDark ? '1px solid rgba(188, 238, 38, 0.25)' : '1px solid #CBD5E1',
                background: isDark ? 'rgba(188, 238, 38, 0.08)' : '#F1F5F9',
                cursor: 'pointer'
              }}
              title="Tài khoản sinh viên"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={currentUser?.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                    {currentUser?.name || 'Tài khoản'}
                  </span>
                  {currentUser?.role === 'developer' && (
                    <span style={{ fontSize: '9px', fontWeight: 900, background: '#BCEE26', color: '#141824', padding: '1px 5px', borderRadius: '4px' }}>
                      DEV
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: isDark ? '#BCEE26' : '#15803D', fontWeight: 700 }}>
                  {currentUser?.role === 'developer' ? 'Nhà phát triển' : (currentUser?.uniShort || 'HUST')}
                </div>
              </div>
              <ChevronDown size={14} color={isDark ? '#9AA3B8' : '#647087'} />
            </div>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '200px',
                    background: isDark ? '#212330' : '#FFFFFF',
                    borderRadius: '16px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    padding: '6px',
                    zIndex: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onTabChange('profile');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#E2E5EE' : '#2D323E',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <User size={14} color="#8C64FF" />
                    <span>Xem Hồ sơ cá nhân</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfileEdit();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#E2E5EE' : '#2D323E',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <Edit3 size={14} color="#BCEE26" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </button>

                  {currentUser?.role === 'developer' && onOpenSupabaseConfig && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSupabaseConfig();
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'none',
                        border: 'none',
                        color: isDark ? '#E2E5EE' : '#2D323E',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textAlign: 'left'
                      }}
                    >
                      <Database size={14} color="#BCEE26" />
                      <span>Bảng Quản Trị CSDL Dev</span>
                    </button>
                  )}

                  <div style={{ height: '1px', background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0', margin: '4px 0' }} />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onSignOut) onSignOut();
                      else if (onOpenAuth) onOpenAuth();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Đăng xuất / Đổi tài khoản</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices <= 768px) */}
      <nav
        className="mobile-bottom-nav-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: isDark ? 'rgba(24, 25, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          display: 'none', // Handled via responsive CSS @media
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 9999,
          boxShadow: isDark ? '0 -4px 20px rgba(0, 0, 0, 0.4)' : '0 -4px 20px rgba(0, 0, 0, 0.06)'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="btn-interactive"
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '6px 14px',
                cursor: 'pointer',
                position: 'relative',
                color: isActive
                  ? (isDark ? '#BCEE26' : '#8C64FF')
                  : (isDark ? '#8A92A6' : '#94A3B8')
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={22} color={isActive ? (isDark ? '#BCEE26' : '#8C64FF') : 'currentColor'} />
                {item.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: isActive ? 800 : 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navigation;
