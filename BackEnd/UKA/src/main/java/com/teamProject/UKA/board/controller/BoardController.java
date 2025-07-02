package com.teamProject.UKA.board.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.board.dto.BoardCommentCount;
import com.teamProject.UKA.board.dto.BoardRequestDTO;
import com.teamProject.UKA.board.dto.BoardResponseDTO;
import com.teamProject.UKA.board.service.BoardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService service;
	
	//게시글 전체 조회
	@GetMapping
	public ResponseEntity<List<BoardResponseDTO>> getAllBoards() {
	    return ResponseEntity.ok(service.getAllBoards());
	}
	
	//게시글 등록
	@PostMapping
	public ResponseEntity<BoardResponseDTO> createBoard(@Valid @RequestBody BoardRequestDTO requestDTO){
		BoardResponseDTO responseDTO = service.createBoard(requestDTO);
		
		return ResponseEntity.ok(responseDTO);
	}

	// 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> getBoard(@PathVariable("id") String id) {
    	// id : board_250630_0004
        BoardResponseDTO responseDTO = service.getBoard(id);
        return ResponseEntity.ok(responseDTO);
    }
    
    //게시글 조회수 증가
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable("id") String id) {
        service.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
    
    //게시글 추천 카운트
    @PostMapping("/{id}/likes")
    public ResponseEntity<BoardResponseDTO> toggleLikes(
            @PathVariable("id") String id,
            @RequestParam("increment") boolean increment) {
        BoardResponseDTO updated = service.toggleLikes(id, increment);
        return ResponseEntity.ok(updated);
    }

    //게시글 신고 카운트
    @PostMapping("/{id}/report")
    public ResponseEntity<BoardResponseDTO> toggleReport(
            @PathVariable("id") String id,
            @RequestParam("increment") boolean increment) {
        BoardResponseDTO updated = service.toggleReport(id, increment);
        return ResponseEntity.ok(updated);
    }

    //게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> updateBoard(
    		@PathVariable("id") String id, @RequestBody BoardRequestDTO requestDTO){
    	BoardResponseDTO responseDTO = service.updateBoard(id, requestDTO);
    	
    	return ResponseEntity.ok(responseDTO);
    }
    
    //게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> deleteBoard(@PathVariable("id") String id){
    	service.deleteBoard(id);
    	
    	return ResponseEntity.noContent().build();
    }
}
