import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Plus, 
  FileText, CheckSquare, Trash2, ArrowUpRight,
  Download, Copy, Check, X, Star, HeartHandshake
} from 'lucide-react';

export const TeamHub = ({
  teams = [],
  currentUser,
  onCreateTeam,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenReview,
  students = [],
  theme = 'dark'
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'members' | 'files'
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskPriority, setTaskPriority] = useState('High');

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamTarget, setNewTeamTarget] = useState('High Distinction (HD)');

  // Team quick note state
  const [teamNotes, setTeamNotes] = useState([
    { id: 1, title: 'Link Figma Thiết kế UI TeamWeaver', link: 'https://figma.com/file/teamweaver-mockup' },
    { id: 2, title: 'Google Drive Nộp bài Capstone COS10026', link: 'https://drive.google.com/teamweaver-submission' },
    { id: 3, title: 'Quy tắc nhóm: Họp cố định 20h tối thứ Tư hàng tuần', link: null }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  const isDark = theme === 'dark';
  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Calculate team progress
  const totalTasks = currentTeam?.tasks?.length || 0;
  const completedTasks = currentTeam?.tasks?.filter((t) => t.status === 'Done').length || 0;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateNewTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentTeam) return;

    const assignee = currentTeam.members.find((m) => m.id === taskAssigneeId) || currentTeam.members[0];

    const newTask = {
      id: `task_${Date.now()}`,
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      deadline: taskDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      priority: taskPriority
    };

    onAddTask(currentTeam.id, newTask);
    setTaskTitle('');
    setTaskDescription('');
    setShowAddTaskModal(false);
  };

  const handleCreateNewTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeam = {
      id: `team_${Date.now()}`,
      name: newTeamName.trim(),
      description: newTeamDesc.trim() || 'Nhóm học tập & thi đấu',
      target: newTeamTarget,
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        {
          id: currentUser?.id || 'me',
          name: currentUser?.name || 'Bạn',
          role: 'Team Leader',
          avatar: currentUser?.avatar
        }
      ],
      tasks: [],
      announcements: []
    };

    onCreateTeam(newTeam);
    setSelectedTeamId(newTeam.id);
    setNewTeamName('');
    setNewTeamDesc('');
    setShowCreateTeamModal(false);
  };

  const handleCycleStatus = (taskId, currentStatus) => {
    let nextStatus = 'In Progress';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Done';
    else if (currentStatus === 'Done') nextStatus = 'Pending';

    onUpdateTaskStatus(currentTeam.id, taskId, nextStatus);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setTeamNotes([...teamNotes, { id: Date.now(), title: newNoteText.trim(), link: null }]);
    setNewNoteText('');
  };

  // Find full student object to review
  const getStudentForReview = (memberId) => {
    return students.find((s) => s.id === memberId) || {
      id: memberId,
      name: currentTeam.members.find((m) => m.id === memberId)?.name || 'Đồng đội',
      avatar: currentTeam.members.find((m) => m.id === memberId)?.avatar,
      major: 'Sinh viên',
      uniShort: 'HUST',
      creditScore: 96
    };
  };

  // Generate formatted text for export
  const getFormattedReport = () => {
    if (!currentTeam) return '';
    const membersText = currentTeam.members.map((m) => `- ${m.name}: ${m.role}`).join('\n');
    const tasksDone = currentTeam.tasks.filter((t) => t.status === 'Done').map((t) => `  [x] ${t.title} (${t.assigneeName} - Hạn: ${t.deadline})`).join('\n');
    const tasksInProgress = currentTeam.tasks.filter((t) => t.status === 'In Progress').map((t) => `  [-] ${t.title} (${t.assigneeName} - Hạn: ${t.deadline})`).join('\n');
    const tasksPending = currentTeam.tasks.filter((t) => t.status === 'Pending').map((t) => `  [ ] ${t.title} (${t.assigneeName} - Hạn: ${t.deadline})`).join('\n');

    return `# BÁO CÁO TIẾN ĐỘ DỰ ÁN — TEAMWEAVER
Dự án: ${currentTeam.name}
Mục tiêu: ${currentTeam.target}
Tiến độ hiện tại: ${progressPct}% (${completedTasks}/${totalTasks} nhiệm vụ hoàn tất)

## 1. THÀNH VIÊN VÀ PHÂN VAI:
${membersText}

## 2. TIẾN ĐỘ CÔNG VIỆC:
### ✅ Đã hoàn thành:
${tasksDone || '  Chưa có'}

### ⚡ Đang triển khai:
${tasksInProgress || '  Chưa có'}

### ⏳ Đang chờ thực hiện:
${tasksPending || '  Chưa có'}
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(getFormattedReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div
      className="team-hub-container tab-view-container"
      style={{
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Team Header & Switcher */}
      <div
        style={{
          background: isDark ? '#212330' : '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          marginBottom: '16px',
          boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.25)' : '0 8px 24px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: isDark ? '#BCEE26' : '#15803D', background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                Team Hub
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
                Mục tiêu: {currentTeam?.target}
              </span>
            </div>
            <h2
              style={{
                margin: '6px 0 0',
                fontSize: '21px',
                fontWeight: 800,
                color: isDark ? '#E2E5EE' : '#2D323E',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {currentTeam?.name || 'Không gian làm việc nhóm'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowExportModal(true)}
              title="Xuất báo cáo tiến độ nhóm"
              className="btn-interactive"
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
              <Download size={13} />
              <span>Xuất báo cáo</span>
            </button>

            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="btn-interactive"
              style={{
                padding: '7px 14px',
                borderRadius: '999px',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                color: isDark ? '#E2E5EE' : '#2D323E',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              <span>Tạo team mới</span>
            </button>
          </div>
        </div>

        {/* Member Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', marginRight: '6px' }}>
              {currentTeam?.members?.map((member, i) => (
                <div
                  key={member.id}
                  title={`${member.name} (${member.role})`}
                  style={{
                    position: 'relative',
                    marginLeft: i === 0 ? 0 : '-10px',
                    zIndex: currentTeam.members.length - i
                  }}
                >
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isDark ? '2px solid #212330' : '2px solid #FFFFFF'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087', fontWeight: 600 }}>
              {currentTeam?.members?.length || 0} thành viên
            </div>
          </div>

          {/* Quick Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
            <div style={{ flex: 1, height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #8C64FF 0%, #BCEE26 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#BCEE26' : '#15803D' }}>
              {progressPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Hub Tabs: Tasks | Members & Credits | Files */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setActiveTab('tasks')}
          className="btn-interactive"
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'tasks' ? (isDark ? '#BCEE26' : '#8C64FF') : (isDark ? '#212330' : '#FFFFFF'),
            color: activeTab === 'tasks' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeTab === 'tasks' ? '0 4px 14px rgba(188, 238, 38, 0.25)' : 'none'
          }}
        >
          <CheckSquare size={15} />
          <span>Nhiệm vụ ({completedTasks}/{totalTasks})</span>
        </button>

        {/* Requirement 1: Members & Credit tab */}
        <button
          onClick={() => setActiveTab('members')}
          className="btn-interactive"
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'members' ? (isDark ? '#BCEE26' : '#8C64FF') : (isDark ? '#212330' : '#FFFFFF'),
            color: activeTab === 'members' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeTab === 'members' ? '0 4px 14px rgba(188, 238, 38, 0.25)' : 'none'
          }}
        >
          <HeartHandshake size={15} />
          <span>Đồng đội & Credit ({currentTeam?.members?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className="btn-interactive"
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'files' ? (isDark ? '#BCEE26' : '#8C64FF') : (isDark ? '#212330' : '#FFFFFF'),
            color: activeTab === 'files' ? (isDark ? '#141824' : '#FFFFFF') : (isDark ? '#9AA3B8' : '#647087'),
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeTab === 'files' ? '0 4px 14px rgba(140, 100, 255, 0.25)' : 'none'
          }}
        >
          <FileText size={15} />
          <span>Tài liệu ({teamNotes.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* TAB: TASKS */}
        {activeTab === 'tasks' && (
          <div className="tab-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentTeam?.tasks?.map((task) => {
              const isDone = task.status === 'Done';
              const isInProgress = task.status === 'In Progress';
              const isAssigneeMe = task.assigneeId === currentUser?.id;

              return (
                <div
                  key={task.id}
                  style={{
                    background: isDark ? '#212330' : '#FFFFFF',
                    borderRadius: '18px',
                    padding: '16px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    opacity: isDone ? 0.78 : 1
                  }}
                >
                  {/* Left: Task Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          color: task.priority === 'High' ? '#EF4444' : '#F59E0B'
                        }}
                      >
                        {task.priority}
                      </span>

                      <span style={{ fontSize: '11px', color: isDark ? '#9AA3B8' : '#647087', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        Hạn: {task.deadline}
                      </span>
                    </div>

                    <h4
                      style={{
                        margin: 0,
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: isDark ? '#E2E5EE' : '#2D323E',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <img
                          src={task.assigneeAvatar}
                          alt={task.assigneeName}
                          style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#475569' }}>
                          {task.assigneeName}
                        </span>
                      </div>

                      {/* Requirement 1: Prompt to award credit / review when task is Done */}
                      {isDone && !isAssigneeMe && onOpenReview && (
                        <button
                          onClick={() => onOpenReview(getStudentForReview(task.assigneeId))}
                          className="btn-interactive"
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isDark ? 'rgba(188, 238, 38, 0.12)' : '#DCFCE7',
                            border: isDark ? '1px solid rgba(188, 238, 38, 0.3)' : '1px solid #86EFAC',
                            color: isDark ? '#BCEE26' : '#15803D',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                          title={`Tặng Credit & Đánh giá cho ${task.assigneeName}`}
                        >
                          <Star size={11} fill="currentColor" />
                          <span>Tặng Credit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Pill & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleCycleStatus(task.id, task.status)}
                      title="Nhấn để đổi trạng thái"
                      className="btn-interactive"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isDone
                          ? (isDark ? '#BCEE26' : '#16A34A')
                          : isInProgress
                          ? '#8C64FF'
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9'),
                        color: isDone
                          ? (isDark ? '#141824' : '#FFFFFF')
                          : (isInProgress ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569')),
                        boxShadow: isDone
                          ? '0 2px 8px rgba(188, 238, 38, 0.35)'
                          : (isInProgress ? '0 2px 8px rgba(140, 100, 255, 0.35)' : 'none')
                      }}
                    >
                      {isDone && <CheckCircle2 size={13} />}
                      <span>{task.status}</span>
                    </button>

                    <button
                      onClick={() => onDeleteTask(currentTeam.id, task.id)}
                      className="btn-interactive"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isDark ? '#6E768E' : '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Add Task Action */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="btn-interactive"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '16px',
                background: isDark ? '#BCEE26' : '#8C64FF',
                color: isDark ? '#141824' : '#FFFFFF',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: isDark
                  ? '0 6px 18px rgba(188, 238, 38, 0.25)'
                  : '0 6px 18px rgba(140, 100, 255, 0.25)'
              }}
            >
              <Plus size={17} />
              <span>+ Thêm nhiệm vụ mới</span>
            </button>
          </div>
        )}

        {/* TAB: MEMBERS & PEER REVIEWS (Requirement 1) */}
        {activeTab === 'members' && (
          <div className="tab-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: isDark ? '#9AA3B8' : '#647087', marginBottom: '4px' }}>
              Đánh giá và ghi nhận đóng góp của từng thành viên trong quá trình chạy dự án <strong>{currentTeam.name}</strong>:
            </div>

            {currentTeam.members.map((member) => {
              const isMe = member.id === currentUser?.id;
              const fullStudent = getStudentForReview(member.id);

              return (
                <div
                  key={member.id}
                  style={{
                    background: isDark ? '#212330' : '#FFFFFF',
                    borderRadius: '18px',
                    padding: '16px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        objectFit: 'cover',
                        border: isDark ? '2px solid rgba(188, 238, 38, 0.3)' : '2px solid #E2E8F0'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                          {member.name}
                        </span>
                        {isMe && (
                          <span style={{ fontSize: '10px', background: isDark ? 'rgba(188, 238, 38, 0.15)' : '#DCFCE7', color: isDark ? '#BCEE26' : '#15803D', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            Bạn
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
                        {member.role}
                      </div>
                      <div style={{ fontSize: '11px', color: isDark ? '#BCEE26' : '#15803D', fontWeight: 600, marginTop: '2px' }}>
                        ⭐ Credit {fullStudent?.creditScore || 96}/100 • {fullStudent?.completionRate || 98}% đúng hạn
                      </div>
                    </div>
                  </div>

                  {!isMe && onOpenReview && (
                    <button
                      onClick={() => onOpenReview(fullStudent)}
                      className="btn-interactive"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: isDark ? 'rgba(188, 238, 38, 0.14)' : 'rgba(140, 100, 255, 0.1)',
                        border: isDark ? '1px solid #BCEE26' : '1px solid #8C64FF',
                        color: isDark ? '#BCEE26' : '#6D28D9',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Star size={13} fill="currentColor" />
                      <span>Đánh giá & Tặng Credit</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: FILES & NOTES */}
        {activeTab === 'files' && (
          <div className="tab-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                background: isDark ? '#212330' : '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                Tài liệu & Đường dẫn quan trọng
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teamNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#E2E5EE' : '#334155' }}>
                      {note.title}
                    </span>
                    {note.link && (
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: isDark ? '#BCEE26' : '#6D28D9',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <span>Mở</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <input
                  type="text"
                  placeholder="Thêm link tài liệu hoặc ghi chú..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                    background: isDark ? '#181924' : '#FFFFFF',
                    color: isDark ? '#E2E5EE' : '#2D323E',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="submit"
                  className="btn-interactive"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: isDark ? '#BCEE26' : '#8C64FF',
                    border: 'none',
                    color: isDark ? '#141824' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Thêm
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Export Report */}
      {showExportModal && (
        <div
          className="modal-backdrop-anim"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 16, 24, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="modal-content-anim"
            style={{
              width: '100%',
              maxWidth: '520px',
              background: isDark ? '#212330' : '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: isDark ? '1px solid rgba(188, 238, 38, 0.3)' : '1px solid #E2E8F0',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowExportModal(false)}
              className="btn-interactive"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: isDark ? '#9AA3B8' : '#647087',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Download size={22} color={isDark ? '#BCEE26' : '#8C64FF'} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
                Báo cáo tiến độ & Phân công nhiệm vụ
              </h3>
            </div>

            <p style={{ margin: '0 0 14px', fontSize: '12px', color: isDark ? '#9AA3B8' : '#647087' }}>
              Bạn có thể sao chép văn bản này để dán vào file báo cáo nộp giảng viên, slide thuyết trình hoặc nhóm chat.
            </p>

            <pre
              style={{
                background: isDark ? '#181924' : '#F8FAFC',
                padding: '14px',
                borderRadius: '14px',
                fontSize: '12px',
                lineHeight: 1.5,
                color: isDark ? '#E2E5EE' : '#1E293B',
                maxHeight: '260px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #CBD5E1',
                fontFamily: 'monospace'
              }}
            >
              {getFormattedReport()}
            </pre>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={handleCopyReport}
                className="btn-interactive"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: copiedReport ? '#10B981' : (isDark ? '#BCEE26' : '#8C64FF'),
                  border: 'none',
                  color: copiedReport ? '#FFFFFF' : (isDark ? '#141824' : '#FFFFFF'),
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {copiedReport ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedReport ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép Markdown / Văn bản'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {showAddTaskModal && (
        <div
          className="modal-backdrop-anim"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 16, 24, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowAddTaskModal(false)}
        >
          <div
            className="modal-content-anim"
            style={{
              width: '100%',
              maxWidth: '440px',
              background: isDark ? '#212330' : '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
              + Thêm nhiệm vụ cho nhóm
            </h3>

            <form onSubmit={handleCreateNewTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Tên nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàn thiện slide thuyết trình..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                    background: isDark ? '#181924' : '#FFFFFF',
                    color: isDark ? '#E2E5EE' : '#2D323E',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Phụ trách (Assignee)
                </label>
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                    background: isDark ? '#181924' : '#FFFFFF',
                    color: isDark ? '#E2E5EE' : '#2D323E',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  {currentTeam?.members?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                    Hạn chót (Deadline)
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                      background: isDark ? '#181924' : '#FFFFFF',
                      color: isDark ? '#E2E5EE' : '#2D323E',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                      background: isDark ? '#181924' : '#FFFFFF',
                      color: isDark ? '#E2E5EE' : '#2D323E',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="High">Cao (High)</option>
                    <option value="Medium">Trung bình (Medium)</option>
                    <option value="Low">Thấp (Low)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="btn-interactive"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    border: 'none',
                    color: isDark ? '#CBD5E1' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-interactive"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: isDark ? '#BCEE26' : '#8C64FF',
                    border: 'none',
                    color: isDark ? '#141824' : '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Team */}
      {showCreateTeamModal && (
        <div
          className="modal-backdrop-anim"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 16, 24, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowCreateTeamModal(false)}
        >
          <div
            className="modal-content-anim"
            style={{
              width: '100%',
              maxWidth: '440px',
              background: isDark ? '#212330' : '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: isDark ? '#E2E5EE' : '#2D323E' }}>
              🚀 Tạo Team mới trên TeamWeaver
            </h3>

            <form onSubmit={handleCreateNewTeam} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Tên nhóm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Team Capstone COS10026..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                    background: isDark ? '#181924' : '#FFFFFF',
                    color: isDark ? '#E2E5EE' : '#2D323E',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#CBD5E1' : '#475569' }}>
                  Mục tiêu mong muốn (Target Goal)
                </label>
                <select
                  value={newTeamTarget}
                  onChange={(e) => setNewTeamTarget(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                    background: isDark ? '#181924' : '#FFFFFF',
                    color: isDark ? '#E2E5EE' : '#2D323E',
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="btn-interactive"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    border: 'none',
                    color: isDark ? '#CBD5E1' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-interactive"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: isDark ? '#BCEE26' : '#8C64FF',
                    border: 'none',
                    color: isDark ? '#141824' : '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Khởi tạo Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamHub;
