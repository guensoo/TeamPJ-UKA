package com.teamProject.UKA.customer.qna.service;

import org.springframework.stereotype.Service;

import com.teamProject.UKA.customer.qna.dto.QnaLikeLogResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaEntity;
import com.teamProject.UKA.customer.qna.entity.QnaLikeLog;
import com.teamProject.UKA.customer.qna.repository.QnaLikeLogRepository;
import com.teamProject.UKA.customer.qna.repository.QnaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaLikeService {
	
    private final QnaLikeLogRepository qnaLikeLogRepository;
    private final QnaRepository qnaRepository;

    @Transactional
    public QnaLikeLogResponseDTO likeQna(Long qnaNo, String userId) {
        if (qnaLikeLogRepository.existsByQnaNoAndUserId(qnaNo, userId)) {
            throw new IllegalStateException("이미 추천하셨습니다.");
        }

        // 1. 로그 저장
        QnaLikeLog log = QnaLikeLog.builder()
            .qnaNo(qnaNo)
            .userId(userId)
            .build();
        QnaLikeLog saved = qnaLikeLogRepository.save(log);

        // 2. QnA 글 좋아요 수 증가
        QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
            .orElseThrow(() -> new IllegalArgumentException("QnA 게시글이 존재하지 않습니다."));
        int current = qna.getQnaLikeCount() != null ? qna.getQnaLikeCount() : 0;
        qna.setQnaLikeCount(current + 1);

        // 3. 응답 반환
        return new QnaLikeLogResponseDTO(
            saved.getId(),
            saved.getQnaNo(),
            saved.getUserId(),
            saved.getCreatedAt()
        );
    }
    
    @Transactional
    public void unlikeQna(Long qnaNo, String userId) {
        // 추천 기록이 없으면 예외 처리
        QnaLikeLog log = qnaLikeLogRepository.findByQnaNoAndUserId(qnaNo, userId)
            .orElseThrow(() -> new IllegalStateException("추천 기록이 없습니다."));

        // 추천 로그 삭제
        qnaLikeLogRepository.delete(log);

        // 추천 카운트 감소
        QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
            .orElseThrow(() -> new IllegalArgumentException("QnA 게시글이 존재하지 않습니다."));

        Integer currentLikeCount = qna.getQnaLikeCount();
        int newLikeCount = (currentLikeCount == null ? 0 : currentLikeCount) - 1;
        qna.setQnaLikeCount(Math.max(newLikeCount, 0)); // 0보다 작지 않게 처리
    }
    
    public boolean isLikedByUser(Long qnaNo, String userId) {
        return qnaLikeLogRepository.existsByQnaNoAndUserId(qnaNo, userId);
    }
}
