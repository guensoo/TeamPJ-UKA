package com.teamProject.UKA.board.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    
    //댓글 작성
    @PostMapping("/{boardId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable("boardId") String boardId,
            @RequestBody Comment commentRequest
    ) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        String commentId = commentService.generateCommentId(board);

        Comment comment = Comment.builder()
                .id(commentId)
                .board(board)
                .parentCommentId(null) // 댓글이므로 null
                .author(commentRequest.getAuthor())
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }
    
    //대댓글 작성
    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<Comment> createReply(
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

        Comment savedReply = commentRepository.save(reply);
        return ResponseEntity.ok(savedReply);
    }
    
    //게시글별 댓글 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<List<Comment>> getCommentsByBoard(@PathVariable("boardId") String boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        List<Comment> comments = commentRepository.findByBoardAndParentCommentIdIsNull(board);
        return ResponseEntity.ok(comments);
    }
    
    //특정 댓글의 대댓글 조회
    @GetMapping("/reply/{parentCommentId}")
    public ResponseEntity<List<Comment>> getRepliesByParentComment(@PathVariable("parentCommentId") String parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentId(parentCommentId);
        return ResponseEntity.ok(replies);
    }
}
