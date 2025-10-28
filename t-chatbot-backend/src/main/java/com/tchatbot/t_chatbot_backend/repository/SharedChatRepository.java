package com.tchatbot.t_chatbot_backend.repository;

import com.tchatbot.t_chatbot_backend.entity.SharedChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedChatRepository extends JpaRepository<SharedChat, Long> {
    
    // 최신순으로 정렬된 모든 공유 채팅 조회
    List<SharedChat> findAllByOrderByCreatedAtDesc();
    
    // 특정 사용자의 공유 채팅 조회
    List<SharedChat> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // 좋아요 수가 많은 순으로 조회
    List<SharedChat> findAllByOrderByLikesDesc();
}
