package com.teamProject.UKA.customer.qna.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "qna_comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QnaCommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_comment_id")
    private Long qnaCommentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qna_id", nullable = false)
    private QnaEntity qna;  // FK 관계

    @Column(name = "qna_comment_no")
    private Integer qnaCommentNo;  // QnA 내 댓글 순번

    @Column(name = "qna_comment_writer", length = 50)
    private String qnaCommentWriter;

    @Column(name = "qna_comment_content", columnDefinition = "TEXT")
    private String qnaCommentContent;

    @Column(name = "qna_comment_is_secret", length = 1, nullable = false)
    private String qnaCommentIsSecret = "N";  // 기본값 'N'

    @Column(name = "qna_comment_is_reported", length = 1, nullable = false)
    private String qnaCommentIsReported = "N"; // 기본값 'N'

    @Column(name = "qna_comment_created_at", updatable = false)
    private LocalDateTime qnaCommentCreatedAt;

    @Column(name = "qna_comment_updated_at")
    private LocalDateTime qnaCommentUpdatedAt;
    
    @Column(name = "deleted", length = 1, nullable = false)
    private String deleted = "N";

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.qnaCommentCreatedAt = now;
        this.qnaCommentUpdatedAt = now;
        if (this.qnaCommentIsSecret == null) this.qnaCommentIsSecret = "N";
        if (this.qnaCommentIsReported == null) this.qnaCommentIsReported = "N";
        if (this.deleted == null) this.deleted = "N";
    }

    @PreUpdate
    protected void onUpdate() {
        this.qnaCommentUpdatedAt = LocalDateTime.now();
        if ("Y".equals(this.deleted)) {
            this.qnaCommentContent = "관리자에 의해 삭제된 댓글입니다.";
        }
    }
}