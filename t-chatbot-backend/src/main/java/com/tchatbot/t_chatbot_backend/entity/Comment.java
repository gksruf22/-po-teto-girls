package com.tchatbot.t_chatbot_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long sharedChatId; // 댓글이 달린 게시글 ID
    
    @Column(nullable = false)
    private String userId; // 댓글 작성자 이메일
    
    @Column(nullable = false)
    private String username; // 댓글 작성자 닉네임
    
    @Column(nullable = false, length = 1000)
    private String content; // 댓글 내용
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // 댓글 작성 시간
    
    // 기본 생성자
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }
    
    // 생성자
    public Comment(Long sharedChatId, String userId, String username, String content) {
        this.sharedChatId = sharedChatId;
        this.userId = userId;
        this.username = username;
        this.content = content;
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
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
