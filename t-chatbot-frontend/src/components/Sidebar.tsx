import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import sidebarCloseButton from '../assets/icon/sidebarToggleButton.png';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatSession {
  id: number;
  title: string;
  mode: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 세션 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/sessions', {
        withCredentials: true,
      });
      setSessions(response.data);
    } catch (error) {
      console.error('세션 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSessionClick = (sessionId: number) => {
    navigate(`/chat?session=${sessionId}`);
    onClose();
  };

  const handleNewChat = () => {
    navigate('/chat');
    onClose();
  };

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 세션 클릭 이벤트 방지
    
    if (!confirm('이 대화를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/sessions/${sessionId}`, {
        withCredentials: true,
      });
      loadSessions(); // 목록 새로고침
    } catch (error) {
      console.error('세션 삭제 실패:', error);
      alert('세션 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '오늘';
    } else if (days === 1) {
      return '어제';
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>대화 목록</h2>
        <button
          onClick={onClose}
          className="sidebar-close"
          aria-label="사이드바 닫기"
        >
          <img src={sidebarCloseButton} alt="사이드바 닫기" />
        </button>
      </div>

      <div className="sidebar-new-chat">
        <button onClick={handleNewChat} className="new-chat-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>새 채팅</span>
        </button>
      </div>

      <div className="sidebar-sessions">
        {isLoading ? (
          <div className="sidebar-loading">로딩 중...</div>
        ) : sessions.length === 0 ? (
          <div className="sidebar-empty">저장된 대화가 없습니다.</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="session-item"
              onClick={() => handleSessionClick(session.id)}
            >
              <div className="session-header">
                <h3 className="session-title">{session.title}</h3>
                <button
                  className="session-delete"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  title="삭제"
                >
                  ×
                </button>
              </div>
              <p className="session-preview">{session.lastMessage}</p>
              <div className="session-meta">
                <span className="session-mode">{getModeLabel(session.mode)}</span>
                <span className="session-date">{formatDate(session.updatedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="sidebar-nav">
        <button
          onClick={() => handleNavigation('/community')}
          className="sidebar-nav-item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>커뮤니티</span>
        </button>
      </nav>
    </aside>
  );
}

function getModeLabel(mode: string): string {
  switch (mode) {
    case 'love':
      return '💕 연애';
    case 'tbrainwash':
      return '🧠 F형';
    default:
      return '💬 기본';
  }
}

export default Sidebar;
