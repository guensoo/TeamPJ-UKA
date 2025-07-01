package com.teamProject.UKA.adminPage.model;

import com.teamProject.UKA.adminPage.dto.ReportListDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportListEntity {
	@Id
    private String id;
    private String category;
    private String title;
    
    public static ReportListEntity fromDTO(ReportListDTO dto) {
    	return ReportListEntity.builder()
    			.id(dto.getId())
    			.category(dto.getCategory())
    			.title(dto.getTitle())
    			.build();
    }
    
    public ReportListDTO toDTO() {
    	ReportListDTO dto = new ReportListDTO();
    	dto.setCategory(this.category);
    	dto.setId(this.id);
    	dto.setTitle(this.title);
    	return dto;
    }
}
