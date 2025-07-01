package com.teamProject.UKA.board.dto;

import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardRequestDTO {

	private Category category;
    private String title;
    private String author;
    private String content;

    // DTO → Entity 변환
    public Board toEntity(String newId) {
        return Board.builder()
        		.id(newId)
                .category(this.category)
                .title(this.title)
                .author(this.author)
                .content(this.content)
                .view(0)
                .likes(0)
                .comment(0)
                .report(0)
                .build();
    }
}
