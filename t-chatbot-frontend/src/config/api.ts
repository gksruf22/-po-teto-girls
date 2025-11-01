// API 기본 URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// API 엔드포인트 헬퍼
export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  AUTH_CHECK: `${API_BASE_URL}/api/auth/check`,
  
  // Chat
  CHAT: `${API_BASE_URL}/api/chat`,
  CHAT_SESSIONS: `${API_BASE_URL}/api/sessions`,
  CHAT_SESSION_DETAIL: (id: number) => `${API_BASE_URL}/api/sessions/${id}`,
  CHAT_SESSION_DELETE: (id: number) => `${API_BASE_URL}/api/sessions/${id}`,
  
  // Community
  COMMUNITY: `${API_BASE_URL}/api/community`,
  COMMUNITY_POPULAR: `${API_BASE_URL}/api/community/popular`,
  COMMUNITY_SEARCH: (query: string) => `${API_BASE_URL}/api/community/search?q=${encodeURIComponent(query)}`,
  COMMUNITY_SHARE: `${API_BASE_URL}/api/community/share`,
  COMMUNITY_LIKE: (id: number) => `${API_BASE_URL}/api/community/${id}/like`,
  COMMUNITY_UNLIKE: (id: number) => `${API_BASE_URL}/api/community/${id}/unlike`,
  COMMUNITY_COMMENTS: (id: number) => `${API_BASE_URL}/api/community/${id}/comments`,
  COMMUNITY_COMMENT_DELETE: (commentId: number) => `${API_BASE_URL}/api/community/comments/${commentId}`,
};
