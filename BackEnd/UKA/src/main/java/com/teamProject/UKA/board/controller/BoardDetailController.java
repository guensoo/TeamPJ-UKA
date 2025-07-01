package com.teamProject.UKA.board.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.board.dto.BoardDetailDTO;
import com.teamProject.UKA.board.model.BoardDetail;
import com.teamProject.UKA.board.service.BoardDetailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board-detail")
public class BoardDetailController {

	private final BoardDetailService detailService;
	
	@GetMapping("/{detailId}")
    public ResponseEntity<BoardDetailDTO> getBoardDetailView(@PathVariable String detailId) {
        BoardDetailDTO dto = detailService.getBoardDetailView(detailId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<BoardDetailDTO> createBoardDetail(@RequestBody BoardDetailDTO dto) {
        BoardDetailDTO saved = detailService.createBoardDetail(dto);
        return ResponseEntity.ok(saved);
    }
}
