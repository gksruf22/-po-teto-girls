import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#1e1e1e] p-4 border-b border-[#3c4043]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-medium">
            <span className="text-white">T-Talk</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/chat" 
            className="text-gray-300 hover:bg-[#3c4043] px-4 py-2 rounded-lg transition-colors text-sm"
          >
            채팅
          </Link>
          {isLoggedIn && (
            <Link 
              to="/history" 
              className="text-gray-300 hover:bg-[#3c4043] px-4 py-2 rounded-lg transition-colors text-sm"
            >
              히스토리
            </Link>
          )}
        </nav>

        {/* Right Section - Login Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 bg-[#282828] px-3 py-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-medium">{username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-gray-300 text-sm">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-[#3c4043] px-4 py-2 rounded-lg transition-colors text-sm"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:bg-[#3c4043] px-4 py-2 rounded-lg transition-colors text-sm"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                시작하기
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
