import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './Chat.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMessage = location.state?.initialMessage || '';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareTags, setShareTags] = useState('');
  const [selectedQA, setSelectedQA] = useState<{ userMsg: string; botMsg: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'default' | 'love' | 'tbrainwash'>('default');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const hasProcessedInitialMessage = useRef(false);

  const modeNames = {
    default: '기본 모드',
    love: '연애 모드',
    tbrainwash: 'T세뇌 모드',
  };

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', {
          withCredentials: true,
        });
        console.log('로그인 상태:', response.data);
        if (response.status === 200 && response.data.email) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  // 초기 메시지 자동 전송 (한 번만)
  useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [];
      for (let i = 0; i < messages.length; i += 2) {
        if (messages[i] && messages[i].sender === 'user' && messages[i + 1] && messages[i + 1].sender === 'bot') {
          conversationHistory.push({
            userMessage: messages[i].text,
            botResponse: messages[i + 1].text
          });
        }
      }

      const response = await axios.post(
        'http://localhost:8080/api/chat',
        { 
          message: messageText,
          mode: selectedMode,
          conversationHistory: conversationHistory
        },
        { withCredentials: true }
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error('API 통신 중 오류 발생:', error);

      if (error.response?.status === 401) {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorDetail = error.response?.data?.message || error.message || '알 수 없는 오류';
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: `죄송합니다, 서버와 통신 중 오류가 발생했습니다.\n상세: ${errorDetail}`,
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    handleSendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const openShareModal = (userMessage: string, botResponse: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setSelectedQA({ userMsg: userMessage, botMsg: botResponse });
    setShareTitle('');
    setShareTags('');
    setShowShareModal(true);
  };

  const handleShareSubmit = async () => {
    if (!selectedQA || !shareTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/community/share',
        {
          title: shareTitle,
          tags: shareTags,
          userMessage: selectedQA.userMsg,
          botResponse: selectedQA.botMsg,
        },
        { withCredentials: true }
      );

      console.log('공유 성공:', response.data);
      setShowShareModal(false);
      alert('커뮤니티에 공유되었습니다!');
      navigate('/community');
    } catch (error: any) {
      console.error('공유 오류 상세:', error);

      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
        alert(`공유 중 오류가 발생했습니다.\n상세: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="chat-container">
      <Header />

      {/* 공유하기 모달 */}
      {showShareModal && selectedQA && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h2>공유하기</h2>

            {/* 채팅 미리보기 */}
            <div className="chat-preview">
              <div className="chat-preview-messages">
                <div className="message-row user">
                  <div className="user-message-bubble">
                    <div className="user-message-header">
                      <span>User Name</span>
                    </div>
                    <p className="user-message-text">{selectedQA.userMsg}</p>
                  </div>
                </div>

                <div className="message-row bot">
                  <div className="bot-message-container">
                    <div className="bot-avatar">
                      <span>T</span>
                    </div>
                    <div className="bot-message-content">
                      <p className="bot-name">T-Talk</p>
                      <p className="bot-message-text">{selectedQA.botMsg}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>제목</label>
              <input
                type="text"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                className="form-input"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>내용 / 태그</label>
              <textarea
                value={shareTags}
                onChange={(e) => setShareTags(e.target.value)}
                className="form-textarea"
                placeholder="추가 설명이나 해시태그를 입력하세요 (예: 이 답변 정말 도움됐어요 #AI #코딩)"
                rows={3}
              />
              <p className="form-help-text">
                #를 붙이면 해시태그로 표시됩니다 (띄어쓰기로 구분)
              </p>
            </div>

            <div className="button-group">
              <button
                onClick={() => setShowShareModal(false)}
                className="btn-cancel"
              >
                취소
              </button>
              <button
                onClick={handleShareSubmit}
                className="btn-submit"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <main className="messages-container">
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div key={msg.id} className="message-item">
              <div className={`message-content ${msg.sender}`}>
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.sender === 'bot' ? (
                    <div className="bot-message-wrapper">
                      <div className="bot-avatar">
                        <span>T</span>
                      </div>
                      <div className="bot-content">
                        <p className="bot-name">T-Talk</p>
                        <p className="bot-message-text">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="message-text">{msg.text}</p>
                  )}
                </div>
              </div>

              {/* 봇 응답 후 구분선 + 공유 버튼 */}
              {msg.sender === 'bot' && (
                <div className="message-divider">
                  <div className="divider-line"></div>
                  <button
                    onClick={() => {
                      const userMessage = index > 0 && messages[index - 1].sender === 'user'
                        ? messages[index - 1].text 
                        : '질문 없음';
                      openShareModal(userMessage, msg.text);
                    }}
                    className="share-button"
                    title="공유하기"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                  <div className="divider-line"></div>
                </div>
              )}
            </div>
          ))}

          {/* 로딩 애니메이션 */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-wrapper">
                <div className="bot-avatar">
                  <span>T</span>
                </div>
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 입력창 */}
      <footer className="input-footer">
        <div className="input-container">
          <div className="input-wrapper">
            {/* 모드 선택 버튼 */}
            <div className="mode-selector">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="mode-button"
                title="모드 선택"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              {/* 모드 드롭다운 */}
              {showModeDropdown && (
                <div className="mode-dropdown">
                  <button
                    onClick={() => {
                      setSelectedMode('default');
                      setShowModeDropdown(false);
                    }}
                    className={`mode-option default ${selectedMode === 'default' ? 'active' : ''}`}
                  >
                    <div className="mode-option-content">
                      {selectedMode === 'default' && (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>기본 모드</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMode('love');
                      setShowModeDropdown(false);
                    }}
                    className={`mode-option love ${selectedMode === 'love' ? 'active' : ''}`}
                  >
                    <div className="mode-option-content">
                      {selectedMode === 'love' && (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>💖 연애 모드</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMode('tbrainwash');
                      setShowModeDropdown(false);
                    }}
                    className={`mode-option tbrainwash ${selectedMode === 'tbrainwash' ? 'active' : ''}`}
                  >
                    <div className="mode-option-content">
                      {selectedMode === 'tbrainwash' && (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>🧠 T세뇌 모드</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 현재 선택된 모드 표시 */}
            <div className="current-mode">
              <span>{modeNames[selectedMode]}</span>
            </div>

            <input
              type="text"
              className="message-input"
              placeholder={isLoading ? '답변을 기다리는 중...' : '메시지를 입력하세요'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="send-button"
              disabled={isLoading || input.trim() === ''}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Chat;
