package com.teamProject.UKA.board.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.BoardDetail;
import com.teamProject.UKA.board.model.Category;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class BoardDetailDTO {

	private String id;
	private String mainId;
    private Category category;
    private String title;
    private String author;
    private int view;
    private int likes;
    private int comment; // 댓글 수
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String content;
    private int report;
    
    public BoardDetailDTO(String id, String mainId, Category category, String title, String author,
            	int view, int likes, int comment,
            	LocalDateTime createdAt, LocalDateTime updatedAt,
            	String content, int report) {
    	this.id = id;
        this.mainId = mainId;
        this.category = category;
        this.title = title;
        this.author = author;
        this.view = view;
        this.likes = likes;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.content = content;
        this.report = report;
	}
    
    public BoardDetailDTO(BoardDetail entity) {
        this.id = entity.getId();
        this.mainId = entity.getBoardMain() != null ? entity.getBoardMain().getId() : null;
        this.content = entity.getContent();
        this.report = entity.getReport();
        // 다른 필드는 필요하면 추가
    }
    
    // DTO → 엔티티 변환 메서드 (필요한 필드 모두 포함 가능)
    public BoardDetail toEntity(Board boardMain) {
        return BoardDetail.builder()
                .id(this.id)
                .boardMain(boardMain)
                .content(this.content)
                .report(this.report)
                .build();
    }

}
