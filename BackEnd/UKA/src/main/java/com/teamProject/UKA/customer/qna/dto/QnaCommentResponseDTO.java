package com.teamProject.UKA.customer.qna.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.customer.qna.entity.QnaCommentEntity;

import lombok.Data;

@Data
public class QnaCommentResponseDTO {
    private Long qnaCommentId;
    private Long qnaId;
    private Integer qnaCommentNo;
    private String userId;
    private String qnaCommentWriter;
    private String qnaCommentContent;
    private String qnaCommentIsReported;
    private LocalDateTime qnaCommentCreatedAt;
    private LocalDateTime qnaCommentUpdatedAt;

    public static QnaCommentResponseDTO fromEntity(QnaCommentEntity entity) {
        QnaCommentResponseDTO dto = new QnaCommentResponseDTO();
        dto.setQnaCommentId(entity.getQnaCommentId());
        dto.setQnaId(entity.getQna().getQnaId()); // 💥 QnaEntity에서 qnaId 추출
        dto.setQnaCommentNo(entity.getQnaCommentNo());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getUserId() : null);
        dto.setQnaCommentWriter(entity.getUser() != null ? entity.getUser().getNickname() : null);
        dto.setQnaCommentContent(entity.getQnaCommentContent());
        dto.setQnaCommentIsReported(entity.getQnaCommentIsReported());
        dto.setQnaCommentCreatedAt(entity.getQnaCommentCreatedAt());
        dto.setQnaCommentUpdatedAt(entity.getQnaCommentUpdatedAt());
        return dto;
    }
}
