import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  email: string | null;
  login: (username: string, email: string) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // 세션 확인 함수
  const checkSession = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH_CHECK, {
        withCredentials: true  // 쿠키 전송
      });
      
      if (response.status === 200) {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setIsLoggedIn(true);
      }
    } catch (error) {
      // 세션이 없거나 만료됨
      setUsername(null);
      setEmail(null);
      setIsLoggedIn(false);
    }
  };

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    checkSession();
  }, []);

  const login = (newUsername: string, newEmail: string) => {
    setUsername(newUsername);
    setEmail(newEmail);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axios.post(API_ENDPOINTS.AUTH_LOGOUT, {}, {
        withCredentials: true  // 쿠키 전송
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    }
    
    setUsername(null);
    setEmail(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, email, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
