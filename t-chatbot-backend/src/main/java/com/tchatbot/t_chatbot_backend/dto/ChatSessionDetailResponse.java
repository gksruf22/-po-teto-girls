package com.tchatbot.t_chatbot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionDetailResponse {
    private Long id;
    private String title;
    private String mode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessagePair> messages;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePair {
        private Long id;
        private String userMessage;
        private String botResponse;
        private LocalDateTime createdAt;
    }
}
