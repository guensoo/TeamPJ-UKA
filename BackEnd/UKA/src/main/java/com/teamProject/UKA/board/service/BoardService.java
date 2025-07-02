package com.teamProject.UKA.board.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.board.dto.BoardRequestDTO;
import com.teamProject.UKA.board.dto.BoardResponseDTO;
import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.repository.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {

	private final BoardRepository repository;
	
	//게시글 전체조회
	@Transactional(readOnly = true)
	public List<BoardResponseDTO> getAllBoards() {
	    List<Board> boards = repository.findAll();
	    return boards.stream()
	                 .map(BoardResponseDTO::new)
	                 .collect(Collectors.toList());
	}
	
	//게시글 등록
	@Transactional
	public BoardResponseDTO createBoard(BoardRequestDTO requestDTO) {
		System.out.println(1);
		String newId = generateBoardId();

        Board board = requestDTO.toEntity(newId);
        Board saved = repository.save(board);

        return new BoardResponseDTO(saved);
	}

	//게시글 단건 조회
	@Transactional
    public BoardResponseDTO getBoard(String id) {
        Board board = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + id));

        // 조회수 증가
//        board.setView(board.getView() + 1);
        // save() 없이 영속성 컨텍스트에서 변경감지 후 자동 반영됨 (트랜잭션 내)
        return new BoardResponseDTO(board);
    }
	
	//조회수 증가
	@Transactional
	public void incrementViewCount(String id) {
	    repository.incrementViewCount(id);
	}
	
	//게시글 추천 카운트
	@Transactional
	public BoardResponseDTO toggleLikes(String id, boolean increment) {
	    Board board = repository.findById(id)
	            .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + id));

	    int newLikes = board.getLikes() + (increment ? 1 : -1);
	    board.setLikes(Math.max(newLikes, 0)); // 음수 방지
	    return new BoardResponseDTO(board);
	}

	//게시글 신고 카운트
	@Transactional
	public BoardResponseDTO toggleReport(String id, boolean increment) {
	    Board board = repository.findById(id)
	            .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + id));

	    int newReport = board.getReport() + (increment ? 1 : -1);
	    board.setReport(Math.max(newReport, 0)); // 음수 방지
	    return new BoardResponseDTO(board);
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
		
		return new BoardResponseDTO(board);
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
}
