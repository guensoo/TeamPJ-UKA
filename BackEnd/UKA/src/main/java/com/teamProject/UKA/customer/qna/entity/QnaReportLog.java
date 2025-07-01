package com.teamProject.UKA.customer.qna.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "qna_report_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QnaReportLog {
	 // → qna_report_log 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_report_log_id")
	 private Long id;

	@Column(name = "qna_no")            // ★ 이거 명시해주는 게 안전!
	private Long qnaNo;
	
	@Column(name = "user_id")
	private String userId;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
}
