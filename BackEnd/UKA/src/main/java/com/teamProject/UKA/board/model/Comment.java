package com.teamProject.UKA.board.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "board_comment")
public class Comment {

	@Id
	@Column(name = "cmt_id", length = 50)
	private String id; //댓글 아이디 ex)board_250701_0001_001, board_250701_0001_001_001
	
	@ManyToOne
	@JoinColumn(name = "brd_id", nullable = false) //FK - 어느 게시글에 댓글이 달렸는지
	private Board board;
	
	@Column(name = "parent_cmt_id", length = 50)
	private String parentCommentId; // 부모 댓글 ID(대댓글에서만 사용, 최상위 댓글이면 null)
	
	@Column(name = "author", nullable = false)
	private String author;
	
	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;
	
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;
	
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
	
	@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
	
}
