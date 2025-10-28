package com.tchatbot.t_chatbot_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_likes", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"shared_chat_id", "user_id"}))
public class ChatLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "shared_chat_id", nullable = false)
    private Long sharedChatId; // 좋아요한 게시글 ID
    
    @Column(name = "user_id", nullable = false)
    private String userId; // 좋아요한 사용자 이메일
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // 좋아요한 시간
    
    // 기본 생성자
    public ChatLike() {
        this.createdAt = LocalDateTime.now();
    }
    
    // 생성자
    public ChatLike(Long sharedChatId, String userId) {
        this.sharedChatId = sharedChatId;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSharedChatId() {
        return sharedChatId;
    }
    
    public void setSharedChatId(Long sharedChatId) {
        this.sharedChatId = sharedChatId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
