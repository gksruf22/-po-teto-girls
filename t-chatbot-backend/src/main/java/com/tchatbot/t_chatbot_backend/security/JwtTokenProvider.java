package com.tchatbot.t_chatbot_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    private final SecretKey secretKey;
    
    @Value("${jwt.secret:mySecretKeyForJwtTokenGenerationThatIsAtLeast256BitsLong}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}") // 24시간
    private long validityInMilliseconds;
    
    public JwtTokenProvider() {
        // 안전한 키 생성 (최소 256비트)
        this.secretKey = Keys.hmacShaKeyFor(
            "mySecretKeyForJwtTokenGenerationThatIsAtLeast256BitsLong".getBytes(StandardCharsets.UTF_8)
        );
    }
    
    public String createToken(String email, String username) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);
        
        return Jwts.builder()
                .subject(email)
                .claim("username", username)
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey)
                .compact();
    }
    
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
