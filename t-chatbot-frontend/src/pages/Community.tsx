import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

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

  useEffect(() => {
    fetchSharedChats();
  }, [filter]);

  const fetchSharedChats = async () => {
    setIsLoading(true);
    try {
      const endpoint = filter === 'popular' 
        ? 'http://localhost:8080/api/community/popular'
        : 'http://localhost:8080/api/community';
      
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

  const handleLike = async (chatId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/community/${chatId}/like`,
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
      
      // 상세 모달이 열려있는 경우 업데이트
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
        `http://localhost:8080/api/community/${chatId}/comments`,
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
        `http://localhost:8080/api/community/${selectedChat.id}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      
      setComments([response.data, ...comments]);
      setNewComment('');
      
      // 댓글 수 업데이트
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
        `http://localhost:8080/api/community/comments/${commentId}`,
        { withCredentials: true }
      );
      
      setComments(comments.filter(c => c.id !== commentId));
      
      // 댓글 수 업데이트
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
    <div className="bg-[#1e1e1e] text-white min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8 max-w-7xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">커뮤니티</h1>
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                filter === 'recent'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                filter === 'popular'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              인기순
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">로딩 중...</p>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedChats.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">아직 공유된 채팅이 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">첫 번째로 채팅을 공유해보세요!</p>
              </div>
            ) : (
              sharedChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => openDetailModal(chat)}
                  className="bg-[#2d2d2d] rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
                >
                  {/* 채팅 미리보기 - 실제 채팅 UI 스타일 */}
                  <div className="bg-[#1e1e1e] p-4 space-y-3 min-h-[200px]">
                    {/* 사용자 메시지 */}
                    <div className="flex justify-end">
                      <div className="bg-[#282828] px-4 py-2 rounded-2xl max-w-[85%]">
                        <p className="text-gray-100 text-sm line-clamp-2 whitespace-pre-wrap">{chat.userMessage}</p>
                      </div>
                    </div>

                    {/* 봇 메시지 */}
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">T</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 text-sm line-clamp-3 whitespace-pre-wrap leading-relaxed">{chat.botResponse}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{chat.title}</h3>
                    
                    {chat.tags && (
                      <div className="mb-3">
                        {chat.tags.split(' ').map((word, index) => {
                          if (word.startsWith('#')) {
                            return (
                              <span key={index} className="text-xs text-blue-400 mr-2">
                                {word}
                              </span>
                            );
                          } else if (word.trim()) {
                            return (
                              <span key={index} className="text-xs text-gray-400 mr-1">
                                {word}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {chat.commentCount || 0}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(chat.id);
                          }}
                          className="flex items-center gap-1 transition-colors"
                        >
                          {chat.isLikedByCurrentUser ? (
                            <svg className="w-4 h-4 text-red-500" fill="red" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 20 20">
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                          )}
                          <span className="text-white">{chat.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* 상세 보기 모달 */}
      {showDetailModal && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d2d2d] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedChat.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{selectedChat.username}</span>
                  <span>•</span>
                  <span>{new Date(selectedChat.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 채팅 내용 */}
            <div className="bg-[#1e1e1e] rounded-lg p-4 mb-4 space-y-3">
              {/* 사용자 메시지 */}
              <div className="flex justify-end">
                <div className="bg-[#282828] px-4 py-2 rounded-2xl max-w-[85%]">
                  <p className="text-gray-100 whitespace-pre-wrap">{selectedChat.userMessage}</p>
                </div>
              </div>

              {/* 봇 메시지 */}
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">T</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{selectedChat.botResponse}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 태그 */}
            {selectedChat.tags && (
              <div className="mb-4">
                {selectedChat.tags.split(' ').map((word, index) => {
                  if (word.startsWith('#')) {
                    return (
                      <span key={index} className="text-sm text-blue-400 mr-2">
                        {word}
                      </span>
                    );
                  } else if (word.trim()) {
                    return (
                      <span key={index} className="text-sm text-gray-400 mr-1">
                        {word}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* 좋아요 */}
            <div className="mb-6 pb-6 border-b border-[#3c4043]">
              <button
                onClick={() => handleLike(selectedChat.id)}
                className="flex items-center gap-2 transition-colors"
              >
                {selectedChat.isLikedByCurrentUser ? (
                  <svg className="w-5 h-5 text-red-500" fill="red" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                )}
                <span className="font-medium text-white">{selectedChat.likes}</span>
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div>
              <h3 className="text-lg font-bold mb-4">댓글 {comments.length}개</h3>
              
              {/* 댓글 입력 */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 bg-[#1e1e1e] border border-[#3c4043] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  등록
                </button>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">첫 번째 댓글을 남겨보세요!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1e1e1e] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                            <span className="text-xs font-medium">{comment.username.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-sm">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors text-xs"
                        >
                          삭제
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
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
