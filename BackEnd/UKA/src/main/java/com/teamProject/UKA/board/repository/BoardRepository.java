package com.teamProject.UKA.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.model.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, String>{

	@Query("SELECT MAX(b.id) FROM Board b WHERE b.id LIKE :prefix")
    String findMaxIdByDate(@Param("prefix") String prefix);

	@Modifying
	@Query("UPDATE Board b SET b.view = b.view + 1 WHERE b.id = :id")
	void incrementViewCount(@Param("id") String id);
	
	@Modifying
	@Query("UPDATE Board b SET b.likes = :likes WHERE b.id = :id")
	void updateLikes(@Param("id") String id, @Param("likes") int likes);

	@Modifying
	@Query("UPDATE Board b SET b.report = :report WHERE b.id = :id")
	void updateReport(@Param("id") String id, @Param("report") int report);
	
	@Query(
	    value = "SELECT brd_id as id, brd_title as title " +
	            "FROM board_main WHERE user_id = :userId " +
	            "UNION ALL " +
	            "SELECT CAST(qna_no AS CHAR) as id, qna_title as title " +
	            "FROM qna WHERE user_id = :userId",
	    nativeQuery = true
	)
	List<Object[]> findAllMyPosts(@Param("userId") String userId);
}
