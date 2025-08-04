package com.teamProject.UKA.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyLikeResponseDTO {
    private String id;
    private String title;
    private String author;
    private String date;
    private int likes;
    
    public static MyLikeResponseDTO fromRow(Object[] row) {
        return MyLikeResponseDTO.builder()
            .id(String.valueOf(row[0]))
            .title((String) row[1])
            .author((String) row[2])
            .date(row[3] != null ? row[3].toString().substring(0, 10) : null)
            .likes(row[4] != null ? Integer.parseInt(row[4].toString()) : 0)
            .build();
    }
}
