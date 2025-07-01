package com.teamProject.UKA.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
	
	List<Comment> findByBoardDetailIdAndParentIsNullOrderByCreatedAtAsc(String boardDetailId);

    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);
}
