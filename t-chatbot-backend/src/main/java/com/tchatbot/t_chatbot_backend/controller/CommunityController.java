package com.tchatbot.t_chatbot_backend.controller;

import com.tchatbot.t_chatbot_backend.dto.CommentRequest;
import com.tchatbot.t_chatbot_backend.dto.CommentResponse;
import com.tchatbot.t_chatbot_backend.dto.ShareChatRequest;
import com.tchatbot.t_chatbot_backend.dto.SharedChatResponse;
import com.tchatbot.t_chatbot_backend.service.CommunityService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
public class CommunityController {
    
    private final CommunityService communityService;
    
    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }
    
    /**
     * 채팅 공유하기
     * POST /api/community/share
     */
    @PostMapping("/share")
    public ResponseEntity<?> shareChat(@RequestBody ShareChatRequest request, HttpSession session) {
        System.out.println("=== 공유 요청 받음 ===");
        System.out.println("Request: " + request);
        System.out.println("Title: " + request.getTitle());
        System.out.println("Tags: " + request.getTags());
        System.out.println("UserMessage: " + request.getUserMessage());
        System.out.println("BotResponse: " + request.getBotResponse());
        
        // 세션에서 사용자 정보 확인
        String email = (String) session.getAttribute("email");
        String username = (String) session.getAttribute("username");
        
        System.out.println("세션 Email: " + email);
        System.out.println("세션 Username: " + username);
        
        if (email == null || username == null) {
            System.out.println("로그인 필요 - 401 반환");
            Map<String, String> error = new HashMap<>();
            error.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        try {
            System.out.println("공유 시작...");
            SharedChatResponse response = communityService.shareChat(
                    email, 
                    username, 
                    request.getTitle(),
                    request.getTags(),
                    request.getUserMessage(), 
                    request.getBotResponse()
            );
            System.out.println("공유 성공: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("공유 중 오류 발생:");
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "채팅 공유 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 모든 공유 채팅 조회 (최신순)
     * GET /api/community
     */
    @GetMapping
    public ResponseEntity<List<SharedChatResponse>> getAllSharedChats(HttpSession session) {
        String userId = (String) session.getAttribute("email");
        if (userId == null) {
            userId = "guest@example.com";
        }
        List<SharedChatResponse> sharedChats = communityService.getAllSharedChats(userId);
        return ResponseEntity.ok(sharedChats);
    }
    
    /**
     * 인기 채팅 조회 (좋아요 많은 순)
     * GET /api/community/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<List<SharedChatResponse>> getPopularChats(HttpSession session) {
        String userId = (String) session.getAttribute("email");
        if (userId == null) {
            userId = "guest@example.com";
        }
        List<SharedChatResponse> popularChats = communityService.getPopularSharedChats(userId);
        return ResponseEntity.ok(popularChats);
    }
    
    /**
     * 검색 기능 (제목, 내용, 태그로 검색)
     * GET /api/community/search?q={keyword}
     */
    @GetMapping("/search")
    public ResponseEntity<List<SharedChatResponse>> searchChats(
            @RequestParam(required = false) String q,
            HttpSession session) {
        String userId = (String) session.getAttribute("email");
        if (userId == null) {
            userId = "guest@example.com";
        }
        
        if (q == null || q.trim().isEmpty()) {
            // 검색어가 없으면 전체 목록 반환
            List<SharedChatResponse> allChats = communityService.getAllSharedChats(userId);
            return ResponseEntity.ok(allChats);
        }
        
        List<SharedChatResponse> searchResults = communityService.searchSharedChats(q.trim(), userId);
        return ResponseEntity.ok(searchResults);
    }
    
    /**
     * 내가 공유한 채팅 조회
     * GET /api/community/my
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMySharedChats(HttpSession session) {
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        List<SharedChatResponse> myChats = communityService.getUserSharedChats(email);
        return ResponseEntity.ok(myChats);
    }
    
    /**
     * 좋아요 추가
     * POST /api/community/{id}/like
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeChat(@PathVariable("id") Long id, HttpSession session) {
        // 세션에서 userId 확인
        String userId = (String) session.getAttribute("email");
        if (userId == null) {
            // 임시로 테스트용 유저 ID 사용 (실제로는 로그인 필요)
            userId = "guest@example.com";
        }
        
        try {
            SharedChatResponse response = communityService.likeChat(id, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "좋아요 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 댓글 추가
     * POST /api/community/{id}/comments
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable("id") Long id, @RequestBody CommentRequest request, HttpSession session) {
        // 임시로 세션 없이도 댓글 추가 가능하도록 수정 (테스트용)
        String email = (String) session.getAttribute("email");
        String username = (String) session.getAttribute("username");
        
        // 세션이 없으면 임시 사용자로 설정
        if (email == null || username == null) {
            email = "guest@example.com";
            username = "익명";
        }
        
        try {
            CommentResponse response = communityService.addComment(id, email, username, request.getContent());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "댓글 추가 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 특정 게시글의 댓글 조회
     * GET /api/community/{id}/comments
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable("id") Long id) {
        List<CommentResponse> comments = communityService.getComments(id);
        return ResponseEntity.ok(comments);
    }
    
    /**
     * 댓글 삭제
     * DELETE /api/community/comments/{commentId}
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") Long commentId, HttpSession session) {
        // 임시로 세션 없이도 삭제 가능하도록 수정 (테스트용)
        String email = (String) session.getAttribute("email");
        
        if (email == null) {
            email = "guest@example.com";  // 임시 사용자
        }
        
        try {
            communityService.deleteComment(commentId, email);
            Map<String, String> success = new HashMap<>();
            success.put("message", "댓글이 삭제되었습니다.");
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "댓글 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
