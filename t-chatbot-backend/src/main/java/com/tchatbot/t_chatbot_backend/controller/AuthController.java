package com.tchatbot.t_chatbot_backend.controller;

import com.tchatbot.t_chatbot_backend.dto.AuthResponse;
import com.tchatbot.t_chatbot_backend.dto.LoginRequest;
import com.tchatbot.t_chatbot_backend.dto.SignUpRequest;
import com.tchatbot.t_chatbot_backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request, HttpSession session) {
        try {
            AuthResponse response = authService.signUp(request);
            
            // 세션에 사용자 정보 저장
            session.setAttribute("email", response.getEmail());
            session.setAttribute("username", response.getUsername());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            AuthResponse response = authService.login(request);
            
            // 세션에 사용자 정보 저장
            session.setAttribute("email", response.getEmail());
            session.setAttribute("username", response.getUsername());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
        Map<String, String> response = new HashMap<>();
        response.put("message", "로그아웃되었습니다.");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkSession(HttpSession session) {
        String email = (String) session.getAttribute("email");
        String username = (String) session.getAttribute("username");
        
        if (email != null && username != null) {
            AuthResponse response = new AuthResponse(null, username, email);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
