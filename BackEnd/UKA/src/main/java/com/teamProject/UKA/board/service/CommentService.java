package com.teamProject.UKA.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.Comment;
import com.teamProject.UKA.board.repository.BoardRepository;
import com.teamProject.UKA.board.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final BoardRepository boardRepository;
	
	//댓글ID 생성
	@Transactional(readOnly = true)
	public String generateCommentId(Board board) {
		String boardId = board.getId();
		
		List<Comment> commentList = commentRepository.findByBoardAndParentCommentIdIsNull(board);
		
		int max = commentList.stream()
                .map(Comment::getId) //comment의 id 꺼냄
                .map(id -> id.substring(boardId.length() + 1)) // "001", "002"
                .mapToInt(Integer::parseInt) //001 -> 1 변환
                .max() // max값
                .orElse(0); // 없으면 0

        String nextId = String.format("%s_%03d", boardId, max + 1); // %03(빈자리는 0으로 채우고, 최소3자리출력)
        return nextId;
	}
	
	//대댓글ID 생성
	@Transactional(readOnly = true)
    public String generateReplyId(Comment parentComment) {
        String parentId = parentComment.getId();

        List<Comment> replyList = commentRepository.findByParentCommentId(parentId);

        int max = replyList.stream()
                .map(Comment::getId)
                .map(id -> id.substring(parentId.length() + 1)) // "001", "002"
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        String nextId = String.format("%s_%03d", parentId, max + 1); 
        return nextId;
    }

	// 댓글 작성 (+ Board.comment 증가)
    @Transactional
    public Comment createComment(Comment comment) {
        Comment saved = commentRepository.save(comment);

        Board board = comment.getBoard();
        board.setComment(board.getComment() + 1);
        boardRepository.save(board); // 영속성 컨텍스트에 있어도 명시적으로 저장 가능

        return saved;
    }
	
	// 댓글/대댓글 수정
    public Comment updateComment(String commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.setContent(newContent);
        return commentRepository.save(comment);
    }
    
    // 댓글 및 해당 댓글의 모든 하위 대댓글 삭제 (재귀 삭제)
    @Transactional
    public int deleteCommentAndReplies(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다. id=" + commentId));

        int deleteCount = deleteRecursively(commentId);

        // Board.comment 동기화
        Board board = comment.getBoard();
        int newCommentCount = Math.max(board.getComment() - deleteCount, 0);
        board.setComment(newCommentCount);
        boardRepository.save(board);

        return deleteCount;
    }

    // 재귀적으로 삭제 후 삭제된 댓글 개수 반환
    private int deleteRecursively(String commentId) {
        int count = 1; // 본인
        List<Comment> replies = commentRepository.findByParentCommentId(commentId);
        for (Comment reply : replies) {
            count += deleteRecursively(reply.getId());
        }
        commentRepository.deleteById(commentId);
        return count;
    }
    
}
