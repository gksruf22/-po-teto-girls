import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { username } = useAuth();

  const handleStart = () => {
    if (input.trim() === '') return;
    // 입력값과 함께 채팅 페이지로 이동
    navigate('/chat', { state: { initialMessage: input } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen flex flex-col">
      <Header />
      
      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            {username ? (
              <h1 className="text-5xl md:text-7xl font-normal">
                안녕하세요, <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">{username}</span> 님
              </h1>
            ) : (
              <h1 className="text-5xl md:text-7xl font-normal">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">T-Talk</span>
              </h1>
            )}
            <p className="text-xl md:text-2xl text-gray-400">
              T 유형을 위한 진짜 공감 챗봇
            </p>
          </div>

          {/* Input Section */}
          <div className="mt-12">
            <div className="bg-[#282828] hover:bg-[#303030] transition-colors rounded-full p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-[#3c4043] rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:outline-none text-lg text-white placeholder-gray-500"
                  placeholder="T-Talk에게 물어보기"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="p-2 hover:bg-[#3c4043] rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>T-Talk은 실험적 기능을 포함하고 있으며 부정확한 정보를 표시할 수 있습니다.</p>
      </footer>
    </div>
  );
}

export default Home;
