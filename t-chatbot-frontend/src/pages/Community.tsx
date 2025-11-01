import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';
import './Community.css';

interface SharedChat {
  id: number;
  userId: string;
  username: string;
  title: string;
  tags: string;
  userMessage: string;
  botResponse: string;
  createdAt: string;
  likes: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

interface Comment {
  id: number;
  sharedChatId: number;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

function Community() {
  const [sharedChats, setSharedChats] = useState<SharedChat[]>([]);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<SharedChat | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);


  // 커뮤니티 페이지는 기본 테마 사용
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", "default");
  }, []);
  useEffect(() => {
    fetchSharedChats();
  }, [filter]);

  const fetchSharedChats = async () => {
    setIsLoading(true);
    try {
      let endpoint = API_ENDPOINTS.COMMUNITY;
      
      if (isSearching && searchQuery.trim()) {
        endpoint = API_ENDPOINTS.COMMUNITY_SEARCH(searchQuery.trim());
      } else if (filter === 'popular') {
        endpoint = API_ENDPOINTS.COMMUNITY_POPULAR;
      }
      
      const response = await axios.get(endpoint, {
        withCredentials: true
      });
      setSharedChats(response.data);
    } catch (error) {
      console.error('공유 채팅 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setFilter('recent'); // 검색 시 필터 초기화
    fetchSharedChats();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchSharedChats();
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setIsSearching(true);
    setFilter('recent');
    // 검색 실행
    setTimeout(() => {
      const endpoint = API_ENDPOINTS.COMMUNITY_SEARCH(tag);
      setIsLoading(true);
      axios.get(endpoint, { withCredentials: true })
        .then(response => {
          setSharedChats(response.data);
        })
        .catch(error => {
          console.error('태그 검색 오류:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 100);
  };

  const handleLike = async (chatId: number) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.COMMUNITY_LIKE(chatId),
        {},
        { withCredentials: true }
      );
      
      setSharedChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId ? { 
            ...chat, 
            likes: response.data.likes,
            isLikedByCurrentUser: response.data.isLikedByCurrentUser
          } : chat
        )
      );
      
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat({ 
          ...selectedChat, 
          likes: response.data.likes,
          isLikedByCurrentUser: response.data.isLikedByCurrentUser
        });
      }
    } catch (error) {
      console.error('좋아요 오류:', error);
    }
  };

  const openDetailModal = async (chat: SharedChat) => {
    setSelectedChat(chat);
    setShowDetailModal(true);
    setNewComment('');
    await fetchComments(chat.id);
  };

  const fetchComments = async (chatId: number) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.COMMUNITY_COMMENTS(chatId),
        { withCredentials: true }
      );
      setComments(response.data);
    } catch (error) {
      console.error('댓글 조회 오류:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedChat || !newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.COMMUNITY_COMMENTS(selectedChat.id),
        { content: newComment },
        { withCredentials: true }
      );
      
      setComments([response.data, ...comments]);
      setNewComment('');
      
      setSharedChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id ? { ...chat, commentCount: chat.commentCount + 1 } : chat
        )
      );
      setSelectedChat({ ...selectedChat, commentCount: selectedChat.commentCount + 1 });
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('댓글 추가 중 오류가 발생했습니다.');
      }
      console.error('댓글 추가 오류:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(
        API_ENDPOINTS.COMMUNITY_COMMENT_DELETE(commentId),
        { withCredentials: true }
      );
      
      setComments(comments.filter(c => c.id !== commentId));
      
      if (selectedChat) {
        setSharedChats(prevChats =>
          prevChats.map(chat =>
            chat.id === selectedChat.id ? { ...chat, commentCount: chat.commentCount - 1 } : chat
          )
        );
        setSelectedChat({ ...selectedChat, commentCount: selectedChat.commentCount - 1 });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '댓글 삭제 중 오류가 발생했습니다.');
      console.error('댓글 삭제 오류:', error);
    }
  };

  return (
    <div className="community-container">
      <Header />
      
      <main className="community-main">
        <div className="community-header">
          <h1 className="community-title">커뮤니티</h1>
          
          <div className="search-and-filter">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="제목, 내용, 해시태그로 검색..."
                className="search-input"
              />
              {isSearching && searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="clear-search-button"
                  title="검색 초기화"
                >
                  ✕
                </button>
              )}
              <button
                onClick={handleSearch}
                className="search-button"
              >
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="filter-buttons">
              <button
                onClick={() => {
                  setFilter('recent');
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className={`filter-button ${filter === 'recent' && !isSearching ? 'active' : 'inactive'}`}
              >
                최신순
              </button>
              <button
                onClick={() => {
                  setFilter('popular');
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className={`filter-button ${filter === 'popular' && !isSearching ? 'active' : 'inactive'}`}
              >
                인기순
              </button>
            </div>
          </div>
        </div>

        {isSearching && searchQuery && (
          <div className="search-info">
            <span>'{searchQuery}' 검색 결과: {sharedChats.length}개</span>
          </div>
        )}

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">로딩 중...</p>
          </div>
        )}

        {!isLoading && (
          <div className="chat-grid">
            {sharedChats.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">아직 공유된 채팅이 없습니다.</p>
                <p className="empty-state-subtext">첫 번째로 채팅을 공유해보세요!</p>
              </div>
            ) : (
              sharedChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => openDetailModal(chat)}
                  className="chat-card"
                >
                  <div className="chat-preview">
                    <div className="user-message-container">
                      <div className="user-message">
                        <p className="user-message-text">{chat.userMessage}</p>
                      </div>
                    </div>

                    <div className="bot-message-container">
                      <div className="bot-message-wrapper">
                        <div className="bot-avatar">
                          <span className="bot-avatar-text">T</span>
                        </div>
                        <div className="bot-message-content">
                          <p className="bot-message-text">{chat.botResponse}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="chat-info">
                    <h3 className="chat-title">{chat.title}</h3>
                    <p className="chat-author">by. {chat.username}</p>
                    {chat.tags && (
                      <div className="chat-tags">
                        {chat.tags.split(' ').map((word, index) => {
                          if (word.startsWith('#')) {
                            return (
                              <span 
                                key={index} 
                                className="tag clickable-tag"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagClick(word);
                                }}
                              >
                                {word}
                              </span>
                            );
                          } else if (word.trim()) {
                            return (
                              <span key={index} className="tag-text">
                                {word}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                    
                    <div className="chat-footer">
                      <div className="footer-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(chat.id);
                          }}
                          className="like-button"
                        >
                          {chat.isLikedByCurrentUser ? (
                            <svg className="icon icon-liked" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="icon icon-not-liked" viewBox="0 0 20 20">
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                          )}
                          <span className="like-count">{chat.likes}</span>
                        </button>
                        <span className="comment-count">
                          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {chat.commentCount || 0}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {showDetailModal && selectedChat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>{selectedChat.title}</h2>
                <div className="modal-meta">
                  <span>{selectedChat.username}</span>
                  <span>•</span>
                  <span>{new Date(selectedChat.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="close-button"
              >
                <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-chat-content">
              <div className="user-message-container">
                <div className="modal-user-message">
                  <p>{selectedChat.userMessage}</p>
                </div>
              </div>

              <div className="bot-message-container">
                <div className="bot-message-wrapper">
                  <div className="bot-avatar">
                    <span className="bot-avatar-text">T</span>
                  </div>
                  <div className="bot-message-content">
                    <p className="modal-bot-message">{selectedChat.botResponse}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedChat.tags && (
              <div className="modal-tags">
                {selectedChat.tags.split(' ').map((word, index) => {
                  if (word.startsWith('#')) {
                    return (
                      <span 
                        key={index} 
                        className="modal-tag clickable-tag"
                        onClick={() => {
                          setShowDetailModal(false);
                          handleTagClick(word);
                        }}
                      >
                        {word}
                      </span>
                    );
                  } else if (word.trim()) {
                    return (
                      <span key={index} className="modal-tag-text">
                        {word}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            <div className="modal-like-section">
              <button
                onClick={() => handleLike(selectedChat.id)}
                className="modal-like-button"
              >
                {selectedChat.isLikedByCurrentUser ? (
                  <svg className="modal-like-icon icon-liked" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="modal-like-icon icon-not-liked" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                )}
                <span className="modal-like-count">{selectedChat.likes}</span>
              </button>
            </div>

            <div className="comments-section">
              <h3>댓글 {comments.length}개</h3>
              
              <div className="comment-input-wrapper">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="댓글을 입력하세요..."
                  className="comment-input"
                />
                <button
                  onClick={handleAddComment}
                  className="comment-submit-button"
                >
                  등록
                </button>
              </div>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="empty-comments">첫 번째 댓글을 남겨보세요!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <div className="comment-avatar">
                            <span className="comment-avatar-text">{comment.username.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="comment-username">{comment.username}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="comment-delete-button"
                        >
                          삭제
                        </button>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
