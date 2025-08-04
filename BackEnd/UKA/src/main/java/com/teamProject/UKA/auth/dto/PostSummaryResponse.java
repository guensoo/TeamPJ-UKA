package com.teamProject.UKA.auth.dto;

import java.time.LocalDateTime;

public class PostSummaryResponse {
    private Long postId;
    private String title;
    private LocalDateTime createdAt;
    private int views;
    private int likes;
}
