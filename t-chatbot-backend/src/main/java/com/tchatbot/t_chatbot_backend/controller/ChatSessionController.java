package com.tchatbot.t_chatbot_backend.controller;

import com.tchatbot.t_chatbot_backend.dto.ChatSessionDetailResponse;
import com.tchatbot.t_chatbot_backend.dto.ChatSessionResponse;
import com.tchatbot.t_chatbot_backend.dto.CreateSessionRequest;
import com.tchatbot.t_chatbot_backend.entity.ChatSession;
import com.tchatbot.t_chatbot_backend.service.ChatSessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class ChatSessionController {
    
    private final ChatSessionService chatSessionService;
    
    @Autowired
    public ChatSessionController(ChatSessionService chatSessionService) {
        this.chatSessionService = chatSessionService;
    }
    
    // 새 세션 생성
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody CreateSessionRequest request, HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }
        
        try {
            ChatSession chatSession = chatSessionService.createSession(
                    email,
                    request.getMode(),
                    request.getTitle()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", chatSession.getId());
            response.put("title", chatSession.getTitle());
            response.put("mode", chatSession.getMode());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "세션 생성 중 오류가 발생했습니다."));
        }
    }
    
    // 사용자의 모든 세션 목록 조회
    @GetMapping
    public ResponseEntity<?> getUserSessions(HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }
        
        try {
            List<ChatSessionResponse> sessions = chatSessionService.getUserSessions(email);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "세션 목록 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 특정 세션의 상세 정보 및 메시지 조회
    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSessionDetail(@PathVariable Long sessionId, HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }
        
        try {
            ChatSessionDetailResponse sessionDetail = chatSessionService.getSessionDetail(sessionId, email);
            return ResponseEntity.ok(sessionDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "세션 조회 중 오류가 발생했습니다."));
        }
    }
    
    // 세션 삭제
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable Long sessionId, HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }
        
        try {
            chatSessionService.deleteSession(sessionId, email);
            return ResponseEntity.ok(Map.of("message", "세션이 삭제되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "세션 삭제 중 오류가 발생했습니다."));
        }
    }
    
    // 세션 제목 수정
    @PutMapping("/{sessionId}/title")
    public ResponseEntity<?> updateSessionTitle(
            @PathVariable Long sessionId,
            @RequestBody Map<String, String> request,
            HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }
        
        String newTitle = request.get("title");
        if (newTitle == null || newTitle.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "제목을 입력해주세요."));
        }
        
        try {
            ChatSession updatedSession = chatSessionService.updateSessionTitle(sessionId, newTitle, email);
            return ResponseEntity.ok(Map.of(
                    "message", "제목이 수정되었습니다.",
                    "title", updatedSession.getTitle()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "제목 수정 중 오류가 발생했습니다."));
        }
    }
}
