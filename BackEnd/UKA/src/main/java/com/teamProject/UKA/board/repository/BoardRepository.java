package com.teamProject.UKA.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.model.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, String>{

	@Query("SELECT MAX(b.id) FROM Board b WHERE b.id LIKE :prefix")
    String findMaxIdByDate(@Param("prefix") String prefix);
}
