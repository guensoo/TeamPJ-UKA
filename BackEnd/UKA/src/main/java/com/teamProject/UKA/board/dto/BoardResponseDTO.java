package com.teamProject.UKA.board.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.auth.model.User;
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
public class BoardResponseDTO {

    private String id;
    private String userId;         // 변경: User 객체 대신 String
    private String nickname;       // 추가: 글쓴이 닉네임(프론트에서 자주 씀)
    private Category category;
    private String title;
    private String author;         // 기존 author 유지(필요 없다면 nickname만 남겨도 됨)
    private String content;
    private int view;
    private int likes;
    private int comment;
    private int report;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private boolean isLikedByCurrentUser;
    private boolean isReportedByCurrentUser;

    // entity -> dto
    public BoardResponseDTO(Board entity, boolean isLikedByCurrentUser, boolean isReportedByCurrentUser) {
        this.id = entity.getId();
        // userId: null 체크해서 String으로만 추출
        this.userId = entity.getUser() != null ? entity.getUser().getUserId() : null;
        this.nickname = entity.getUser() != null ? entity.getUser().getNickname() : null;
        this.category = entity.getCategory();
        this.title = entity.getTitle();
        this.author = entity.getAuthor();
        this.content = entity.getContent();
        this.view = entity.getView();
        this.likes = entity.getLikes();
        this.comment = entity.getComment();
        this.report = entity.getReport();
        this.isEdited = entity.getEdited();
        this.createdAt = entity.getCreatedAt();
        this.isLikedByCurrentUser = isLikedByCurrentUser;
        this.isReportedByCurrentUser = isReportedByCurrentUser;
    }
    
    public static BoardResponseDTO fromRow(Object[] row) {
        return BoardResponseDTO.builder()
            .id(row[0] != null ? row[0].toString() : null)
            .title(row[1] != null ? row[1].toString() : null)
            .build();
    }
}
