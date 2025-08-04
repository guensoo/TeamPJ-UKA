package com.teamProject.UKA.board.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.board.model.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponseDTO {
    private String id;
    private String boardId;
    private String author;
    private String userId;
    private String nickname;
    private String content;
    private String parentCommentId;
    private Boolean isEdited;
    private LocalDateTime createdAt;

    public CommentResponseDTO(Comment entity) {
        this.id = entity.getId();
        this.boardId = entity.getBoard() != null ? entity.getBoard().getId() : null;
        this.userId = entity.getUser() != null ? entity.getUser().getUserId() : null;
        this.nickname = entity.getUser() != null ? entity.getUser().getNickname() : null;
        this.author = entity.getAuthor();
        this.content = entity.getContent();
        this.parentCommentId = entity.getParentCommentId();
        this.isEdited = entity.getIsEdited();
        this.createdAt = entity.getCreatedAt();
    }
}