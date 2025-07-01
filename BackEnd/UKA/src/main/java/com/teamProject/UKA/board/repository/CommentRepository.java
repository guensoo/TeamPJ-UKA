package com.teamProject.UKA.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>{

	List<Comment> findByBoardAndParentCommentIdIsNull(Board board); // 댓글만
    List<Comment> findByParentCommentId(String parentCommentId);    // 특정 댓글의 대댓글만
}
