package com.tchatbot.t_chatbot_backend.service;

import com.tchatbot.t_chatbot_backend.dto.CommentResponse;
import com.tchatbot.t_chatbot_backend.dto.SharedChatResponse;
import com.tchatbot.t_chatbot_backend.entity.ChatLike;
import com.tchatbot.t_chatbot_backend.entity.Comment;
import com.tchatbot.t_chatbot_backend.entity.SharedChat;
import com.tchatbot.t_chatbot_backend.repository.ChatLikeRepository;
import com.tchatbot.t_chatbot_backend.repository.CommentRepository;
import com.tchatbot.t_chatbot_backend.repository.SharedChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityService {
    
    private final SharedChatRepository sharedChatRepository;
    private final CommentRepository commentRepository;
    private final ChatLikeRepository chatLikeRepository;
    
    @Autowired
    public CommunityService(SharedChatRepository sharedChatRepository, 
                          CommentRepository commentRepository,
                          ChatLikeRepository chatLikeRepository) {
        this.sharedChatRepository = sharedChatRepository;
        this.commentRepository = commentRepository;
        this.chatLikeRepository = chatLikeRepository;
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
    public List<SharedChatResponse> getAllSharedChats(String userId) {
        List<SharedChat> sharedChats = sharedChatRepository.findAllByOrderByCreatedAtDesc();
        return sharedChats.stream()
                .map(chat -> convertToResponse(chat, userId))
                .collect(Collectors.toList());
    }
    
    /**
     * 좋아요 많은 순으로 조회
     */
    public List<SharedChatResponse> getPopularSharedChats(String userId) {
        List<SharedChat> sharedChats = sharedChatRepository.findAllByOrderByLikesDesc();
        return sharedChats.stream()
                .map(chat -> convertToResponse(chat, userId))
                .collect(Collectors.toList());
    }
    
    /**
     * 검색 기능 (제목, 내용, 태그로 검색)
     */
    public List<SharedChatResponse> searchSharedChats(String keyword, String userId) {
        List<SharedChat> allChats = sharedChatRepository.findAllByOrderByCreatedAtDesc();
        
        String lowerKeyword = keyword.toLowerCase();
        
        return allChats.stream()
                .filter(chat -> 
                    chat.getTitle().toLowerCase().contains(lowerKeyword) ||
                    chat.getUserMessage().toLowerCase().contains(lowerKeyword) ||
                    chat.getBotResponse().toLowerCase().contains(lowerKeyword) ||
                    (chat.getTags() != null && chat.getTags().toLowerCase().contains(lowerKeyword))
                )
                .map(chat -> convertToResponse(chat, userId))
                .collect(Collectors.toList());
    }
    
    /**
     * 특정 사용자의 공유 채팅 조회
     */
    public List<SharedChatResponse> getUserSharedChats(String userId) {
        List<SharedChat> sharedChats = sharedChatRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return sharedChats.stream()
                .map(chat -> convertToResponse(chat, userId))
                .collect(Collectors.toList());
    }
    
    /**
     * 좋아요 토글 (추가/취소)
     */
    @Transactional
    public SharedChatResponse likeChat(Long chatId, String userId) {
        SharedChat sharedChat = sharedChatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("공유 채팅을 찾을 수 없습니다."));
        
        // 이미 좋아요를 했는지 확인
        Optional<ChatLike> existingLike = chatLikeRepository.findBySharedChatIdAndUserId(chatId, userId);
        
        if (existingLike.isPresent()) {
            // 좋아요가 이미 있으면 취소 (삭제)
            chatLikeRepository.delete(existingLike.get());
            sharedChat.decrementLikes();
        } else {
            // 좋아요가 없으면 추가
            ChatLike newLike = new ChatLike(chatId, userId);
            chatLikeRepository.save(newLike);
            sharedChat.incrementLikes();
        }
        
        SharedChat updatedChat = sharedChatRepository.save(sharedChat);
        return convertToResponse(updatedChat, userId);
    }
    
    /**
     * 댓글 추가
     */
    @Transactional
    public CommentResponse addComment(Long chatId, String userId, String username, String content) {
        // 게시글 존재 확인
        sharedChatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("공유 채팅을 찾을 수 없습니다."));
        
        Comment comment = new Comment(chatId, userId, username, content);
        Comment savedComment = commentRepository.save(comment);
        return convertToCommentResponse(savedComment);
    }
    
    /**
     * 특정 게시글의 댓글 조회
     */
    public List<CommentResponse> getComments(Long chatId) {
        List<Comment> comments = commentRepository.findBySharedChatIdOrderByCreatedAtDesc(chatId);
        return comments.stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        
        // 작성자 확인
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }
        
        commentRepository.delete(comment);
    }
    
    /**
     * Entity를 Response DTO로 변환
     */
    private SharedChatResponse convertToResponse(SharedChat sharedChat) {
        Long commentCount = commentRepository.countBySharedChatId(sharedChat.getId());
        SharedChatResponse response = new SharedChatResponse(
                sharedChat.getId(),
                sharedChat.getUserId(),
                sharedChat.getUsername(),
                sharedChat.getTitle(),
                sharedChat.getTags(),
                sharedChat.getUserMessage(),
                sharedChat.getBotResponse(),
                sharedChat.getCreatedAt(),
                sharedChat.getLikes(),
                commentCount
        );
        response.setIsLikedByCurrentUser(false);
        return response;
    }
    
    /**
     * Entity를 Response DTO로 변환 (userId 기반)
     */
    private SharedChatResponse convertToResponse(SharedChat sharedChat, String userId) {
        Long commentCount = commentRepository.countBySharedChatId(sharedChat.getId());
        boolean isLiked = chatLikeRepository.existsBySharedChatIdAndUserId(sharedChat.getId(), userId);
        
        SharedChatResponse response = new SharedChatResponse(
                sharedChat.getId(),
                sharedChat.getUserId(),
                sharedChat.getUsername(),
                sharedChat.getTitle(),
                sharedChat.getTags(),
                sharedChat.getUserMessage(),
                sharedChat.getBotResponse(),
                sharedChat.getCreatedAt(),
                sharedChat.getLikes(),
                commentCount
        );
        response.setIsLikedByCurrentUser(isLiked);
        return response;
    }
    
    /**
     * Comment Entity를 CommentResponse DTO로 변환
     */
    private CommentResponse convertToCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getSharedChatId(),
                comment.getUserId(),
                comment.getUsername(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
