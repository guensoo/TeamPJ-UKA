package com.teamProject.UKA.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.Comment;
import com.teamProject.UKA.board.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	
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
}
