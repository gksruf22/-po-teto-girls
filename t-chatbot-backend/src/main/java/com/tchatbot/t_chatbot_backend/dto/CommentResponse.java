package com.tchatbot.t_chatbot_backend.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long sharedChatId;
    private String userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;
    
    public CommentResponse() {
    }
    
    public CommentResponse(Long id, Long sharedChatId, String userId, String username, String content, LocalDateTime createdAt) {
        this.id = id;
        this.sharedChatId = sharedChatId;
        this.userId = userId;
        this.username = username;
        this.content = content;
        this.createdAt = createdAt;
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
