package com.tchatbot.t_chatbot_backend.controller;

import com.tchatbot.t_chatbot_backend.dto.ChatMessage;
import com.tchatbot.t_chatbot_backend.service.ChatService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    // 생성자를 통해 ChatService를 주입받습니다.
    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> handleChatMessage(@RequestBody ChatMessage userMessage, HttpSession session) {
        System.out.println("채팅 요청 수신: " + userMessage.getMessage());
        System.out.println("선택된 모드: " + userMessage.getMode());
        
        // 세션에서 사용자 정보 확인
        String email = (String) session.getAttribute("email");
        String username = (String) session.getAttribute("username");
        
        System.out.println("세션 확인 - email: " + email + ", username: " + username);
        
        if (email == null || username == null) {
            // 인증되지 않은 사용자
            System.err.println("인증되지 않은 사용자");
            Map<String, String> error = new HashMap<>();
            error.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            // ChatService를 사용하여 AI의 응답을 받아옵니다.
            System.out.println("ChatService 호출 시작...");
            String mode = userMessage.getMode() != null ? userMessage.getMode() : "default";
            
            // 대화 히스토리를 포함하여 응답 생성
            String botResponse = chatService.getTChatResponse(
                userMessage.getMessage(), 
                mode, 
                userMessage.getConversationHistory()
            );
            
            System.out.println("ChatService 응답 성공");
            return ResponseEntity.ok(new ChatMessage(botResponse));
        } catch (Exception e) {
            System.err.println("ChatController에서 예외 발생: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "서버 내부 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}