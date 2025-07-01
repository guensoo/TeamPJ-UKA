package com.teamProject.UKA.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.teamProject.UKA.board.dto.BoardDetailDTO;
import com.teamProject.UKA.board.model.BoardDetail;

@Repository
public interface BoardDetailRepository extends JpaRepository<BoardDetail, String>{
	@Query("""
	        SELECT new com.teamProject.UKA.board.dto.BoardDetailDTO(
	            d.id,
	            m.id,
	            m.category,
	            m.title,
	            m.author,
	            m.view,
	            m.likes,
	            m.comment,
	            m.createdAt,
	            m.updatedAt,
	            d.content,
	            d.report
	        )
	        FROM BoardDetail d
	        JOIN d.boardMain m
	        WHERE d.id = :detailId
	        """)
	    BoardDetailDTO findBoardDetailViewById(@Param("detailId") String detailId);
}
