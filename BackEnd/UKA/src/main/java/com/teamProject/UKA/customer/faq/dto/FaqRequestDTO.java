package com.teamProject.UKA.customer.faq.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class FaqRequestDTO {

    private Integer faqOrderNum;
    private String faqQuestion;
    private String faqAnswer;
    private String faqCategory;
	
}