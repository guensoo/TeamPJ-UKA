package com.teamProject.UKA.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamProject.UKA.board.model.BoardLikes;

public interface LikeRepository extends JpaRepository<BoardLikes, Long> {
	@Query(
	    value = "SELECT b.brd_id as id, b.brd_title as title, u.nickname as author, b.brd_created_at as date, b.brd_likes as likes " +
	            "FROM board_likes bl " +
	            "JOIN board_main b ON bl.post_id = b.brd_id " +
	            "JOIN users u ON b.user_id = u.seq " +
	            "WHERE bl.user_id = :userId " +
	            "UNION ALL " +
	            "SELECT q.qna_id as id, q.qna_title as title, u.nickname as author, q.qna_created_at as date, q.qna_like_count as likes " +
	            "FROM qna_like_log ql " +
	            "JOIN qna q ON ql.qna_no = q.qna_no " +
	            "JOIN users u ON q.user_id = u.seq " +
	            "WHERE ql.user_id = :userId",
	    nativeQuery = true
	)
	List<Object[]> findAllMyLikes(@Param("userId") String userId);
}
