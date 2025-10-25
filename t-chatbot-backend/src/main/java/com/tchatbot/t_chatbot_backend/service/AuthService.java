package com.tchatbot.t_chatbot_backend.service;

import com.tchatbot.t_chatbot_backend.dto.AuthResponse;
import com.tchatbot.t_chatbot_backend.dto.LoginRequest;
import com.tchatbot.t_chatbot_backend.dto.SignUpRequest;
import com.tchatbot.t_chatbot_backend.entity.User;
import com.tchatbot.t_chatbot_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        
        // 사용자 생성
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        
        userRepository.save(user);
        
        // 세션 기반이므로 토큰 대신 null 반환
        return new AuthResponse(null, user.getUsername(), user.getEmail());
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다."));
        
        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        
        // 세션 기반이므로 토큰 대신 null 반환
        return new AuthResponse(null, user.getUsername(), user.getEmail());
    }
}
