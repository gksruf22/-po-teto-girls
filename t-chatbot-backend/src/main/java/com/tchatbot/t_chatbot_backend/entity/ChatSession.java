package com.tchatbot.t_chatbot_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 200)
    private String title; // 세션 제목 (첫 질문 기반 자동 생성 또는 사용자 지정)
    
    @Column(length = 20)
    private String mode = "default"; // default, love, tbrainwash
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "chatSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatHistory> messages = new ArrayList<>();
    
    // 편의 메서드: 메시지 추가
    public void addMessage(ChatHistory chatHistory) {
        messages.add(chatHistory);
        chatHistory.setChatSession(this);
    }
    
    // 편의 메서드: 제목 자동 생성 (첫 메시지 기반, 50자 제한)
    public void generateTitleFromFirstMessage(String firstMessage) {
        if (firstMessage != null && !firstMessage.isEmpty()) {
            this.title = firstMessage.length() > 50 
                ? firstMessage.substring(0, 47) + "..." 
                : firstMessage;
        } else {
            this.title = "새로운 대화";
        }
    }
}
