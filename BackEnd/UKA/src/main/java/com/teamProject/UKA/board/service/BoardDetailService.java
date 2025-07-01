package com.teamProject.UKA.board.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.board.dto.BoardDetailDTO;
import com.teamProject.UKA.board.model.Board;
import com.teamProject.UKA.board.model.BoardDetail;
import com.teamProject.UKA.board.repository.BoardDetailRepository;
import com.teamProject.UKA.board.repository.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardDetailService {

	private final BoardDetailRepository detailRepository;
	private final BoardRepository mainRepository;
	
	@Transactional(readOnly = true)
    public BoardDetailDTO getBoardDetailView(String detailId) {
        return detailRepository.findBoardDetailViewById(detailId);
    }

	@Transactional
	public BoardDetailDTO createBoardDetail(BoardDetailDTO dto) {
	    Board boardMain = mainRepository.findById(dto.getMainId())
	        .orElseThrow(() -> new IllegalArgumentException("BoardMain not found. id=" + dto.getMainId()));

	    BoardDetail boardDetail = dto.toEntity(boardMain);
	    BoardDetail saved = detailRepository.save(boardDetail);
	    return new BoardDetailDTO(saved);
	}
	
}
