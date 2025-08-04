package com.teamProject.UKA.auth.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class User {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long seq;
	
	@Column(nullable = false) 
	private String userId;
	  
	@Column(nullable = false) 
	private String nickname;
	  
	@Column(nullable = false, unique = true)
	private String email;
	  
	@Column(nullable = false) 
	private String passwordHash;
	  
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();
	
    @Builder.Default
    private boolean isActive = true; // 활성 상태 (탈퇴시 false)

    private LocalDateTime deletedAt; // 탈퇴 시각(탈퇴 전엔 null)
}
