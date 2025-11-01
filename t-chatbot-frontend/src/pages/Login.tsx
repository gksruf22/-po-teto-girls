import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';
import './Login.css';

function Login() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if(tab === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        const response = await axios.post('http://localhost:8080/api/auth/signup', {
          email,
          password,
          username,
        }, {
          withCredentials: true
        });
        
        login(response.data.username, response.data.email);
        navigate('/');
      } else {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password,
        }, {
          withCredentials: true
        });
        
        login(response.data.username, response.data.email);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Link to="/" className="login-logo">
          <img src={ logo } alt="로고"/>
        </Link>

        <div className="login-card">
          <div className="login-tabs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`tab-button ${!isSignUp ? 'active' : ''}`}
            >
              로그인
            </button>
            <span className="tab-divider">|</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`tab-button ${isSignUp ? 'active' : ''}`}
            >
              회원가입
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-field">
                <label className="form-label">
                  이름
                </label>
                <input
                  type="text"
                  className="form-input-field"
                  placeholder="이름을 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label className="form-label">
                이메일
              </label>
              <input
                type="email"
                className="form-input-field"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                비밀번호
              </label>
              <input
                type="password"
                className="form-input-field"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              {isSignUp ? '계정 만들기' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
