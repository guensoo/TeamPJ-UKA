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

        System.out.println("test :: " + qnaNo + " : " +userId); // test :: 7 : one
        QnaLikeLog log = QnaLikeLog.builder()
                .qnaNo(qnaNo)
                .userId(userId)
                .build();
        qnaLikeLogRepository.save(log);
        
        System.out.println("너 들어왔잖아");

        // qnaNo로 게시글 조회
        QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
                .orElseThrow(() -> new IllegalArgumentException("QnA 게시글이 존재하지 않습니다."));
        Integer likeCount = qna.getQnaLikeCount();
        if (likeCount == null) {
            qna.setQnaLikeCount(1);
        } else {
            qna.setQnaLikeCount(likeCount + 1);
        }

        return new QnaLikeLogResponseDTO(
                log.getId(), log.getQnaNo(), log.getUserId(), log.getCreatedAt()
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
}
