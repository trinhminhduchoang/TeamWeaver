import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_STUDENTS, INITIAL_MATCHES, INITIAL_MESSAGES, INITIAL_TEAMS } from '../data/mockData';

// Map database snake_case row to frontend camelCase student profile
export const mapProfileFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role || 'student', // 'student' | 'developer'
    name: row.name || 'Sinh viên',
    email: row.email || '',
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    university: row.university || 'Đại học Bách Khoa Hà Nội (HUST)',
    uniShort: row.uni_short || 'HUST',
    studentId: row.student_id || '',
    major: row.major || 'Công nghệ thông tin',
    gpa: Number(row.gpa) || 3.5,
    maxGpa: Number(row.max_gpa) || 4.0,
    gpaVerified: Boolean(row.gpa_verified),
    gpaConsentAgreed: Boolean(row.gpa_consent_agreed),
    phone: row.phone || '',
    githubUrl: row.github_url || '',
    linkedinUrl: row.linkedin_url || '',
    bio: row.bio || 'Chào bạn! Mình đang tìm kiếm đồng đội làm đồ án.',
    skills: Array.isArray(row.skills) ? row.skills : ['React', 'Python'],
    primarySkillCategory: row.primary_skill_category || 'Coding & Tech',
    expectation: row.expectation || 'High Distinction (HD)',
    targetScore: row.target_score || 'HD',
    availability: row.availability || '8 hours / week',
    scheduleDetail: row.schedule_detail || 'Tối thứ 2 - 6 và cuối tuần',
    workingStyle: row.working_style || 'Proactive Communicator',
    workingStyleTraits: Array.isArray(row.working_style_traits) ? row.working_style_traits : [],
    awards: Array.isArray(row.awards) ? row.awards : [],
    radarScores: row.radar_scores || { skills: 88, schedule: 85, style: 85, goals: 90 },
    creditScore: row.credit_score || 98,
    rating: Number(row.rating) || 5.0,
    reviewCount: row.review_count || 0,
    completedProjectsCount: row.completed_projects_count || 0,
    completionRate: row.completion_rate || 100,
    likesGiven: Array.isArray(row.likes_given) ? row.likes_given : [],
    isSeeking: row.is_seeking !== false,
    createdAt: row.created_at
  };
};

// Map frontend camelCase profile to database snake_case row
export const mapProfileToDb = (profile) => {
  return {
    id: profile.id,
    role: profile.role || 'student',
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    university: profile.university,
    uni_short: profile.uniShort,
    student_id: profile.studentId,
    major: profile.major,
    gpa: profile.gpa,
    max_gpa: profile.maxGpa || 4.0,
    gpa_verified: profile.gpaVerified,
    gpa_consent_agreed: profile.gpaConsentAgreed,
    phone: profile.phone || '',
    github_url: profile.githubUrl || '',
    linkedin_url: profile.linkedinUrl || '',
    bio: profile.bio,
    skills: profile.skills,
    primary_skill_category: profile.primarySkillCategory,
    expectation: profile.expectation,
    target_score: profile.targetScore,
    availability: profile.availability,
    schedule_detail: profile.scheduleDetail,
    working_style: profile.workingStyle,
    working_style_traits: profile.workingStyleTraits,
    awards: profile.awards,
    radar_scores: profile.radarScores,
    credit_score: profile.creditScore,
    rating: profile.rating,
    review_count: profile.reviewCount,
    completed_projects_count: profile.completedProjectsCount,
    completion_rate: profile.completionRate,
    likes_given: profile.likesGiven,
    is_seeking: profile.isSeeking,
    updated_at: new Date().toISOString()
  };
};

const getDemoStudentProfiles = () =>
  DEFAULT_ACCOUNTS
    .filter((account) => account.role === 'student')
    .map((account) => {
      const profile = { ...account };
      delete profile.password;
      return profile;
    });

const mergeDemoStudentProfiles = (students) => {
  const profilesById = new Map(getDemoStudentProfiles().map((profile) => [profile.id, profile]));
  students.forEach((student) => profilesById.set(student.id, student));
  return [...profilesById.values()];
};

// 1. Fetch all student profiles
export const fetchStudents = async () => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return mergeDemoStudentProfiles(data.map(mapProfileFromDb));
      }
    } catch (err) {
      console.warn('Could not fetch profiles from Supabase, falling back to local data:', err);
    }
  }

  // Fallback to local storage or clean initial state
  const saved = localStorage.getItem('tw_students');
  return mergeDemoStudentProfiles(saved ? JSON.parse(saved) : INITIAL_STUDENTS);
};

// 2. Save or update a profile
export const saveProfile = async (profile) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      const payload = mapProfileToDb(profile);
      const { error } = await client.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsert profile error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase save profile exception:', err);
    }
  }

  // Always sync to local storage
  const currentSaved = localStorage.getItem('tw_students');
  let studentsList = currentSaved ? JSON.parse(currentSaved) : INITIAL_STUDENTS;
  const idx = studentsList.findIndex((s) => s.id === profile.id);
  if (idx >= 0) {
    studentsList[idx] = profile;
  } else {
    studentsList.unshift(profile);
  }
  localStorage.setItem('tw_students', JSON.stringify(studentsList));

  // If this is current user, update tw_current_user too
  const savedCurrent = localStorage.getItem('tw_current_user');
  if (savedCurrent) {
    try {
      const parsed = JSON.parse(savedCurrent);
      if (parsed.id === profile.id) {
        localStorage.setItem('tw_current_user', JSON.stringify(profile));
      }
    } catch {
      // ignore
    }
  }
};

// 3. Delete an account (Developer only)
export const deleteUserAccount = async (userId) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('profiles').delete().eq('id', userId);
    } catch (err) {
      console.warn('Supabase delete user error:', err);
    }
  }

  const currentSaved = localStorage.getItem('tw_students');
  if (currentSaved) {
    const list = JSON.parse(currentSaved).filter((s) => s.id !== userId);
    localStorage.setItem('tw_students', JSON.stringify(list));
  }
};

// 4. Update user role (Developer only)
export const updateUserRole = async (userId, newRole) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('profiles').update({ role: newRole }).eq('id', userId);
    } catch (err) {
      console.warn('Supabase update role error:', err);
    }
  }

  const currentSaved = localStorage.getItem('tw_students');
  if (currentSaved) {
    const list = JSON.parse(currentSaved).map((s) => (s.id === userId ? { ...s, role: newRole } : s));
    localStorage.setItem('tw_students', JSON.stringify(list));
  }
};

// 5. Fetch Matches
export const fetchMatches = async (userId) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await client
        .from('matches')
        .select('*')
        .or(`student_id_1.eq.${userId},student_id_2.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
          id: m.id,
          studentId1: m.student_id_1,
          studentId2: m.student_id_2,
          synergyScore: m.synergy_score,
          status: m.status,
          lastMessage: m.last_message,
          lastMessageTime: m.last_message_time,
          createdAt: m.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch matches error:', err);
    }
  }

  const saved = localStorage.getItem('tw_matches');
  return saved ? JSON.parse(saved) : INITIAL_MATCHES;
};

// 6. Create new Match
export const createMatch = async (newMatch) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('matches').insert({
        id: newMatch.id,
        student_id_1: newMatch.studentId1,
        student_id_2: newMatch.studentId2,
        synergy_score: newMatch.synergyScore || 90,
        status: newMatch.status || 'matched',
        last_message: newMatch.lastMessage || 'Các bạn đã ghép đôi thành công!',
        last_message_time: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase create match error:', err);
    }
  }

  const saved = localStorage.getItem('tw_matches');
  const list = saved ? JSON.parse(saved) : INITIAL_MATCHES;
  const updated = [newMatch, ...list.filter((m) => m.id !== newMatch.id)];
  localStorage.setItem('tw_matches', JSON.stringify(updated));
  return updated;
};

// 7. Fetch Messages for a Match
export const fetchMessagesForMatch = async (matchId) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured() && matchId) {
    try {
      const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          senderAvatar: msg.sender_avatar,
          text: msg.text,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: msg.created_at,
          matchId: msg.match_id
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch messages error:', err);
    }
  }

  const saved = localStorage.getItem('tw_messages');
  const allMessages = saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  return allMessages[matchId] || [];
};

// 8. Send Message
export const sendMessageToDb = async (matchId, message, currentUser) => {
  const client = getSupabaseClient();
  const dbPayload = {
    id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    match_id: matchId,
    sender_id: message.senderId || currentUser?.id,
    sender_name: message.senderName || currentUser?.name || 'Bạn',
    sender_avatar: message.senderAvatar || currentUser?.avatar || '',
    text: message.text,
    created_at: new Date().toISOString()
  };

  if (client && isSupabaseConfigured()) {
    try {
      await client.from('messages').insert(dbPayload);
      await client
        .from('matches')
        .update({
          last_message: message.text,
          last_message_time: new Date().toISOString()
        })
        .eq('id', matchId);
    } catch (err) {
      console.warn('Supabase send message error:', err);
    }
  }

  // Update local storage
  const saved = localStorage.getItem('tw_messages');
  const allMessages = saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  const list = allMessages[matchId] || [];
  const updatedList = [...list, message];
  allMessages[matchId] = updatedList;
  localStorage.setItem('tw_messages', JSON.stringify(allMessages));

  // Trigger storage broadcast event for cross-tab sync
  localStorage.setItem('tw_messages_event', JSON.stringify({ matchId, message }));

  return updatedList;
};

// 9. Subscribe to Realtime Messages
export const subscribeToRealtimeMessages = (matchId, onNewMessage) => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured() || !matchId) {
    const handleStorageEvent = (e) => {
      if (e.key === 'tw_messages_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.matchId === matchId && onNewMessage) {
            onNewMessage(parsed.message);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }

  const channel = client
    .channel(`chat_match_${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        if (payload?.new && onNewMessage) {
          const newMsg = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name,
            senderAvatar: payload.new.sender_avatar,
            text: payload.new.text,
            timestamp: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: payload.new.created_at,
            matchId: payload.new.match_id
          };
          onNewMessage(newMsg);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

// 10. Save Review
export const saveReview = async (review, targetStudentId) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('reviews').insert({
        id: review.id || `rev_${Date.now()}`,
        target_student_id: targetStudentId,
        author_id: review.authorId,
        author_name: review.authorName,
        author_avatar: review.authorAvatar,
        author_role: review.authorRole,
        project_name: review.projectName,
        rating: review.rating,
        comment: review.comment,
        tags: review.tags || [],
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase save review error:', err);
    }
  }
};

// 11. Auth Methods
export const authSignUp = async ({ email, password, role = 'student', profileData }) => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name: profileData.name,
          university: profileData.university,
          uni_short: profileData.uniShort,
          student_id: profileData.studentId,
          major: profileData.major,
          avatar: profileData.avatar
        }
      }
    });

    if (error) throw error;
    if (data?.user) {
      const fullProfile = {
        ...profileData,
        id: data.user.id,
        role,
        email: data.user.email
      };
      await saveProfile(fullProfile);
      return fullProfile;
    }
  }

  // Local fallback: save to credentials store
  const savedCreds = localStorage.getItem('tw_auth_credentials');
  const credentialsList = savedCreds ? JSON.parse(savedCreds) : [];

  const existing = credentialsList.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Email này đã được đăng ký tài khoản!');
  }

  const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  credentialsList.push({ email: email.toLowerCase(), password, id: newUserId, role });
  localStorage.setItem('tw_auth_credentials', JSON.stringify(credentialsList));

  const newProfile = {
    ...profileData,
    id: newUserId,
    role,
    email: email
  };

  await saveProfile(newProfile);
  localStorage.setItem('tw_current_user', JSON.stringify(newProfile));
  return newProfile;
};

// Default accounts for immediate testing
export const DEFAULT_ACCOUNTS = [
  {
    id: 'dev_master_user',
    role: 'developer',
    name: 'Kỹ Sư Trưởng (Admin)',
    email: 'admin@teamweaver.dev',
    password: 'admin',
    university: 'TeamWeaver Core Engineering',
    uniShort: 'DEV',
    studentId: 'DEV_ROOT',
    major: 'System Architecture & Dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    gpa: 4.0,
    maxGpa: 4.0,
    gpaVerified: true,
    gpaConsentAgreed: true,
    skills: ['React', 'Python', 'Supabase', 'Cloud / DevOps'],
    primarySkillCategory: 'Coding & Tech',
    expectation: 'High Distinction (HD)',
    targetScore: 'HD',
    availability: '15+ hours / week',
    scheduleDetail: 'Toàn thời gian (Developer Mode)',
    workingStyle: 'System Architect',
    workingStyleTraits: ['Architecture', 'DevOps', 'Security'],
    awards: ['TeamWeaver Founder / Lead Dev'],
    radarScores: { skills: 98, schedule: 95, style: 92, goals: 99 },
    creditScore: 100,
    rating: 5.0,
    reviewCount: 1,
    completedProjectsCount: 5,
    completionRate: 100,
    likesGiven: [],
    isSeeking: true
  },
  {
    id: 'student_tester_user',
    role: 'student',
    name: 'Nguyễn Văn A',
    email: 'student@hust.edu.vn',
    password: '123456',
    university: 'Đại học Bách Khoa Hà Nội (HUST)',
    uniShort: 'HUST',
    studentId: '20231234',
    major: 'Khoa học máy tính',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    gpa: 3.85,
    maxGpa: 4.0,
    gpaVerified: true,
    gpaConsentAgreed: true,
    skills: ['React', 'Python', 'UI/UX Design'],
    primarySkillCategory: 'Coding & Tech',
    expectation: 'High Distinction (HD)',
    targetScore: 'HD',
    availability: '8 hours / week',
    scheduleDetail: 'Tối thứ 2 - 6 và cuối tuần',
    workingStyle: 'Proactive Communicator',
    workingStyleTraits: ['Agile Sprints', 'Giao tiếp chủ động'],
    awards: ['Học bổng Khuyến khích Học tập'],
    radarScores: { skills: 88, schedule: 85, style: 85, goals: 90 },
    creditScore: 98,
    rating: 5.0,
    reviewCount: 0,
    completedProjectsCount: 2,
    completionRate: 100,
    likesGiven: ['student_design_user', 'student_marketing_user', 'student_business_user'],
    isSeeking: true
  },
  {
    id: 'student_design_user',
    role: 'student',
    name: 'Trần Minh Anh',
    email: 'minhanh@hcmut.edu.vn',
    password: '123456',
    university: 'Đại học Bách Khoa TP.HCM (HCMUT)',
    uniShort: 'HCMUT',
    studentId: '20234567',
    major: 'Thiết kế giao diện người dùng',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
    gpa: 3.72,
    maxGpa: 4.0,
    gpaVerified: true,
    gpaConsentAgreed: true,
    skills: ['Figma', 'UI/UX Design', 'Graphic Design', 'React'],
    primarySkillCategory: 'Design & UI/UX',
    expectation: 'High Distinction (HD)',
    targetScore: 'HD',
    availability: '10 hours / week',
    scheduleDetail: 'Buổi tối các ngày trong tuần',
    workingStyle: 'Collaborative Designer',
    workingStyleTraits: ['Tư duy sáng tạo', 'Lắng nghe phản hồi'],
    awards: ['Giải Nhì thiết kế sản phẩm sinh viên'],
    bio: 'Mình thích biến những ý tưởng khó thành trải nghiệm dễ dùng. Đang tìm đồng đội làm sản phẩm công nghệ.',
    radarScores: { skills: 92, schedule: 86, style: 94, goals: 89 },
    creditScore: 96,
    rating: 4.9,
    reviewCount: 3,
    completedProjectsCount: 4,
    completionRate: 100,
    likesGiven: ['student_tester_user', 'student_marketing_user', 'student_business_user'],
    isSeeking: true
  },
  {
    id: 'student_marketing_user',
    role: 'student',
    name: 'Lê Hoàng Nam',
    email: 'hoangnam@ftu.edu.vn',
    password: '123456',
    university: 'Đại học Ngoại Thương (FTU)',
    uniShort: 'FTU',
    studentId: '20235678',
    major: 'Marketing số',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    gpa: 3.68,
    maxGpa: 4.0,
    gpaVerified: true,
    gpaConsentAgreed: true,
    skills: ['Digital Marketing', 'Market Research', 'Data Analysis', 'Content Creation'],
    primarySkillCategory: 'Marketing & Growth',
    expectation: 'Distinction (D)',
    targetScore: 'D',
    availability: '8 hours / week',
    scheduleDetail: 'Cuối tuần và tối thứ 3, 5',
    workingStyle: 'Data-driven Collaborator',
    workingStyleTraits: ['Chủ động', 'Làm việc dựa trên dữ liệu'],
    awards: ['Top 5 cuộc thi Marketing sinh viên'],
    bio: 'Mình có thể phụ trách nghiên cứu người dùng và đưa sản phẩm đến đúng đối tượng.',
    radarScores: { skills: 90, schedule: 84, style: 91, goals: 88 },
    creditScore: 94,
    rating: 4.8,
    reviewCount: 2,
    completedProjectsCount: 3,
    completionRate: 96,
    likesGiven: ['student_tester_user', 'student_design_user', 'student_business_user'],
    isSeeking: true
  },
  {
    id: 'student_business_user',
    role: 'student',
    name: 'Phạm Thu Hà',
    email: 'thuha@neu.edu.vn',
    password: '123456',
    university: 'Đại học Kinh Tế Quốc Dân (NEU)',
    uniShort: 'NEU',
    studentId: '20236789',
    major: 'Tài chính và phân tích kinh doanh',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    gpa: 3.81,
    maxGpa: 4.0,
    gpaVerified: true,
    gpaConsentAgreed: true,
    skills: ['Financial Modeling', 'Business Strategy', 'Pitching & Presentation', 'Data Analysis'],
    primarySkillCategory: 'Finance & Business',
    expectation: 'High Distinction (HD)',
    targetScore: 'HD',
    availability: '9 hours / week',
    scheduleDetail: 'Linh hoạt sau 18:00',
    workingStyle: 'Organized Strategist',
    workingStyleTraits: ['Lập kế hoạch rõ ràng', 'Giao tiếp cởi mở'],
    awards: ['Học bổng khuyến khích học tập'],
    bio: 'Mình muốn cùng xây dựng một sản phẩm có mô hình kinh doanh thực tế và tác động tích cực.',
    radarScores: { skills: 91, schedule: 88, style: 90, goals: 95 },
    creditScore: 97,
    rating: 5.0,
    reviewCount: 2,
    completedProjectsCount: 3,
    completionRate: 100,
    likesGiven: ['student_tester_user', 'student_design_user', 'student_marketing_user'],
    isSeeking: true
  }
];

export const authSignIn = async (email, password) => {
  const cleanEmail = email.trim().toLowerCase();

  // Check default demo accounts first
  const defaultAcc = DEFAULT_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.password === password
  );

  if (defaultAcc) {
    const userToSave = { ...defaultAcc };
    delete userToSave.password;
    saveProfile(userToSave);
    localStorage.setItem('tw_current_user', JSON.stringify(userToSave));
    return userToSave;
  }

  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    if (data?.user) {
      const { data: profileRow } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileRow) {
        const userProfile = mapProfileFromDb(profileRow);
        localStorage.setItem('tw_current_user', JSON.stringify(userProfile));
        return userProfile;
      }
    }
  }

  // Local fallback: verify against tw_auth_credentials
  const savedCreds = localStorage.getItem('tw_auth_credentials');
  const credentialsList = savedCreds ? JSON.parse(savedCreds) : [];
  const matchedCred = credentialsList.find(
    (c) => c.email.toLowerCase() === cleanEmail && c.password === password
  );

  if (!matchedCred && credentialsList.length > 0) {
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }

  const savedStudents = localStorage.getItem('tw_students');
  const students = savedStudents ? JSON.parse(savedStudents) : [];
  const found = students.find((s) => s.email?.toLowerCase() === cleanEmail);

  if (found) {
    localStorage.setItem('tw_current_user', JSON.stringify(found));
    return found;
  }

  if (matchedCred) {
    const fallbackUser = {
      id: matchedCred.id,
      role: matchedCred.role || 'student',
      name: email.split('@')[0],
      email: email,
      university: 'Đại học Bách Khoa Hà Nội (HUST)',
      uniShort: 'HUST',
      major: 'Công nghệ thông tin',
      gpa: 3.8,
      skills: ['React', 'Python'],
      creditScore: 98,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    };
    saveProfile(fallbackUser);
    localStorage.setItem('tw_current_user', JSON.stringify(fallbackUser));
    return fallbackUser;
  }

  throw new Error('Tài khoản chưa tồn tại. Vui lòng bấm Đăng ký tài khoản!');
};

export const authSignOut = async () => {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
};
