package com.teamProject.UKA.customer.qna.dto;

import lombok.Data;

@Data
public class QnaRequestDTO {
    private Long qnaNo;
    private String qnaTitle;
    private String qnaContent;
    private String qnaWriter;
    private String qnaIsSecret;         // 'Y'/'N'
    private String qnaPassword;
    private String qnaIsReported; 		// 'Y' / 'N'
    private String qnaAnswer;           // (답변 등록/수정시만)
    private String qnaAnswerWriter;     // (답변 작성자, 필요시)
    private Integer qnaReportCount;     // 신고수
    private Integer qnaLikeCount;       // 추천수
    private Integer qnaViews;
}
