package com.teamProject.UKA.board.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.teamProject.UKA.board.dto.BoardRequestDTO;
import com.teamProject.UKA.board.dto.BoardResponseDTO;
import com.teamProject.UKA.board.dto.BoardUserIdDTO;
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
    public ResponseEntity<BoardResponseDTO> getBoard(
    		@PathVariable("id") String id,
    		@RequestParam(value = "userId", required = false) String userId) {
    	// id : board_250630_0004
        BoardResponseDTO responseDTO = service.getBoard(id, userId);
        return ResponseEntity.ok(responseDTO);
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
            @RequestBody BoardUserIdDTO boardUserIdDTO) {
        BoardResponseDTO updated = service.toggleLikes(id, boardUserIdDTO.getUserId());
        return ResponseEntity.ok(updated);
    }

    //게시글 신고 카운트
    @PostMapping("/{id}/report")
    public ResponseEntity<BoardResponseDTO> toggleReport(
            @PathVariable("id") String id,
            @RequestBody BoardUserIdDTO boardUserIdDTO) {
        BoardResponseDTO updated = service.toggleReport(id, boardUserIdDTO.getUserId());
        return ResponseEntity.ok(updated);
    }
    
    //이미지 업로드
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일이 비어있습니다."));
        }
        try {
            String uploadDir = "C:\\my-app\\board"; // 경로 맞게 수정
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String savedFilename = System.currentTimeMillis() + "_" + originalFilename;
            File destination = new File(uploadDir + File.separator + savedFilename);
            file.transferTo(destination);
            String imageUrl = "/images/" + savedFilename;
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "이미지 업로드 실패"));
        }
    }
    
    //복원
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreReportedBoard(@PathVariable("id") String id){
    	service.restoreReportedBoard(id);
    	return ResponseEntity.ok().build();
    }
}
