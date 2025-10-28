package com.tchatbot.t_chatbot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String message;
    private String mode; // "default", "love", "tbrainwash"
    
    public ChatMessage(String message) {
        this.message = message;
        this.mode = "default";
    }
}