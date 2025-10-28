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
            .csrf(csrf -> csrf.disable())  // CSRF 비활성화
            .cors(cors -> {})  // CORS 활성화 (WebConfig 설정 사용)
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)  // 세션 사용
                .maximumSessions(1)  // 동시 세션 제한
                .maxSessionsPreventsLogin(false))  // 새 로그인 시 이전 세션 무효화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // 인증 관련 엔드포인트 허용
                .requestMatchers("/api/community/**").permitAll()  // 커뮤니티 API 모두 허용
                .requestMatchers("/api/chat/**").permitAll()  // 채팅 API 허용
                .requestMatchers("/h2-console/**").permitAll()  // H2 콘솔 허용
                .requestMatchers("/api/**").permitAll()  // 임시로 모든 API 허용
                .anyRequest().permitAll()  // 나머지 모든 요청도 허용 (테스트용)
            )
            .formLogin(form -> form.disable())  // 폼 로그인 비활성화
            .httpBasic(basic -> basic.disable());  // HTTP Basic 인증 비활성화
        
        return http.build();
    }
}
