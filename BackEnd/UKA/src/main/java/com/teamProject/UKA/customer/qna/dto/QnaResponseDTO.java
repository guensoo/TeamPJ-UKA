package com.teamProject.UKA.customer.qna.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.teamProject.UKA.customer.qna.entity.QnaEntity;

import lombok.Data;

@Data
public class QnaResponseDTO {
    private Long qnaId;
    private Long qnaNo;
    private String qnaTitle;
    private String qnaContent;
    private String qnaWriter;
    private String qnaIsSecret;
    private String qnaPassword;
    private String qnaIsReported;
    private String qnaIsAnswered;
    private String qnaAnswer;
    private String qnaAnswerWriter;
    private LocalDateTime qnaCreatedAt;
    private LocalDateTime qnaUpdatedAt;
    private Integer qnaReportCount;
    private Integer qnaLikeCount;
    private Integer qnaViews;
    private boolean isLikedByMe;
    
    // 댓글 리스트 필드 추가
    private List<QnaCommentResponseDTO> comments;

    public static QnaResponseDTO fromEntity(QnaEntity entity) {
        QnaResponseDTO dto = new QnaResponseDTO();
        dto.setQnaId(entity.getQnaId());
        dto.setQnaNo(entity.getQnaNo());
        dto.setQnaTitle(entity.getQnaTitle());
        dto.setQnaContent(entity.getQnaContent());
        dto.setQnaWriter(entity.getQnaWriter());
        dto.setQnaIsSecret(entity.getQnaIsSecret());
        dto.setQnaPassword(entity.getQnaPassword());
        dto.setQnaIsReported(entity.getQnaIsReported());
        dto.setQnaIsAnswered(entity.getQnaIsAnswered());
        dto.setQnaAnswer(entity.getQnaAnswer());
        dto.setQnaAnswerWriter(entity.getQnaAnswerWriter());
        dto.setQnaCreatedAt(entity.getQnaCreatedAt());
        dto.setQnaUpdatedAt(entity.getQnaUpdatedAt());
        dto.setQnaReportCount(entity.getQnaReportCount());
        dto.setQnaLikeCount(entity.getQnaLikeCount());
        dto.setQnaViews(entity.getQnaViews());
        return dto;
    }
    

    // 댓글까지 포함하는 버전 (서비스에서 사용)
    public static QnaResponseDTO fromEntity(QnaEntity entity, List<QnaCommentResponseDTO> comments) {
        QnaResponseDTO dto = fromEntity(entity); // 위에서 기본 세팅
        dto.setComments(comments);               // 댓글 세팅
        return dto;
    }
}
