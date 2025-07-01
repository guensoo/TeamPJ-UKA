package com.teamProject.UKA.customer.qna.entity;

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
@Table(name = "qna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QnaEntity {
    @Id
    @Column(name = "qna_id")
    private Long qnaId; // QnA PK (날짜+일련번호)(관리번호)

    @Column(name = "qna_no", unique = true, nullable = false)
    private Long qnaNo; // 사용자에게 보여지는 번호

    @Column(name = "qna_title", nullable = false, length = 255)
    private String qnaTitle;

    @Column(name = "qna_content", columnDefinition = "TEXT", nullable = false)
    private String qnaContent;

    @Column(name = "qna_writer", nullable = false, length = 50)
    private String qnaWriter;

    @Column(name = "qna_answer", columnDefinition = "TEXT")
    private String qnaAnswer;                  // 관리자 답변

    @Column(name = "qna_answer_writer", length = 50)
    private String qnaAnswerWriter;            // 답변 작성자(관리자 ID)

    @Column(name = "qna_is_secret", length = 1)
    private String qnaIsSecret;                // 'Y'/'N'

    @Column(name = "qna_password", length = 4)
    private String qnaPassword; // 숫자 4자리 문자열

    @Column(name = "qna_is_reported", length = 1)
    private String qnaIsReported;              // 'Y'/'N'

    @Column(name = "qna_is_answered", length = 1)
    private String qnaIsAnswered;              // 'Y'/'N'

    @Column(name = "qna_created_at", updatable = false)
    private LocalDateTime qnaCreatedAt;

    @Column(name = "qna_updated_at")
    private LocalDateTime qnaUpdatedAt;
    
    @Column(name = "qna_report_count")
    private Integer qnaReportCount = 0;

    @PrePersist
    protected void onCreate() {
        this.qnaCreatedAt = LocalDateTime.now();
        this.qnaUpdatedAt = LocalDateTime.now();
        if (this.qnaIsSecret == null) this.qnaIsSecret = "N";
        if (this.qnaIsReported == null) this.qnaIsReported = "N";
        if (this.qnaIsAnswered == null) this.qnaIsAnswered = "N";
    }

    @PreUpdate
    protected void onUpdate() {
        this.qnaUpdatedAt = LocalDateTime.now();
    }
}
