package com.teamProject.UKA.board.repository;

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
}
