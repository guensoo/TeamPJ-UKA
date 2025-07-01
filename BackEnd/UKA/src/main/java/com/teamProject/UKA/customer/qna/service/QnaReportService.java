package com.teamProject.UKA.customer.qna.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.customer.qna.dto.QnaReportLogResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaEntity;
import com.teamProject.UKA.customer.qna.entity.QnaReportLog;
import com.teamProject.UKA.customer.qna.repository.QnaReportLogRepository;
import com.teamProject.UKA.customer.qna.repository.QnaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaReportService {

    private final QnaReportLogRepository qnaReportLogRepository;
    private final QnaRepository qnaRepository;

    @Transactional
    public QnaReportLogResponseDTO reportQna(Long qnaNo, String userId) {
        boolean isAdmin = userId != null && userId.toLowerCase().contains("admin");

        if (!isAdmin && qnaReportLogRepository.existsByQnaNoAndUserId(qnaNo, userId)) {
            throw new IllegalStateException("이미 신고하셨습니다.");
        }

        if (isAdmin) {
            QnaReportLog lastLog = null;
            for (int i = 0; i < 5; i++) {
                QnaReportLog log = QnaReportLog.builder()
                    .qnaNo(qnaNo)
                    .userId(userId + "_admin_" + i)  // 고유 userId로 중복 회피
                    .build();
                lastLog = qnaReportLogRepository.save(log);
            }

            QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
                .orElseThrow(() -> new IllegalArgumentException("QnA 게시글이 존재하지 않습니다."));
            qna.setQnaReportCount(5);
            qna.setQnaIsReported("Y");

            // 마지막으로 저장된 로그 정보로 DTO 생성
            return new QnaReportLogResponseDTO(
                lastLog.getId(),
                lastLog.getQnaNo(),
                lastLog.getUserId(),
                lastLog.getCreatedAt()
            );
        } else {
            QnaReportLog log = QnaReportLog.builder()
                .qnaNo(qnaNo)
                .userId(userId)
                .build();
            qnaReportLogRepository.save(log);

            QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
                .orElseThrow(() -> new IllegalArgumentException("QnA 게시글이 존재하지 않습니다."));

            Integer currentReportCount = qna.getQnaReportCount();
            int newReportCount = (currentReportCount == null ? 0 : currentReportCount) + 1;
            qna.setQnaReportCount(newReportCount);

            if (newReportCount >= 5) {
                qna.setQnaIsReported("Y");
            }

            return new QnaReportLogResponseDTO(
                log.getId(), log.getQnaNo(), log.getUserId(), log.getCreatedAt()
            );
        }
    }

    @Transactional(readOnly = true)
    public boolean hasUserReported(Long qnaNo, String userId) {
        return qnaReportLogRepository.existsByQnaNoAndUserId(qnaNo, userId);
    }
}