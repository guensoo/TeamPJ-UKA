package com.teamProject.UKA.board.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.board.dto.BoardRequestDTO;
import com.teamProject.UKA.board.dto.BoardResponseDTO;
import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.BoardLikes;
import com.teamProject.UKA.board.model.BoardReport;
import com.teamProject.UKA.board.repository.BoardLikesRepository;
import com.teamProject.UKA.board.repository.BoardReportRepository;
import com.teamProject.UKA.board.repository.BoardRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {

	private final BoardRepository repository;
	private final BoardLikesRepository boardLikesRepository;
	private final BoardReportRepository boardReportRepository;

	@PersistenceContext
	private EntityManager entityManager;
	
	//게시글 전체조회
	@Transactional(readOnly = true)
	public List<BoardResponseDTO> getAllBoards() {
	    List<Board> boards = repository.findAll();
	    return boards.stream()
	                 .map(board -> new BoardResponseDTO(board, false, false))
	                 .collect(Collectors.toList());
	}
	
	//게시글 등록
	@Transactional
	public BoardResponseDTO createBoard(BoardRequestDTO requestDTO) {
		System.out.println(1);
		String newId = generateBoardId();

        Board board = requestDTO.toEntity(newId);
        Board saved = repository.save(board);

        return new BoardResponseDTO(saved, false, false);
	}

	//게시글 단건 조회
	@Transactional
    public BoardResponseDTO getBoard(String id, String userId) {
        Board board = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + id));
        
        boolean likedByCurrentUser = false;
        boolean reportedByCurrentUser = false;
        
        if (userId != null) {
            likedByCurrentUser = boardLikesRepository.existsByPostIdAndUserId(id, userId);
            reportedByCurrentUser = boardReportRepository.existsByPostIdAndUserId(id, userId);
        }

        return new BoardResponseDTO(board, likedByCurrentUser, reportedByCurrentUser);
    }
	
	//게시글 수정
	@Transactional
	public BoardResponseDTO updateBoard(String id, BoardRequestDTO requestDTO) {
		Board board = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id="+id));
		
		board.setCategory(requestDTO.getCategory());
		board.setTitle(requestDTO.getTitle());
		board.setAuthor(requestDTO.getAuthor());
		board.setContent(requestDTO.getContent());
		board.setUpdatedAt(LocalDateTime.now());
		
		return new BoardResponseDTO(board, false, false);
	}
	
	@Transactional
	//게시글 삭제
	public void deleteBoard(String id) {
		Board board = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id="+id));
		
		repository.delete(board);
	}
	
	// ID 생성 (예: board_250626_0001)
    private String generateBoardId() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String prefix = "board_" + dateStr;

        String lastId = repository.findMaxIdByDate(prefix + "%");
        int nextSeq = 1;

        if (lastId != null && lastId.length() >= prefix.length() + 5) {
            String lastSeqStr = lastId.substring(prefix.length() + 1);
            nextSeq = Integer.parseInt(lastSeqStr) + 1;
        }

        return prefix + "_" + String.format("%04d", nextSeq);
    }
    
    //조회수 증가
  	@Transactional
  	public void incrementViewCount(String id) {
  	    repository.incrementViewCount(id);
  	}
  	
  	//게시글 추천 카운트
  	@Transactional
  	public BoardResponseDTO toggleLikes(String postId, String userId) {

  	    Optional<BoardLikes> existingLike = boardLikesRepository.findByPostIdAndUserId(postId, userId);

  	    if (existingLike.isPresent()) {
  	        // 이미 추천한 경우 → 추천 취소
  	        boardLikesRepository.delete(existingLike.get());
  	    } else {
  	        // 추천하지 않은 경우 → 추천 추가
  	        boardLikesRepository.save(new BoardLikes(null, postId, userId, LocalDateTime.now()));
  	    }

  	    long likesCount = boardLikesRepository.countByPostId(postId);
  	    repository.updateLikes(postId, (int) likesCount);
      
  	    
  	    long reportCount = boardReportRepository.countByPostId(postId);
  	    repository.updateReport(postId, (int) reportCount);
	    
	    entityManager.flush();
	    entityManager.clear();
	    
	    Board board = repository.findById(postId)
  	            .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + postId));
	    
	    boolean isLikedByCurrentUser = boardLikesRepository.existsByPostIdAndUserId(postId, userId);
  	    boolean isReportedByCurrentUser = boardReportRepository.existsByPostIdAndUserId(postId, userId);

  	    return new BoardResponseDTO(board, isLikedByCurrentUser, isReportedByCurrentUser);
  	}

  	//게시글 신고 카운트
  	@Transactional
  	public BoardResponseDTO toggleReport(String postId, String userId) {
  	    
  	    Optional<BoardReport> existingReport = boardReportRepository.findByPostIdAndUserId(postId, userId);

  	    if (existingReport.isPresent()) {
  	    	boardReportRepository.delete(existingReport.get());
	    } else {
	    	boardReportRepository.save(new BoardReport(null, postId, userId, LocalDateTime.now()));
	    }
  	    
  	    long likesCount = boardLikesRepository.countByPostId(postId);
  	    repository.updateLikes(postId, (int) likesCount);
	    
	    long reportCount = boardReportRepository.countByPostId(postId);
	    repository.updateReport(postId, (int) reportCount);
	    
	    entityManager.flush();
	    entityManager.clear();
	    
	    Board board = repository.findById(postId)
  	            .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + postId));
	    
	    boolean isLikedByCurrentUser = boardLikesRepository.existsByPostIdAndUserId(postId, userId);
	    boolean isReportedByCurrentUser = boardReportRepository.existsByPostIdAndUserId(postId, userId);

	    return new BoardResponseDTO(board, isLikedByCurrentUser, isReportedByCurrentUser);
  	}

  	//복원 버튼
	public void restoreReportedBoard(String id) {
		Board board = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. id=" + id));
		
		board.setReport(0);
		repository.save(board);
	}
}
