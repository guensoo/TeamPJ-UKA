package com.teamProject.UKA.customer.qna.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.customer.qna.dto.QnaLikeLogResponseDTO;
import com.teamProject.UKA.customer.qna.service.QnaLikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/qna")
@RequiredArgsConstructor
public class QnaLikeLogController {
    private final QnaLikeService qnaLikeService;

    @PostMapping("/{no}/like")
    public ResponseEntity<?> likeQna(
        @PathVariable("no") Long no,
        @RequestBody Map<String, String> param // userId를 요청 바디로 받음
    ) {
        String userId = param.get("userId");
        try {
            QnaLikeLogResponseDTO result = qnaLikeService.likeQna(no, userId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("처리 중 오류가 발생했습니다.");
        }
    }
    
    @DeleteMapping("/{no}/like")
    public ResponseEntity<?> unlikeQna(
        @PathVariable("no") Long no,
        @RequestBody Map<String, String> param // userId 받기
    ) {
        String userId = param.get("userId");
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userId가 필요합니다.");
        }

        try {
            qnaLikeService.unlikeQna(no, userId);
            return ResponseEntity.ok("추천 취소 완료");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 오류가 발생했습니다.");
        }
    }
}
