package com.teamProject.UKA.customer.adoption.dto;
import com.teamProject.UKA.customer.adoption.Enum.ImageType;
import com.teamProject.UKA.customer.adoption.entity.AdoptionImage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdoptionImageDTO {
    private Long id;
    private ImageType type;
    private Integer seq;
    private String src;

    // 엔티티 → DTO
    public static AdoptionImageDTO fromEntity(AdoptionImage entity) {
        return AdoptionImageDTO.builder()
                .id(entity.getId())
                .type(entity.getType())
                .seq(entity.getSeq())
                .src(entity.getSrc())
                .build();
    }

    // DTO → 엔티티
    public AdoptionImage toEntity() {
        return AdoptionImage.builder()
                .id(this.id)
                .type(this.type)
                .seq(this.seq)
                .src(this.src)
                .build();
    }
}