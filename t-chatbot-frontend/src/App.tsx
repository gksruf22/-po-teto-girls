import React, { useState } from 'react';
import axios from 'axios'; // axios를 import 합니다.

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]); // 초기 메시지를 비웁니다.
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    // 1. 사용자 메시지를 화면에 먼저 추가
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. 백엔드 API에 메시지 전송
      const response = await axios.post('http://localhost:8080/api/chat', {
        message: input,
      });

      // 3. 백엔드로부터 받은 응답을 화면에 추가
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("API 통신 중 오류 발생:", error);
      // 4. 에러 발생 시 에러 메시지 표시
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "죄송합니다, 서버와 통신 중 오류가 발생했습니다.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <div className="bg-gray-800 text-white h-screen flex flex-col">
      <header className="bg-gray-900 shadow-md p-4">
        <h1 className="text-xl font-bold text-center text-cyan-400">T를 위한 공감 챗봇</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 rounded-br-none'
                  : 'bg-gray-700 rounded-bl-none'
              }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-gray-700 rounded-bl-none px-4 py-2 rounded-lg shadow">
                  <p>답변을 생성 중입니다...</p>
              </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 p-4">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-gray-700 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            placeholder={isLoading ? "답변을 기다리는 중..." : "메시지를 입력하세요..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="ml-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            전송
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;