import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo-text">
            <span>T-Talk</span>
          </div>
        </Link>

        <nav className="nav">
          <Link to="/chat" className="nav-link">
            채팅
          </Link>
          <Link to="/community" className="nav-link">
            커뮤니티
          </Link>
          {isLoggedIn && (
            <Link to="/history" className="nav-link">
              히스토리
            </Link>
          )}
        </nav>

        <div className="right-section">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  <span>{username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="username">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
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
