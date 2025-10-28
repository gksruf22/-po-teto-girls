package com.tchatbot.t_chatbot_backend.repository;

import com.tchatbot.t_chatbot_backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // 특정 게시글의 댓글 조회 (최신순)
    List<Comment> findBySharedChatIdOrderByCreatedAtDesc(Long sharedChatId);
    
    // 특정 게시글의 댓글 수 조회
    Long countBySharedChatId(Long sharedChatId);
}
