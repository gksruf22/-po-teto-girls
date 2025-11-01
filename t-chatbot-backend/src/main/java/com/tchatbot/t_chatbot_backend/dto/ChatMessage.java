package com.tchatbot.t_chatbot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String message;
    private String mode; // "default", "love", "tbrainwash"
    private Long sessionId; // 세션 ID (선택사항 - 새 대화면 null)
    private List<ConversationPair> conversationHistory; // 현재 대화창 히스토리
    
    public ChatMessage(String message) {
        this.message = message;
        this.mode = "default";
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversationPair {
        private String userMessage;
        private String botResponse;
    }
}