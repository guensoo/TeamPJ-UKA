package com.teamProject.UKA.customer.qna.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class QnaLikeLogResponseDTO {
	private Long id;
    private Long qnaNo;
    private String userId;
    private LocalDateTime createdAt;
}
