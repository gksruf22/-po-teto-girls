import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/images/logo.png';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    // 쿼리 파라미터 없이 /chat으로 이동 (새 채팅)
    navigate('/chat', { replace: false });
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img className="header-logo" src={logo} alt="logo" />
        </Link>

        <nav className="nav">
          <Link to="/chat" className="nav-link" onClick={handleNewChat}>
            채팅
          </Link>
          <Link to="/community" className="nav-link">
            커뮤니티
          </Link>
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
                Login
              </button>
              <button
                onClick={() => navigate('/login?tab=signup')}
                className="btn-primary"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
