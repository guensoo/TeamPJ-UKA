package com.teamProject.UKA.customer.qna.dto;

import lombok.Data;

@Data
public class QnaCommentRequestDTO {
    private Long qnaId;
    private String qnaCommentWriter;
    private String qnaCommentContent;
}
