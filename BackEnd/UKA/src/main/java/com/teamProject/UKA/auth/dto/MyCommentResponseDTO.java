package com.teamProject.UKA.auth.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.board.dto.CommentResponseDTO;
import com.teamProject.UKA.customer.qna.dto.QnaCommentResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyCommentResponseDTO {
    private String type; // "BOARD" or "QNA"
    private String commentId; // 댓글 PK
    private String postId; // 원글 PK (boardId or qnaId)
    private String postTitle; // 원글 제목 (추가 가능)
    private String userId;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;

    // 게시판 댓글 → DTO 변환
    public static MyCommentResponseDTO fromBoard(CommentResponseDTO boardDto, String postTitle) {
        return MyCommentResponseDTO.builder()
            .type("BOARD")
            .commentId(boardDto.getId())
            .postId(boardDto.getBoardId())
            .postTitle(postTitle)
            .userId(boardDto.getUserId())
            .nickname(boardDto.getNickname())
            .content(boardDto.getContent())
            .createdAt(boardDto.getCreatedAt())
            .build();
    }

    // Q&A 댓글 → DTO 변환
    public static MyCommentResponseDTO fromQna(QnaCommentResponseDTO qnaDto, String postTitle) {
        return MyCommentResponseDTO.builder()
            .type("QNA")
            .commentId(String.valueOf(qnaDto.getQnaCommentId()))
            .postId(String.valueOf(qnaDto.getQnaId()))
            .postTitle(postTitle)
            .userId(qnaDto.getUserId())
            .nickname(qnaDto.getQnaCommentWriter())
            .content(qnaDto.getQnaCommentContent())
            .createdAt(qnaDto.getQnaCommentCreatedAt())
            .build();
    }
}
