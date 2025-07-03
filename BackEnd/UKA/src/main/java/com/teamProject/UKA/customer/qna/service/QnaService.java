package com.teamProject.UKA.customer.qna.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.customer.qna.dto.QnaCommentResponseDTO;
import com.teamProject.UKA.customer.qna.dto.QnaRequestDTO;
import com.teamProject.UKA.customer.qna.dto.QnaResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaEntity;
import com.teamProject.UKA.customer.qna.repository.QnaCommentRepository;
import com.teamProject.UKA.customer.qna.repository.QnaLikeLogRepository;
import com.teamProject.UKA.customer.qna.repository.QnaReportLogRepository;
import com.teamProject.UKA.customer.qna.repository.QnaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaService {

	private final QnaRepository qnaRepository;
	private final QnaCommentRepository qnaCommentRepository;
    private final QnaLikeLogRepository qnaLikeLogRepository;
    private final QnaReportLogRepository qnaReportLogRepository;

	// QnA 등록
	@Transactional
	public QnaResponseDTO createQna(QnaRequestDTO dto) {
		Long newId = generateQnaId(); // 날짜+일련번호 PK 생성 메서드
		Long newNo = generateNextQnaNo();
		QnaEntity qna = QnaEntity.builder().qnaId(newId) // PK 꼭 세팅
				.qnaNo(newNo) // 사용자 번호도 세팅
				.qnaTitle(dto.getQnaTitle()).qnaContent(dto.getQnaContent()).qnaWriter(dto.getQnaWriter())
				.qnaIsSecret(dto.getQnaIsSecret()).qnaPassword(dto.getQnaPassword())
				.qnaIsReported(dto.getQnaIsReported()).build();
		QnaEntity saved = qnaRepository.save(qna);
		return QnaResponseDTO.fromEntity(saved);
	}

	// QnA 전체 목록
	@Transactional(readOnly = true)
	public List<QnaResponseDTO> getAllQna() {
		return qnaRepository.findAll().stream().map(QnaResponseDTO::fromEntity).collect(Collectors.toList());
	}

	// QnA 상세 조회
	@Transactional(readOnly = true)
	public QnaResponseDTO getQnaByNo(Long qnaNo) {
		QnaEntity qna = qnaRepository.findByQnaNo(qnaNo).orElseThrow(() -> new RuntimeException("QnA not found"));
		return QnaResponseDTO.fromEntity(qna);
	}

	public Optional<QnaEntity> findByQnaNo(Long qnaNo) {
		return qnaRepository.findByQnaNo(qnaNo);
	}
	
	// 조회수 올라가는 세팅
	@Transactional
	public void increaseViewCount(Long qnaNo) {
	    QnaEntity qna = qnaRepository.findByQnaNo(qnaNo)
	        .orElseThrow(() -> new RuntimeException("QnA not found"));

	    if (qna.getQnaViews() == null) {
	        qna.setQnaViews(1);
	    } else {
	        qna.setQnaViews(qna.getQnaViews() + 1);
	    }
	    qnaRepository.save(qna);
	    System.out.println("조회수 증가: " + qna.getQnaId() + " 현재 조회수: " + qna.getQnaViews());
	}

	// QnA 수정
	@Transactional
	public QnaResponseDTO updateQna(Long no, QnaRequestDTO dto) {
		QnaEntity qna = qnaRepository.findByQnaNo(no) // ← 여기!!
				.orElseThrow(() -> new RuntimeException("QnA not found"));
		qna.setQnaTitle(dto.getQnaTitle());
		qna.setQnaContent(dto.getQnaContent());
		qna.setQnaIsSecret(dto.getQnaIsSecret());
		// 필요에 따라 추가 세팅
		return QnaResponseDTO.fromEntity(qna);
	}

	@Transactional
	public void deleteQna(Long no) {
		QnaEntity qna = qnaRepository.findByQnaNo(no).orElseThrow(() -> new RuntimeException("해당 니다."));
		qnaRepository.delete(qna);
	}

	// 고유번호 생성기
	public Long generateQnaId() {
		String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd")); // "250626"
		String prefix = dateStr;
		String likePattern = prefix + "%";

		Long lastId = qnaRepository.findMaxIdByDate(likePattern); // ← 이 부분만 QnaRepository에서 구현
		int nextSeq = 1;
		if (lastId != null) {
			String lastIdStr = lastId.toString();
			int lastSeq = 0;
			if (lastIdStr.length() >= 9) {
				lastSeq = Integer.parseInt(lastIdStr.substring(6));
			}
			nextSeq = lastSeq + 1;
		}
		String newIdStr = prefix + String.format("%03d", nextSeq);
		return Long.valueOf(newIdStr);
	}

	// qnaNo 자동 생성기
	public Long generateNextQnaNo() {
		Long maxNo = qnaRepository.findMaxQnaNo();
		if (maxNo == null) {
			return 1L;
		}
		return maxNo + 1;
	}

	// QnA 신고
	@Transactional
	public void reportQna(Long qnaNo) {
		QnaEntity qna = qnaRepository.findByQnaNo(qnaNo).orElseThrow(() -> new RuntimeException("해당글이 없습니다."));

		int reportCount = qna.getQnaReportCount() == null ? 1 : qna.getQnaReportCount() + 1;
		qna.setQnaReportCount(reportCount);
		if (reportCount >= 5) {
			qna.setQnaIsReported("Y");
		}
	}

	// QnA 복원
	@Transactional
	public void restoreQna(Long no) {
		QnaEntity qna = qnaRepository.findByQnaNo(no).orElseThrow(() -> new RuntimeException("QnA not found"));

		qna.setQnaIsReported("N");
		qna.setQnaReportCount(0);
		qnaRepository.save(qna);
	}

	// 관리자 답변 저장/수정/삭제
	@Transactional
	public QnaResponseDTO updateQnaAnswer(Long no, String answer, String answerWriter) {
		QnaEntity qna = qnaRepository.findByQnaNo(no).orElseThrow(() -> new RuntimeException("QnA not found"));

		qna.setQnaAnswer(answer);
		qna.setQnaAnswerWriter(answerWriter);
		qna.setQnaIsAnswered((answer != null && !answer.trim().isEmpty()) ? "Y" : "N");

		QnaEntity updated = qnaRepository.save(qna);
		return QnaResponseDTO.fromEntity(updated);
	}

	@Transactional(readOnly = true)
	public Optional<QnaEntity> findByQnaId(Long qnaId) {
		return qnaRepository.findById(qnaId);
	}

	// QnA + 댓글 리스트 포함해서 반환하는 메서드
	@Transactional(readOnly = true)
	public QnaResponseDTO getQnaWithComments(Long qnaNo) {
		QnaEntity qna = qnaRepository.findByQnaNo(qnaNo).orElseThrow(() -> new RuntimeException("QnA not found"));

		// 🔥 댓글 전체 가져오기
		List<QnaCommentResponseDTO> comments = qnaCommentRepository.findByQna_QnaId(qna.getQnaId()).stream()
				.map(QnaCommentResponseDTO::fromEntity).collect(Collectors.toList());

		return QnaResponseDTO.fromEntity(qna, comments);
	}
	
	public boolean hasUserLikedQna(Long qnaNo, String userId) {
	    return qnaLikeLogRepository.existsByQnaNoAndUserId(qnaNo, userId);
	}
	
	public boolean hasUserReportedQna(Long qnaNo, String userId) {
	    return qnaReportLogRepository.existsByQnaNoAndUserId(qnaNo, userId);
	}

}
