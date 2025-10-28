package com.tchatbot.t_chatbot_backend.dto;

import java.time.LocalDateTime;

public class SharedChatResponse {
    private Long id;
    private String userId;
    private String username;
    private String title;
    private String tags;
    private String userMessage;
    private String botResponse;
    private LocalDateTime createdAt;
    private Integer likes;
    private Long commentCount;
    private Boolean isLikedByCurrentUser;
    
    public SharedChatResponse() {
    }
    
    public SharedChatResponse(Long id, String userId, String username, String title, String tags,
                             String userMessage, String botResponse, LocalDateTime createdAt, Integer likes, Long commentCount) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.title = title;
        this.tags = tags;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.createdAt = createdAt;
        this.likes = likes;
        this.commentCount = commentCount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public String getUserMessage() {
        return userMessage;
    }
    
    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
    
    public String getBotResponse() {
        return botResponse;
    }
    
    public void setBotResponse(String botResponse) {
        this.botResponse = botResponse;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getLikes() {
        return likes;
    }
    
    public void setLikes(Integer likes) {
        this.likes = likes;
    }
    
    public Long getCommentCount() {
        return commentCount;
    }
    
    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }
    
    public Boolean getIsLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }
    
    public void setIsLikedByCurrentUser(Boolean isLikedByCurrentUser) {
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }
}
