package com.tchatbot.t_chatbot_backend.repository;

import com.tchatbot.t_chatbot_backend.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ChatHistory> findByIsPublicTrueOrderByCreatedAtDesc();
    List<ChatHistory> findByChatSessionIdOrderByCreatedAtAsc(Long sessionId);
}
