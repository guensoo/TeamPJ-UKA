package com.teamProject.UKA.customer.qna.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QnaLikeLogResponseDTO {
    private Long id;
    private Long qnaNo;
    private String userId;
    private LocalDateTime createdAt;
}
