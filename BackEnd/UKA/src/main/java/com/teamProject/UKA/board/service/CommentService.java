package com.teamProject.UKA.board.service;

import org.springframework.stereotype.Service;

import com.teamProject.UKA.board.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository repository;

}
