package com.teamProject.UKA.customer.qna.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.customer.qna.dto.QnaCommentRequestDTO;
import com.teamProject.UKA.customer.qna.dto.QnaCommentResponseDTO;
import com.teamProject.UKA.customer.qna.service.QnaCommentService;
import com.teamProject.UKA.customer.qna.service.QnaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/qna")
@RequiredArgsConstructor
public class QnaCommentController {
    private final QnaCommentService qnaCommentService;
    private final QnaService qnaService;

    // 댓글 등록 (프론트와 맞춤)
    @PostMapping("/{qnaId}/comments")
    public ResponseEntity<QnaCommentResponseDTO> createComment(
        @PathVariable("qnaId") Long qnaId,
        @RequestBody QnaCommentRequestDTO dto) {

        qnaService.findByQnaNo(qnaId)
            .orElseThrow(() -> new RuntimeException("해당 QnA 글이 존재하지 않습니다."));

        return ResponseEntity.ok(qnaCommentService.createQnaComment(dto));
    }

    @GetMapping("/{qnaId}/comments")
    public ResponseEntity<List<QnaCommentResponseDTO>> getComments(@PathVariable("qnaId") Long qnaId) {
        return ResponseEntity.ok(qnaCommentService.getCommentsByQnaId(qnaId));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<QnaCommentResponseDTO> updateComment(
        @PathVariable("commentId") Long commentId,
        @RequestBody QnaCommentRequestDTO dto
    ) {
        return ResponseEntity.ok(qnaCommentService.updateQnaComment(commentId, dto));
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        qnaCommentService.deleteQnaComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
