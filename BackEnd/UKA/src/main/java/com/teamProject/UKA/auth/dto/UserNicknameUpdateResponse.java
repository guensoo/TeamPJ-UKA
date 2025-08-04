package com.teamProject.UKA.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserNicknameUpdateResponse {
    private String userId;
    private String nickname;
}
