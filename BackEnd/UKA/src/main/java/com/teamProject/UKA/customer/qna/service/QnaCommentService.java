package com.teamProject.UKA.customer.qna.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.customer.qna.dto.QnaCommentRequestDTO;
import com.teamProject.UKA.customer.qna.dto.QnaCommentResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaCommentEntity;
import com.teamProject.UKA.customer.qna.entity.QnaEntity;
import com.teamProject.UKA.customer.qna.repository.QnaCommentRepository;
import com.teamProject.UKA.customer.qna.repository.QnaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaCommentService {

    private final QnaCommentRepository qnaCommentRepository;
    private final QnaRepository qnaRepository;

    // 댓글 등록
    @Transactional
    public QnaCommentResponseDTO createQnaComment(QnaCommentRequestDTO dto) {
        // 1. QnaEntity 조회
        QnaEntity qna = qnaRepository.findById(dto.getQnaId())
                .orElseThrow(() -> new IllegalArgumentException("해당 QnA 글이 존재하지 않습니다."));

        // 2. QnA 글 기준으로 마지막 댓글 번호 조회
        Integer lastNo = qnaCommentRepository.findMaxNoByQnaId(qna.getQnaId());
        int nextNo = lastNo != null ? lastNo + 1 : 1;

        // 3. 댓글 생성
        QnaCommentEntity comment = QnaCommentEntity.builder()
                .qna(qna)  // 💥 핵심
                .qnaCommentNo(nextNo)
                .qnaCommentWriter(dto.getQnaCommentWriter())
                .qnaCommentContent(dto.getQnaCommentContent())
                .build();

        QnaCommentEntity saved = qnaCommentRepository.save(comment);
        return QnaCommentResponseDTO.fromEntity(saved);
    }

    // 댓글 목록
    @Transactional(readOnly = true)
    public List<QnaCommentResponseDTO> getCommentsByQnaId(Long qnaId) {
        return qnaCommentRepository.findByQna_QnaId(qnaId).stream()
                .map(QnaCommentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public QnaCommentResponseDTO updateQnaComment(Long qnaCommentId, QnaCommentRequestDTO dto) {
        QnaCommentEntity comment = qnaCommentRepository.findById(qnaCommentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (dto.getQnaCommentContent() != null)
            comment.setQnaCommentContent(dto.getQnaCommentContent());

        if (dto.getQnaCommentWriter() != null)
            comment.setQnaCommentWriter(dto.getQnaCommentWriter());

        QnaCommentEntity updated = qnaCommentRepository.save(comment);
        return QnaCommentResponseDTO.fromEntity(updated);
    }

    // 댓글 삭제
    @Transactional
    public void deleteQnaComment(Long commentId) {
        QnaCommentEntity comment = qnaCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        comment.setDeleted("Y");
        // (JPA 변경감지로 자동 update이긴 하지만, 더 확실히 하고 싶으면 save까지)
        qnaCommentRepository.save(comment);
    }
    
    // 삭제 댓글 변경
    @Transactional
    public void deleteComment(Long commentId) {
        QnaCommentEntity comment = qnaCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        comment.setDeleted("Y");
        // save() 호출하거나, 트랜잭션 커밋 시 자동 반영
    }
}