package com.tchatbot.t_chatbot_backend.controller;

import com.tchatbot.t_chatbot_backend.dto.ChatMessage;
import com.tchatbot.t_chatbot_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    // 생성자를 통해 ChatService를 주입받습니다.
    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ChatMessage handleChatMessage(@RequestBody ChatMessage userMessage) {
        // ChatService를 사용하여 AI의 응답을 받아옵니다.
        String botResponse = chatService.getTChatResponse(userMessage.getMessage());
        return new ChatMessage(botResponse);
    }
}