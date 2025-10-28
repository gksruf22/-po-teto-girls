import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

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
        // 200 OK 응답을 받으면 로그인된 것
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
      const response = await axios.post(
        'http://localhost:8080/api/chat',
        { 
          message: messageText,
          mode: selectedMode 
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
      console.error('에러 상세:', error.response?.data);
      console.error('에러 상태:', error.response?.status);

      if (error.response?.status === 401) {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorDetail =
          error.response?.data?.message || error.message || '알 수 없는 오류';
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

  // 공유하기 모달 열기
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

    console.log('공유 요청 데이터:', {
      title: shareTitle,
      tags: shareTags,
      userMessage: selectedQA.userMsg,
      botResponse: selectedQA.botMsg,
    });

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
      console.error('공유 오류 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

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
    <div className="bg-[#1e1e1e] text-white h-screen flex flex-col">
      <Header />

      {/* 공유하기 모달 */}
      {showShareModal && selectedQA && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d2d2d] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">공유하기</h2>

            {/* 채팅 미리보기 - 실제 채팅 UI처럼 */}
            <div className="bg-[#1e1e1e] rounded-lg p-4 mb-6 space-y-4">
              {/* 사용자 메시지 */}
              <div className="flex justify-end">
                <div className="bg-[#282828] px-5 py-3 rounded-2xl max-w-[80%]">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs text-gray-400">User Name</span>
                  </div>
                  <p className="text-gray-100 text-sm whitespace-pre-wrap">{selectedQA.userMsg}</p>
                </div>
              </div>

              {/* 봇 메시지 */}
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">T</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">T-Talk</p>
                    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedQA.botMsg}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#3c4043] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">내용 / 태그</label>
              <textarea
                value={shareTags}
                onChange={(e) => setShareTags(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#3c4043] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="추가 설명이나 해시태그를 입력하세요 (예: 이 답변 정말 도움됐어요 #AI #코딩)"
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">
                #를 붙이면 해시태그로 표시됩니다 (띄어쓰기로 구분)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 bg-[#3c4043] hover:bg-[#4c5053] rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleShareSubmit}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div key={msg.id}>
            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-2xl ${
                  msg.sender === 'user' ? 'bg-[#282828] px-5 py-3 rounded-2xl' : ''
                }`}
              >
                {msg.sender === 'bot' ? (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">T</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">T-Talk</p>
                      <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  // ✅ 사용자 메시지: 예전 버전 스타일
                  <p className="whitespace-pre-wrap text-gray-100">{msg.text}</p>
                )}
              </div>
            </div>

            {/* 봇 응답 후 구분선 + 공유 버튼 */}
            {msg.sender === 'bot' && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#3c4043]"></div>
                <button
                  onClick={() => {
                    // 바로 이전 사용자 메시지 찾기
                    const userMessage = index > 0 && messages[index - 1].sender === 'user' 
                      ? messages[index - 1].text 
                      : '질문 없음';
                    openShareModal(userMessage, msg.text);
                  }}
                  className="p-2 bg-[#2d2d2d] border border-[#3c4043] hover:border-blue-500 rounded-full transition-all"
                  title="공유하기"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 hover:text-blue-500"
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
                <div className="flex-1 h-px bg-[#3c4043]"></div>
              </div>
            )}
          </div>
        ))}

        {/* 로딩 애니메이션 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium">T</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 입력창 */}
      <footer className="border-t border-[#3c4043] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#282828] rounded-full p-2 flex items-center gap-2">
            {/* 모드 선택 버튼 */}
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="p-2 hover:bg-[#3c4043] rounded-full transition-colors"
                title="모드 선택"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              {/* 모드 드롭다운 */}
              {showModeDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#2d2d2d] rounded-lg shadow-lg border border-[#3c4043] overflow-hidden min-w-[150px]">
                  <button
                    onClick={() => {
                      setSelectedMode('default');
                      setShowModeDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#3c4043] transition-colors ${
                      selectedMode === 'default' ? 'bg-[#3c4043] text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedMode === 'default' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm">기본 모드</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMode('love');
                      setShowModeDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#3c4043] transition-colors ${
                      selectedMode === 'love' ? 'bg-[#3c4043] text-pink-400' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedMode === 'love' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm">💖 연애 모드</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMode('tbrainwash');
                      setShowModeDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#3c4043] transition-colors ${
                      selectedMode === 'tbrainwash' ? 'bg-[#3c4043] text-purple-400' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedMode === 'tbrainwash' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm">🧠 T세뇌 모드</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 현재 선택된 모드 표시 */}
            <div className="px-3 py-1 bg-[#3c4043] rounded-full">
              <span className="text-xs text-gray-400">{modeNames[selectedMode]}</span>
            </div>

            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-500 px-2"
              placeholder={isLoading ? '답변을 기다리는 중...' : '메시지를 입력하세요'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="p-2 hover:bg-[#3c4043] rounded-full transition-colors disabled:opacity-50"
              disabled={isLoading || input.trim() === ''}
            >
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
