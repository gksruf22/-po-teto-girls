package com.tchatbot.t_chatbot_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shared_chats")
public class SharedChat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId; // 공유한 사용자의 이메일
    
    @Column(nullable = false)
    private String username; // 공유한 사용자의 닉네임
    
    @Column(nullable = false, length = 200)
    private String title; // 게시글 제목
    
    @Column(length = 500)
    private String tags; // 해시태그 (쉼표로 구분)
    
    @Column(nullable = false, length = 2000)
    private String userMessage; // 사용자가 보낸 메시지
    
    @Column(nullable = false, length = 2000)
    private String botResponse; // AI의 응답
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // 공유된 시간
    
    @Column(nullable = false)
    private Integer likes = 0; // 좋아요 수
    
    // 기본 생성자
    public SharedChat() {
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
    }
    
    // 생성자
    public SharedChat(String userId, String username, String title, String tags, String userMessage, String botResponse) {
        this.userId = userId;
        this.username = username;
        this.title = title;
        this.tags = tags;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
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
    
    // 좋아요 증가 메서드
    public void incrementLikes() {
        this.likes++;
    }
    
    public void decrementLikes() {
        if (this.likes > 0) {
            this.likes--;
        }
    }
}
