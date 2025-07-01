package com.teamProject.UKA.customer.faq.dto;

import java.time.LocalDateTime;

import com.teamProject.UKA.customer.faq.entity.FaqEntity;

import lombok.Data;

@Data
public class FaqResponseDTO {

    private Long faqId;
    private Integer faqOrderNum;
    private String faqQuestion;
    private String faqAnswer;
    private String faqCategory;
    private LocalDateTime faqCreatedAt;
    private LocalDateTime faqUpdatedAt;

    // 엔티티 -> DTO 변환
    public static FaqResponseDTO fromEntity(FaqEntity faq) {
    	FaqResponseDTO dto = new FaqResponseDTO();
        dto.setFaqId(faq.getFaqId());
        dto.setFaqOrderNum(faq.getFaqOrderNum());
        dto.setFaqQuestion(faq.getFaqQuestion());
        dto.setFaqAnswer(faq.getFaqAnswer());
        dto.setFaqCategory(faq.getFaqCategory());
        dto.setFaqCreatedAt(faq.getFaqCreatedAt());
        dto.setFaqUpdatedAt(faq.getFaqUpdatedAt());
        return dto;
    }
}
