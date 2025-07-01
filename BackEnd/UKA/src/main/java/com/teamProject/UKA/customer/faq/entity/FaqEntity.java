package com.teamProject.UKA.customer.faq.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "faq")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqEntity {
    @Id
    @Column(name = "faq_id")
    private Long faqId;

    @Column(name = "faq_order_num")
    private Integer faqOrderNum;

    @Column(name = "faq_question", nullable = false, length = 255)
    private String faqQuestion;

    @Column(name = "faq_answer", columnDefinition = "TEXT")
    private String faqAnswer;

    @Column(name = "faq_created_at", updatable = false)
    private LocalDateTime faqCreatedAt;

    @Column(name = "faq_updated_at")
    private LocalDateTime faqUpdatedAt;

    @Column(name = "faq_category", length = 50)
    private String faqCategory;

    @PrePersist
    protected void onCreate() {
        this.faqCreatedAt = LocalDateTime.now();
        this.faqUpdatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.faqUpdatedAt = LocalDateTime.now();
    }
}
