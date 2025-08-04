package com.teamProject.UKA.board.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.auth.model.User;
import com.teamProject.UKA.auth.repository.UserRepository;
import com.teamProject.UKA.board.dto.CommentResponseDTO;
import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.Comment;
import com.teamProject.UKA.board.repository.BoardRepository;
import com.teamProject.UKA.board.repository.CommentRepository;
import com.teamProject.UKA.board.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
public class CommentController {

	private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final CommentService commentService;
    private final UserRepository userRepository;
    
    //댓글 작성
    @PostMapping("/{boardId}")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable("boardId") String boardId,
            @RequestBody Comment commentRequest) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 1. 현재 로그인된 userId 획득
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) authentication.getPrincipal(); // principal이 userId일 때

        System.out.println("userId ::" + userId);
        // 2. userId로 User 엔티티 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String commentId = commentService.generateCommentId(board);
        
        System.out.println(user);

        Comment comment = Comment.builder()
                .id(commentId)
                .board(board)
                .parentCommentId(null)
                .author(user.getNickname())   // (author에 닉네임 저장)
                .user(user)                   // **user 필드에 User 엔티티 직접 주입!**
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentService.createComment(comment);

        // DTO로 반환
        CommentResponseDTO responseDTO = new CommentResponseDTO(savedComment);
        return ResponseEntity.ok(responseDTO);
    }
    
    //대댓글 작성
    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<CommentResponseDTO> createReply(
            @PathVariable("parentCommentId") String parentCommentId,
            @RequestBody Comment commentRequest
    ) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new IllegalArgumentException("부모 댓글을 찾을 수 없습니다."));

        String replyId = commentService.generateReplyId(parentComment);

        Comment reply = Comment.builder()
                .id(replyId)
                .board(parentComment.getBoard())
                .parentCommentId(parentComment.getId())
                .author(commentRequest.getAuthor())
                .content(commentRequest.getContent())
                .build();

        Comment savedReply = commentService.createComment(reply);
        // ⭐ DTO로 변환해서 반환!
        return ResponseEntity.ok(new CommentResponseDTO(savedReply));
    }
    
    //게시글별 댓글 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByBoard(@PathVariable("boardId") String boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        List<Comment> comments = commentRepository.findByBoardAndParentCommentIdIsNull(board);

        // ⭐ DTO로 변환
        List<CommentResponseDTO> response = comments.stream()
            .map(CommentResponseDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    //특정 댓글의 대댓글 조회
    @GetMapping("/reply/{parentCommentId}")
    public ResponseEntity<List<Comment>> getRepliesByParentComment(@PathVariable("parentCommentId") String parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentId(parentCommentId);
        return ResponseEntity.ok(replies);
    }
    
    // 댓글/대댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable("commentId") String commentId,
            @RequestBody Comment commentRequest) {

        Comment updated = commentService.updateComment(commentId, commentRequest.getContent());
        // ⭐ DTO로 변환
        return ResponseEntity.ok(new CommentResponseDTO(updated));
    }

    // 댓글/대댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable("commentId") String commentId) {
        commentService.deleteCommentAndReplies(commentId);
        return ResponseEntity.noContent().build();
    }
}
