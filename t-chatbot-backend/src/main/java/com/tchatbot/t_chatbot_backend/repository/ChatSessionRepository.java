package com.tchatbot.t_chatbot_backend.repository;

import com.tchatbot.t_chatbot_backend.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<ChatSession> findByUserIdAndModeOrderByUpdatedAtDesc(Long userId, String mode);
}
