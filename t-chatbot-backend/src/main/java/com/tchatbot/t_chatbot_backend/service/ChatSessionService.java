package com.tchatbot.t_chatbot_backend.service;

import com.tchatbot.t_chatbot_backend.dto.ChatSessionDetailResponse;
import com.tchatbot.t_chatbot_backend.dto.ChatSessionResponse;
import com.tchatbot.t_chatbot_backend.entity.ChatHistory;
import com.tchatbot.t_chatbot_backend.entity.ChatSession;
import com.tchatbot.t_chatbot_backend.entity.User;
import com.tchatbot.t_chatbot_backend.repository.ChatHistoryRepository;
import com.tchatbot.t_chatbot_backend.repository.ChatSessionRepository;
import com.tchatbot.t_chatbot_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatSessionService {
    
    private final ChatSessionRepository chatSessionRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public ChatSessionService(ChatSessionRepository chatSessionRepository, 
                             ChatHistoryRepository chatHistoryRepository,
                             UserRepository userRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatHistoryRepository = chatHistoryRepository;
        this.userRepository = userRepository;
    }
    
    // 새 세션 생성
    @Transactional
    public ChatSession createSession(String email, String mode, String title) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setMode(mode != null ? mode : "default");
        session.setTitle(title != null ? title : "새로운 대화");
        
        return chatSessionRepository.save(session);
    }
    
    // 세션에 메시지 추가 및 저장
    @Transactional
    public ChatHistory addMessageToSession(Long sessionId, String userMessage, String botResponse, String email) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다."));
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 첫 메시지면 제목 자동 생성
        if (session.getMessages().isEmpty() && "새로운 대화".equals(session.getTitle())) {
            session.generateTitleFromFirstMessage(userMessage);
        }
        
        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUser(user);
        chatHistory.setChatSession(session);
        chatHistory.setUserMessage(userMessage);
        chatHistory.setBotResponse(botResponse);
        
        chatHistory = chatHistoryRepository.save(chatHistory);
        
        // 세션의 updatedAt이 자동으로 갱신됨
        chatSessionRepository.save(session);
        
        return chatHistory;
    }
    
    // 사용자의 모든 세션 목록 조회
    @Transactional(readOnly = true)
    public List<ChatSessionResponse> getUserSessions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<ChatSession> sessions = chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
        
        return sessions.stream().map(session -> {
            ChatSessionResponse response = new ChatSessionResponse();
            response.setId(session.getId());
            response.setTitle(session.getTitle());
            response.setMode(session.getMode());
            response.setCreatedAt(session.getCreatedAt());
            response.setUpdatedAt(session.getUpdatedAt());
            response.setMessageCount(session.getMessages().size());
            
            // 마지막 메시지 미리보기
            if (!session.getMessages().isEmpty()) {
                ChatHistory lastMessage = session.getMessages().get(session.getMessages().size() - 1);
                String preview = lastMessage.getUserMessage();
                response.setLastMessage(preview.length() > 50 ? preview.substring(0, 47) + "..." : preview);
            } else {
                response.setLastMessage("메시지가 없습니다.");
            }
            
            return response;
        }).collect(Collectors.toList());
    }
    
    // 특정 세션의 상세 정보 및 전체 메시지 조회
    @Transactional(readOnly = true)
    public ChatSessionDetailResponse getSessionDetail(Long sessionId, String email) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다."));
        
        // 권한 확인
        if (!session.getUser().getEmail().equals(email)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        List<ChatHistory> messages = chatHistoryRepository.findByChatSessionIdOrderByCreatedAtAsc(sessionId);
        
        ChatSessionDetailResponse response = new ChatSessionDetailResponse();
        response.setId(session.getId());
        response.setTitle(session.getTitle());
        response.setMode(session.getMode());
        response.setCreatedAt(session.getCreatedAt());
        response.setUpdatedAt(session.getUpdatedAt());
        
        List<ChatSessionDetailResponse.MessagePair> messagePairs = messages.stream()
                .map(msg -> new ChatSessionDetailResponse.MessagePair(
                        msg.getId(),
                        msg.getUserMessage(),
                        msg.getBotResponse(),
                        msg.getCreatedAt()
                ))
                .collect(Collectors.toList());
        
        response.setMessages(messagePairs);
        
        return response;
    }
    
    // 세션 삭제
    @Transactional
    public void deleteSession(Long sessionId, String email) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다."));
        
        // 권한 확인
        if (!session.getUser().getEmail().equals(email)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        chatSessionRepository.delete(session);
    }
    
    // 세션 제목 수정
    @Transactional
    public ChatSession updateSessionTitle(Long sessionId, String newTitle, String email) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("세션을 찾을 수 없습니다."));
        
        // 권한 확인
        if (!session.getUser().getEmail().equals(email)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        session.setTitle(newTitle);
        return chatSessionRepository.save(session);
    }
}
