package com.tchatbot.t_chatbot_backend.service;

import com.tchatbot.t_chatbot_backend.dto.SharedChatResponse;
import com.tchatbot.t_chatbot_backend.entity.SharedChat;
import com.tchatbot.t_chatbot_backend.repository.SharedChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {
    
    private final SharedChatRepository sharedChatRepository;
    
    @Autowired
    public CommunityService(SharedChatRepository sharedChatRepository) {
        this.sharedChatRepository = sharedChatRepository;
    }
    
    /**
     * 채팅 공유하기
     */
    @Transactional
    public SharedChatResponse shareChat(String userId, String username, String title, String tags,
                                        String userMessage, String botResponse) {
        SharedChat sharedChat = new SharedChat(userId, username, title, tags, userMessage, botResponse);
        SharedChat savedChat = sharedChatRepository.save(sharedChat);
        return convertToResponse(savedChat);
    }
    
    /**
     * 모든 공유 채팅 조회 (최신순)
     */
    public List<SharedChatResponse> getAllSharedChats() {
        List<SharedChat> sharedChats = sharedChatRepository.findAllByOrderByCreatedAtDesc();
        return sharedChats.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 좋아요 많은 순으로 조회
     */
    public List<SharedChatResponse> getPopularSharedChats() {
        List<SharedChat> sharedChats = sharedChatRepository.findAllByOrderByLikesDesc();
        return sharedChats.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 특정 사용자의 공유 채팅 조회
     */
    public List<SharedChatResponse> getUserSharedChats(String userId) {
        List<SharedChat> sharedChats = sharedChatRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return sharedChats.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 좋아요 추가
     */
    @Transactional
    public SharedChatResponse likeChat(Long chatId) {
        SharedChat sharedChat = sharedChatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("공유 채팅을 찾을 수 없습니다."));
        
        sharedChat.incrementLikes();
        SharedChat updatedChat = sharedChatRepository.save(sharedChat);
        return convertToResponse(updatedChat);
    }
    
    /**
     * Entity를 Response DTO로 변환
     */
    private SharedChatResponse convertToResponse(SharedChat sharedChat) {
        return new SharedChatResponse(
                sharedChat.getId(),
                sharedChat.getUserId(),
                sharedChat.getUsername(),
                sharedChat.getTitle(),
                sharedChat.getTags(),
                sharedChat.getUserMessage(),
                sharedChat.getBotResponse(),
                sharedChat.getCreatedAt(),
                sharedChat.getLikes()
        );
    }
}
