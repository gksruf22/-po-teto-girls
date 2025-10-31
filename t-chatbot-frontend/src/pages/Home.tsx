import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import sidebarToggleButton from '../assets/icon/sidebarToggleButton.png';
import './Home.css';

function Home() {
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<'default' | 'love' | 'tbrainwash'>('default');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { username } = useAuth();

  const modeNames = {
    default: '기본 모드',
    love: '연애 모드',
    tbrainwash: 'F형 모드',
  };

  // 홈 페이지는 기본 테마 사용
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", selectedMode);
  }, [selectedMode]);

  const handleStart = () => {
    if (input.trim() === '') return;
    navigate('/chat', { state: { initialMessage: input, mode: selectedMode } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="home-container">
      <Header />
      
      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 메인 콘텐츠 영역 */}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {/* 사이드바 토글 버튼 */}
        <button 
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="사이드바 열기"
        >
          <img src={sidebarToggleButton} alt="사이드바 토글" />
        </button>
      
        <main className="hero-section">
        <div className="hero-content">
          <div className="input-section">
            <div className="input-box">
              <div className="input-row">
                {/* 모드 선택 버튼 */}
                <div className="mode-selector">
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="input-icon-button mode-button"
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
                          <span>연애 모드</span>
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
                          <span>F형 모드</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  className="home-input"
                  placeholder="T-Talk에게 물어보기"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                
                {/* 전송 버튼 */}
                <button
                  onClick={handleStart}
                  className="input-icon-button send-button"
                  disabled={input.trim() === ''}
                  title="전송"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default Home;
