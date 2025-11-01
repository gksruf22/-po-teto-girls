package com.tchatbot.t_chatbot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionResponse {
    private Long id;
    private String title;
    private String mode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer messageCount;
    private String lastMessage; // 마지막 메시지 미리보기
}
