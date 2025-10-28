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
}

function Community() {
  const [sharedChats, setSharedChats] = useState<SharedChat[]>([]);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(false);

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
          chat.id === chatId ? { ...chat, likes: response.data.likes } : chat
        )
      );
    } catch (error) {
      console.error('좋아요 오류:', error);
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
                          0
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(chat.id);
                          }}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {chat.likes}
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
    </div>
  );
}

export default Community;
