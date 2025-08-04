package com.teamProject.UKA.customer.qna.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.auth.model.User;
import com.teamProject.UKA.auth.repository.UserRepository;
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
    private final UserRepository userRepository;

    // 댓글 등록
    @Transactional
    public QnaCommentResponseDTO createQnaComment(QnaCommentRequestDTO dto) {
        // 1. QnaEntity 조회
        QnaEntity qna = qnaRepository.findById(dto.getQnaId())
                .orElseThrow(() -> new IllegalArgumentException("해당 QnA 글이 존재하지 않습니다."));
        
        User user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        // 2. QnA 글 기준으로 마지막 댓글 번호 조회
        Integer lastNo = qnaCommentRepository.findMaxNoByQnaId(qna.getQnaId());
        int nextNo = lastNo != null ? lastNo + 1 : 1;

        // 3. 댓글 생성
        QnaCommentEntity comment = QnaCommentEntity.builder()
                .qna(qna)
                .user(user) // ⭐️ 꼭 연결!!
                .qnaCommentNo(nextNo)
                .qnaCommentWriter(user.getNickname()) // 닉네임도 User에서 추출
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

    // 댓글 숨김
    @Transactional
    public void deleteQnaComment(Long commentId) {
        QnaCommentEntity comment = qnaCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        comment.setDeleted("Y");
        qnaCommentRepository.save(comment);
    }
    
    // 댓글 삭제
    @Transactional
    public void deleteQnaCommentPermanently(Long commentId) {
        QnaCommentEntity comment = qnaCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        qnaCommentRepository.delete(comment); // 실제 삭제
    }
}