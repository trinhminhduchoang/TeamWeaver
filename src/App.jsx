import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DiscoverSwipe from './components/DiscoverSwipe';
import TeamHub from './components/TeamHub';
import ChatView from './components/ChatView';
import UserProfileTab from './components/UserProfileTab';
import ProfileDetailModal from './components/ProfileDetailModal';
import MatchCelebrationModal from './components/MatchCelebrationModal';
import ProfileEditModal from './components/ProfileEditModal';
import GpaConsentModal from './components/GpaConsentModal';
import ReviewModal from './components/ReviewModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import AuthView from './components/AuthView';
import { 
  INITIAL_STUDENTS, INITIAL_MATCHES, INITIAL_MESSAGES, INITIAL_TEAMS,
  purgeLegacyDemoStorage
} from './data/mockData';
import { 
  fetchStudents, saveProfile, fetchMatches, createMatch, 
  sendMessageToDb, saveReview, authSignOut, deleteUserAccount,
  updateUserRole 
} from './services/dataService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { Sparkles } from 'lucide-react';
import './App.css';

// Purge any legacy demo data from previous runs
purgeLegacyDemoStorage();

function App() {
  // Theme & Navigation State
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'chat' | 'team' | 'profile'

  // Application Data States
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('tw_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  // Current logged in user (null if not logged in -> shows AuthView screen)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tw_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'student_1' && parsed.id !== 'student_2') {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null; // Require login/registration on first load
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('tw_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tw_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('tw_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  // Modal and Interaction States
  const [celebrationMatch, setCelebrationMatch] = useState(null);
  const [detailStudent, setDetailStudent] = useState(null);
  const [reviewTargetStudent, setReviewTargetStudent] = useState(null);
  const [selectedChatMatchId, setSelectedChatMatchId] = useState(null);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [isGpaConsentModalOpen, setIsGpaConsentModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync body theme class
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Initial Data Sync from Supabase or Local
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        const fetchedStudents = await fetchStudents();
        if (fetchedStudents && Array.isArray(fetchedStudents)) {
          setStudents(fetchedStudents);
        }
        if (currentUser?.id) {
          const userMatches = await fetchMatches(currentUser.id);
          if (userMatches && Array.isArray(userMatches)) {
            setMatches(userMatches);
          }
        }
      } catch (err) {
        console.warn('Initial data load notice:', err);
      }
    };

    loadCloudData();
  }, [currentUser?.id]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('tw_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tw_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tw_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tw_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('tw_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tw_teams', JSON.stringify(teams));
  }, [teams]);

  // Toast Notification helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Developer actions: Delete user
  const handleDeleteUser = async (userId) => {
    await deleteUserAccount(userId);
    setStudents((prev) => prev.filter((s) => s.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    showToast('Đã xóa tài khoản người dùng thành công!', 'info');
  };

  // Developer actions: Change user role
  const handleUpdateUserRole = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    setStudents((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, role: newRole } : s))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    showToast(`Đã cập nhật quyền thành công: ${newRole.toUpperCase()}!`, 'success');
  };

  // Peer review submission & credit calculation
  const handleAddReview = async (targetStudentId, newReview) => {
    await saveReview(newReview, targetStudentId);

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== targetStudentId) return student;

        const updatedReviews = [newReview, ...(student.reviews || [])];
        const newReviewCount = updatedReviews.length;
        const avgRating = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount).toFixed(1)
        );

        const updatedEndorsements = (student.endorsements || []).map((end) => {
          if (newReview.tags?.includes(end.label)) {
            return { ...end, count: end.count + 1 };
          }
          return end;
        });

        newReview.tags?.forEach((t) => {
          if (!updatedEndorsements.some((e) => e.label === t)) {
            updatedEndorsements.push({ id: `tag_${Date.now()}`, label: t, count: 1 });
          }
        });

        const newCreditScore = Math.min(100, Math.round((student.creditScore || 95) + (newReview.rating >= 4 ? 1 : -2)));

        const updatedStudent = {
          ...student,
          reviews: updatedReviews,
          reviewCount: newReviewCount,
          rating: avgRating,
          creditScore: newCreditScore,
          endorsements: updatedEndorsements
        };

        saveProfile(updatedStudent);
        return updatedStudent;
      })
    );

    if (currentUser?.id === targetStudentId) {
      setCurrentUser((prev) => {
        const updatedReviews = [newReview, ...(prev.reviews || [])];
        const updatedUser = {
          ...prev,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)),
          creditScore: Math.min(100, (prev.creditScore || 98) + 1)
        };
        saveProfile(updatedUser);
        return updatedUser;
      });
    }

    setDetailStudent((prev) => {
      if (prev && prev.id === targetStudentId) {
        const updatedReviews = [newReview, ...(prev.reviews || [])];
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)),
          creditScore: Math.min(100, (prev.creditScore || 95) + 1)
        };
      }
      return prev;
    });

    const targetStudent = students.find((s) => s.id === targetStudentId);
    showToast(`⭐ Đã gửi đánh giá & cộng credit cho ${targetStudent?.name || 'đồng đội'}!`, 'success');
  };

  // Handle Swipe Right / Interested Action
  const handleLikeStudent = async (candidate) => {
    // Check if candidate already liked currentUser
    const isCandidateInterested = candidate.likesGiven?.includes(currentUser?.id);

    // Save like to current user's record
    const updatedUser = {
      ...currentUser,
      likesGiven: [...(currentUser?.likesGiven || []), candidate.id]
    };
    setCurrentUser(updatedUser);
    saveProfile(updatedUser);

    if (isCandidateInterested) {
      const matchId = `match_${Date.now()}`;
      const newMatch = {
        id: matchId,
        studentId1: currentUser.id,
        studentId2: candidate.id,
        matchedAt: new Date().toISOString(),
        synergyScore: Math.round(((candidate.radarScores?.skills || 88) + (candidate.radarScores?.goals || 90)) / 2) || 92,
        status: 'matched',
        lastMessage: `Các bạn đã ghép đôi thành công! Hãy gửi lời chào đến ${candidate.name}.`,
        lastMessageTime: 'Vừa xong',
        unreadCount: 1
      };

      await createMatch(newMatch);
      setMatches((prev) => [newMatch, ...prev]);

      const welcomeMsg = {
        id: `sys_msg_${Date.now()}`,
        senderId: candidate.id,
        senderName: candidate.name,
        text: `Chào ${currentUser.name}! Mình rất vui được kết nối với bạn trên TeamWeaver. Chúng mình cùng trao đổi về dự án nhé! 🎉`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        isMe: false
      };

      await sendMessageToDb(matchId, welcomeMsg, candidate);
      setMessages((prev) => ({
        ...prev,
        [matchId]: [welcomeMsg]
      }));

      setCelebrationMatch(candidate);
    } else {
      showToast(`Đã gửi quan tâm đến ${candidate.name}! Sẽ thông báo khi đối phương kết nối lại.`, 'info');
    }
  };

  const handlePassStudent = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    showToast(`Đã bỏ qua ${student?.name || 'sinh viên'}. Bạn có thể xem lại sau.`);
  };

  const handleSuperlikeStudent = (candidate) => {
    handleLikeStudent(candidate);
    showToast(`⭐ Bạn đã gửi Superlike tới ${candidate.name}!`, 'success');
  };

  const handleSendMessage = async (matchId, newMessage, saveToCloud = true) => {
    setMessages((prev) => {
      const currentList = prev[matchId] || [];
      if (currentList.some((m) => m.id === newMessage.id)) return prev;
      return {
        ...prev,
        [matchId]: [...currentList, newMessage]
      };
    });

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, lastMessage: newMessage.text, lastMessageTime: newMessage.timestamp }
          : m
      )
    );

    if (saveToCloud) {
      await sendMessageToDb(matchId, newMessage, currentUser);
    }
  };

  const handleAddTask = (teamId, newTask) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, tasks: [...t.tasks, newTask] }
          : t
      )
    );
    showToast(`Đã thêm nhiệm vụ: "${newTask.title}"`, 'success');
  };

  const handleUpdateTaskStatus = (teamId, taskId, nextStatus) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              tasks: t.tasks.map((task) =>
                task.id === taskId ? { ...task, status: nextStatus } : task
              )
            }
          : t
      )
    );
  };

  const handleDeleteTask = (teamId, taskId) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, tasks: t.tasks.filter((task) => task.id !== taskId) }
          : t
      )
    );
    showToast('Đã xóa nhiệm vụ', 'info');
  };

  const handleCreateTeam = (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
    showToast(`Đã khởi tạo Team Hub: "${newTeam.name}"`, 'success');
  };

  const handleInviteToTeamHub = (partnerStudent) => {
    setTeams((prev) => {
      const activeTeam = prev[0];
      if (!activeTeam) return prev;
      const alreadyMember = activeTeam.members.some((m) => m.id === partnerStudent.id);
      if (alreadyMember) return prev;

      const updatedMembers = [
        ...activeTeam.members,
        {
          id: partnerStudent.id,
          name: partnerStudent.name,
          role: partnerStudent.primarySkillCategory || 'Thành viên',
          avatar: partnerStudent.avatar
        }
      ];

      return [
        { ...activeTeam, members: updatedMembers },
        ...prev.slice(1)
      ];
    });

    setActiveTab('team');
    showToast(`Đã thêm ${partnerStudent.name} vào Team Hub!`, 'success');
  };

  const handleStartChatFromMatch = (candidate) => {
    const match = matches.find(
      (m) => (m.studentId1 === currentUser?.id && m.studentId2 === candidate.id) ||
             (m.studentId2 === currentUser?.id && m.studentId1 === candidate.id)
    );
    if (match) {
      setSelectedChatMatchId(match.id);
    }
    setActiveTab('chat');
  };

  const handleSignOut = async () => {
    await authSignOut();
    setCurrentUser(null);
    localStorage.removeItem('tw_current_user');
    showToast('Đã đăng xuất tài khoản.', 'info');
  };

  // REQUIREMENT 1: IF NOT LOGGED IN, RENDER AUTH VIEW (LOGIN / REGISTRATION)
  if (!currentUser) {
    return (
      <AuthView
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Chào mừng ${user.name} (${user.role === 'developer' ? 'Nhà phát triển' : 'Sinh viên'})!`, 'success');
        }}
      />
    );
  }

  // Render Main Tab Content
  const renderTabContent = () => {
    return (
      <div key={activeTab} className="tab-view-container" style={{ width: '100%' }}>
        {(() => {
          switch (activeTab) {
            case 'discover':
              return (
                <DiscoverSwipe
                  students={students}
                  currentUser={currentUser}
                  onLike={handleLikeStudent}
                  onPass={handlePassStudent}
                  onSuperlike={handleSuperlikeStudent}
                  onViewDetails={(student) => setDetailStudent(student)}
                  theme={theme}
                />
              );
            case 'chat':
              return (
                <ChatView
                  matches={matches}
                  messages={messages}
                  students={students}
                  currentUser={currentUser}
                  selectedMatchId={selectedChatMatchId}
                  onSelectMatch={(mId) => setSelectedChatMatchId(mId)}
                  onSendMessage={handleSendMessage}
                  onInviteToTeam={handleInviteToTeamHub}
                  onOpenReview={(student) => setReviewTargetStudent(student)}
                  theme={theme}
                />
              );
            case 'team':
              return (
                <TeamHub
                  teams={teams}
                  currentUser={currentUser}
                  onCreateTeam={handleCreateTeam}
                  onAddTask={handleAddTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onDeleteTask={handleDeleteTask}
                  onOpenReview={(student) => setReviewTargetStudent(student)}
                  students={students}
                  theme={theme}
                />
              );
            case 'profile':
              return (
                <UserProfileTab
                  currentUser={currentUser}
                  onOpenEdit={() => setIsProfileEditModalOpen(true)}
                  onOpenGpaConsent={() => setIsGpaConsentModalOpen(true)}
                  onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
                  onSignOut={handleSignOut}
                  theme={theme}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`teamweaver-app-root ${theme}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isDark
          ? 'radial-gradient(circle at 50% 0%, #202230 0%, #161722 100%)'
          : 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F4F6F9 100%)',
        color: isDark ? '#E2E5EE' : '#2D323E',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Top Global Navigation Bar - Developer Role Gate */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        currentUser={currentUser}
        onOpenProfileEdit={() => setIsProfileEditModalOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        onSignOut={handleSignOut}
        unreadMessagesCount={1}
      />

      {/* Main Workspace Body */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 16px 32px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {renderTabContent()}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: isDark ? '#232535' : '#FFFFFF',
            color: isDark ? '#E2E5EE' : '#2D323E',
            border: isDark ? '1px solid rgba(188, 238, 38, 0.35)' : '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            padding: '12px 20px',
            borderRadius: '16px',
            zIndex: 10005,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeInBackdrop 0.22s ease-out'
          }}
        >
          <Sparkles size={16} color="#BCEE26" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      {/* 1. Mutual Match Celebration Modal */}
      <MatchCelebrationModal
        currentUser={currentUser}
        matchedStudent={celebrationMatch}
        onClose={() => setCelebrationMatch(null)}
        onStartChat={handleStartChatFromMatch}
        onCreateTeam={handleInviteToTeamHub}
        theme={theme}
      />

      {/* 2. Candidate Full Profile Modal */}
      <ProfileDetailModal
        student={detailStudent}
        currentUser={currentUser}
        onClose={() => setDetailStudent(null)}
        onLike={handleLikeStudent}
        onPass={handlePassStudent}
        onOpenReview={(student) => setReviewTargetStudent(student)}
        theme={theme}
      />

      {/* 3. Peer Review & Credit Awarding Modal */}
      <ReviewModal
        isOpen={Boolean(reviewTargetStudent)}
        targetStudent={reviewTargetStudent}
        currentUser={currentUser}
        onClose={() => setReviewTargetStudent(null)}
        onSubmitReview={handleAddReview}
        theme={theme}
      />

      {/* 4. Student Profile Edit Modal */}
      <ProfileEditModal
        currentUser={currentUser}
        isOpen={isProfileEditModalOpen}
        onClose={() => setIsProfileEditModalOpen(false)}
        onSaveProfile={async (updated) => {
          setCurrentUser(updated);
          await saveProfile(updated);
          setStudents((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
          showToast('Đã lưu hồ sơ thành công!', 'success');
        }}
        theme={theme}
      />

      {/* 5. University GPA Consent & Verification Modal */}
      <GpaConsentModal
        studentName={currentUser.name}
        universityName={currentUser.university}
        currentGpa={currentUser.gpa}
        isOpen={isGpaConsentModalOpen}
        onClose={() => setIsGpaConsentModalOpen(false)}
        onConfirmConsent={async () => {
          const updated = {
            ...currentUser,
            gpaVerified: true,
            gpaConsentAgreed: true
          };
          setCurrentUser(updated);
          await saveProfile(updated);
          showToast('Đã kích hoạt huy hiệu GPA Verified!', 'success');
        }}
        theme={theme}
      />

      {/* 6. Developer Only: Supabase Database Configuration & User Management Modal */}
      {currentUser?.role === 'developer' && (
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          students={students}
          onDeleteUser={handleDeleteUser}
          onUpdateUserRole={handleUpdateUserRole}
          onConnectionUpdated={async () => {
            const isConfigured = isSupabaseConfigured();
            if (isConfigured) {
              showToast('Đã cập nhật kết nối Supabase Cloud!', 'success');
              const cloudStudents = await fetchStudents();
              if (cloudStudents?.length) setStudents(cloudStudents);
            } else {
              showToast('Chuyển sang chế độ dữ liệu cục bộ (Local)', 'info');
            }
          }}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;
