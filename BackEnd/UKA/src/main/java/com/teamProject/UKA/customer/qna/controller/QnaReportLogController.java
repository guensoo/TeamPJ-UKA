package com.teamProject.UKA.customer.qna.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.customer.qna.dto.QnaReportLogResponseDTO;
import com.teamProject.UKA.customer.qna.service.QnaReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/qna")
@RequiredArgsConstructor
public class QnaReportLogController {

    private final QnaReportService qnaReportService;

    /**
     * 신고 요청 처리
     * @param no 게시글 번호(PathVariable)
     * @param param JSON 바디에서 userId 받음
     * @return 신고 처리 결과 또는 에러 메시지
     */
    @PostMapping("/{no}/report")
    public ResponseEntity<?> reportQna(
        @PathVariable("no") Long no,
        @RequestBody Map<String, String> param
    ) {
        String userId = param.get("userId");
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userId가 필요합니다.");
        }

        try {
            // isAdmin 판단은 서비스 내부에서 처리하므로, 그냥 reportQna 호출
            QnaReportLogResponseDTO result = qnaReportService.reportQna(no, userId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("처리 중 오류가 발생했습니다.");
        }
    }

    /**
     * 특정 사용자가 게시글을 신고했는지 여부 확인하는 API
     * @param no 게시글 번호(PathVariable)
     * @param userId 사용자 ID (쿼리 파라미터)
     * @return true: 신고함, false: 신고 안함
     */
    @GetMapping("/{no}/reported")
    public ResponseEntity<Boolean> hasUserReported(
        @PathVariable("no") Long no,
        @RequestParam String userId
    ) {
        boolean reported = qnaReportService.hasUserReported(no, userId);
        return ResponseEntity.ok(reported);
    }
}

