package com.teamProject.UKA.board.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "board_detail")
public class BoardDetail {

	@Id
	@Column(name = "id")
	private String id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "main_id")
	private Board boardMain; // board_main 테이블 참조 FK
    
    @Lob
    @Column(name = "content")
    private String content;
    
    @Column(name = "report")
    private int report;
    
//    @OneToMany(mappedBy = "boardDetail", cascade = CascadeType.ALL, orphanRemoval = true)
//    @Column(name = "brd_comments")
//    private List<Comment> comments = new ArrayList<>();
    
}
