package com.teamProject.UKA.board.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "board_main")
public class Board {
	
	@Id
	@Column(name = "brd_id", length = 30)
	private String id;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "brd_category", nullable = false)
	private Category category; //enum -> Category
	
	@Column(name = "brd_title", nullable = false)
	private String title;
	
	@Column(name = "brd_author", nullable = false)
	private String author;
	
	@Column(name = "brd_content", nullable = false, columnDefinition = "TEXT")
	private String content;
	
	@Builder.Default
	@Column(name = "brd_view")
	private int view = 0;
	
	@Builder.Default
	@Column(name = "brd_likes")
	private int likes = 0;
	
	@Builder.Default
	@Column(name = "brd_comment")
	private int comment = 0;
	
	@Builder.Default
    @Column(name = "brd_report")
    private int report = 0;
	
	@Column(name = "brd_created_at", updatable = false)
	private LocalDateTime createdAt;
	
	@Column(name = "brd_updated_at")
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
