// TeamWeaver Core Data Constants & Clean State
// All demo accounts removed to allow user's real team registration

export const UNIVERSITIES = [
  { id: 'hust', name: 'Đại học Bách Khoa Hà Nội (HUST)', short: 'HUST' },
  { id: 'swinburne', name: 'Swinburne University of Technology Vietnam', short: 'Swinburne' },
  { id: 'rmit', name: 'RMIT University Vietnam', short: 'RMIT' },
  { id: 'ftu', name: 'Đại học Ngoại Thương (FTU)', short: 'FTU' },
  { id: 'hcmut', name: 'Đại học Bách Khoa TP.HCM (HCMUT)', short: 'HCMUT' },
  { id: 'neu', name: 'Đại học Kinh Tế Quốc Dân (NEU)', short: 'NEU' },
  { id: 'vnu', name: 'Đại học Quốc Gia Hà Nội (VNU)', short: 'VNU' },
  { id: 'fpt', name: 'Đại học FPT', short: 'FPT' },
  { id: 'uit', name: 'Đại học Công Nghệ Thông Tin (UIT)', short: 'UIT' },
  { id: 'ueh', name: 'Đại học Kinh Tế TP.HCM (UEH)', short: 'UEH' }
];

export const SKILL_CATEGORIES = [
  'All',
  'Coding & Tech',
  'Design & UI/UX',
  'Marketing & Growth',
  'Finance & Business',
  'Project Management'
];

export const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'AI/ML', 'Figma', 'UI/UX Design', 
  'Content Creation', 'Digital Marketing', 'Financial Modeling', 
  'Pitching & Presentation', 'Data Analysis', 'Project Management',
  'Graphic Design', 'Canva', 'Market Research', 'Mobile Dev (Flutter)',
  'Cloud / DevOps', 'Business Strategy'
];

// Peer Review & Credit Endorsement Categories
export const ENDORSEMENT_OPTIONS = [
  { id: 'ontime', label: 'Đúng Deadline ⚡', icon: 'Clock', description: 'Luôn hoàn thành nhiệm vụ đúng hoặc trước hạn' },
  { id: 'no_ghosting', label: 'Zero Ghosting 🛡️', icon: 'ShieldCheck', description: 'Phản hồi tin nhắn nhanh, không bao giờ mất tích' },
  { id: 'communicator', label: 'Giao Tiếp Tốt 💬', icon: 'MessageSquare', description: 'Chủ động trao đổi, lắng nghe và tích cực thảo luận' },
  { id: 'quality', label: 'Chuyên Môn Xuất Sắc 🏆', icon: 'Award', description: 'Chất lượng công việc chỉn chu, chuyên nghiệp' },
  { id: 'team_player', label: 'Hỗ Trợ Đồng Đội 🤝', icon: 'Users', description: 'Sẵn sàng san sẻ khó khăn, hỗ trợ đồng đội khi cần' },
  { id: 'proactive', label: 'Gánh Team / Chủ Động 🔥', icon: 'Flame', description: 'Tiên phong nhận việc khó, định hướng rõ ràng' }
];

export const ICEBREAKER_TEMPLATES = [
  '👋 Chào cậu! Mình thấy kỹ năng của chúng mình rất bổ trợ nhau, cậu có muốn lập nhóm không?',
  '🎯 Mục tiêu của cậu trong dự án/cuộc thi này là gì thế?',
  '📅 Lịch rảnh trong tuần của cậu thế nào? Chúng mình call nhanh 10p làm quen nhé!',
  '🚀 Mình đang có ý tưởng về web app giải quyết bài toán sinh viên, cậu muốn tham gia cùng không?'
];

// Empty initial states - Real accounts created by users
export const INITIAL_STUDENTS = [];
export const INITIAL_MATCHES = [];
export const INITIAL_MESSAGES = {};
export const INITIAL_TEAMS = [];

// Helper to purge legacy demo data from localStorage
export const purgeLegacyDemoStorage = () => {
  const current = localStorage.getItem('tw_current_user');
  if (current) {
    try {
      const parsed = JSON.parse(current);
      if (parsed.id === 'student_1' || parsed.id === 'student_2' || parsed.id === 'student_3' || parsed.id === 'student_4') {
        localStorage.removeItem('tw_current_user');
      }
    } catch {
      localStorage.removeItem('tw_current_user');
    }
  }

  const savedStudents = localStorage.getItem('tw_students');
  if (savedStudents) {
    try {
      const list = JSON.parse(savedStudents);
      const isLegacyDemo = list.some((s) => s.id === 'student_1' || s.id === 'student_2');
      if (isLegacyDemo) {
        localStorage.removeItem('tw_students');
      }
    } catch {
      localStorage.removeItem('tw_students');
    }
  }
};
