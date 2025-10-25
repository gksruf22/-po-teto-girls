package com.tchatbot.t_chatbot_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})  // CORS 활성화 (WebConfig 설정 사용)
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)  // 세션 사용
                .maximumSessions(1)  // 동시 세션 제한
                .maxSessionsPreventsLogin(false))  // 새 로그인 시 이전 세션 무효화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()  // 모든 인증 관련 엔드포인트 허용
                .requestMatchers("/api/**").permitAll()  // 임시로 모든 API 허용
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
