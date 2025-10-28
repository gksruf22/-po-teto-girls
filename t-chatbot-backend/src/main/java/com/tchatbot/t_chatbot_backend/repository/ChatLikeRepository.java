package com.tchatbot.t_chatbot_backend.repository;

import com.tchatbot.t_chatbot_backend.entity.ChatLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatLikeRepository extends JpaRepository<ChatLike, Long> {
    
    // 특정 사용자가 특정 게시글에 좋아요를 했는지 확인
    Optional<ChatLike> findBySharedChatIdAndUserId(Long sharedChatId, String userId);
    
    // 특정 게시글의 좋아요 수 카운트
    long countBySharedChatId(Long sharedChatId);
    
    // 특정 사용자가 특정 게시글에 좋아요를 했는지 확인 (boolean)
    boolean existsBySharedChatIdAndUserId(Long sharedChatId, String userId);
}
