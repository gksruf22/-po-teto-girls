import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMessage = location.state?.initialMessage || '';
  const { token, isLoggedIn } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessedInitialMessage = useRef(false);

  // 컴포넌트 마운트 시 초기 메시지가 있으면 자동 전송 (한 번만)
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
      // 헤더에 JWT 토큰 포함
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post('http://localhost:8080/api/chat', {
        message: messageText,
      }, { headers });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("API 통신 중 오류 발생:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "죄송합니다, 서버와 통신 중 오류가 발생했습니다.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    handleSendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white h-screen flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl ${
                msg.sender === 'user'
                  ? 'bg-[#282828] px-5 py-3 rounded-2xl'
                  : ''
              }`}>
              {msg.sender === 'bot' && (
                <div className="flex gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">T</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">T-Talk</p>
                    <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.sender === 'user' && (
                <p className="whitespace-pre-wrap text-gray-100">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
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

      <footer className="border-t border-[#3c4043] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#282828] rounded-full p-2 flex items-center gap-2">
            <button className="p-2 hover:bg-[#3c4043] rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-500 px-2"
              placeholder={isLoading ? "답변을 기다리는 중..." : "메시지를 입력하세요"}
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
