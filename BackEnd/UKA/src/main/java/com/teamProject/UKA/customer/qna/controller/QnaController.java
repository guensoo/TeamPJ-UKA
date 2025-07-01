package com.teamProject.UKA.customer.qna.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.customer.qna.dto.QnaRequestDTO;
import com.teamProject.UKA.customer.qna.dto.QnaResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaEntity;
import com.teamProject.UKA.customer.qna.service.QnaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;

    // 게시글 등록
    @PostMapping
    public ResponseEntity<QnaResponseDTO> createQna(@RequestBody QnaRequestDTO dto) {
        return ResponseEntity.ok(qnaService.createQna(dto));
    }

    // 전체 게시글 목록 조회
    @GetMapping
    public ResponseEntity<List<QnaResponseDTO>> getAllQna() {
        return ResponseEntity.ok(qnaService.getAllQna());
    }

    // QnA 게시글 상세 조회 (댓글 포함)
    @GetMapping("/{no}")
    public ResponseEntity<QnaResponseDTO> getQna(
        @PathVariable("no") Long no,
        @RequestParam(value = "password", required = false) String password
    ) {
        QnaEntity qna = qnaService.findByQnaNo(no)
            .orElseThrow(() -> new RuntimeException("글이 없습니다."));

        // 관리자 권한 체크
        boolean isAdmin = false;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String userId = authentication.getName();
            if (userId != null && userId.toLowerCase().contains("admin")) {
                isAdmin = true;
            }
        }

        // 신고글 접근 제한 (관리자는 예외)
        if ("Y".equals(qna.getQnaIsReported()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 비밀글 접근 제한 (관리자는 예외)
        if ("Y".equals(qna.getQnaIsSecret()) && !isAdmin) {
            if (password == null || !password.equals(qna.getQnaPassword())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        // QnA + 댓글 리스트 DTO로 반환
        return ResponseEntity.ok(qnaService.getQnaWithComments(no));
    }

    // 조회수 증가용 엔드포인트
    @PatchMapping("/{no}/increase-view")
    public ResponseEntity<?> increaseViewCount(@PathVariable("no") Long no) {
        try {
            qnaService.increaseViewCount(no);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    // 게시글 수정
    @PutMapping("/{no}")
    public ResponseEntity<QnaResponseDTO> updateQna(@PathVariable("no") Long no, @RequestBody QnaRequestDTO dto) {
        return ResponseEntity.ok(qnaService.updateQna(no, dto));
    }

    // 게시글 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<?> deleteQna(@PathVariable("no") Long no) {
        qnaService.deleteQna(no); // 내부에서 존재 여부 확인 및 삭제 처리
        return ResponseEntity.ok().build();
    }
    
    // 게시글 신고
    @PatchMapping("/{no}/report")
    public ResponseEntity<?> reportQna(@PathVariable("no") Long no) {
        qnaService.reportQna(no);
        return ResponseEntity.ok().build();
    }
    
    // 게시글 복원
    @PatchMapping("/{no}/restore")
    public ResponseEntity<?> restoreQna(@PathVariable("no") Long no) {
    	System.out.println("들어오니");
        qnaService.restoreQna(no);
        return ResponseEntity.ok("복원 완료");
    }
    
    // 관리자 답변 저장/수정/삭제 (빈값이면 삭제)
    @PatchMapping("/{no}/answer")
    public ResponseEntity<?> updateQnaAnswer(
        @PathVariable("no") Long no,
        @RequestBody QnaRequestDTO dto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = false;
        String userId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            userId = authentication.getName();
            // ⬇️ 여기!
            System.out.println("[QnA PATCH] userId: " + userId);
            if (userId != null && userId.toLowerCase().contains("admin")) {
                isAdmin = true;
            }
        }
        // ⬇️ 여기!
        System.out.println("[QnA PATCH] isAdmin: " + isAdmin);

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("관리자만 답변을 등록/수정/삭제할 수 있습니다.");
        }

        // 2. 서비스 호출 (서비스에서 엔티티 조회, 값 세팅, 저장)
        QnaResponseDTO result = qnaService.updateQnaAnswer(no, dto.getQnaAnswer(), 
                                        dto.getQnaAnswerWriter() != null ? dto.getQnaAnswerWriter() : userId);

        return ResponseEntity.ok(result);
    }

}
