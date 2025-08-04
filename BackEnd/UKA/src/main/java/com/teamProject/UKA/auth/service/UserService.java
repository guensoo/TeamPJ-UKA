package com.teamProject.UKA.auth.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.auth.dto.MyCommentResponseDTO;
import com.teamProject.UKA.auth.dto.MyLikeResponseDTO;
import com.teamProject.UKA.auth.dto.UserNicknameUpdateResponse;
import com.teamProject.UKA.auth.model.User;
import com.teamProject.UKA.auth.repository.LikeRepository;
import com.teamProject.UKA.auth.repository.UserRepository;
import com.teamProject.UKA.board.dto.BoardResponseDTO;
import com.teamProject.UKA.board.dto.CommentResponseDTO;
import com.teamProject.UKA.board.model.Comment;
import com.teamProject.UKA.board.repository.BoardRepository;
import com.teamProject.UKA.board.repository.CommentRepository;
import com.teamProject.UKA.customer.qna.dto.QnaCommentResponseDTO;
import com.teamProject.UKA.customer.qna.entity.QnaCommentEntity;
import com.teamProject.UKA.customer.qna.repository.QnaCommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;
    private final CommentRepository boardCommentRepository;
    private final QnaCommentRepository qnaCommentRepository;
    private final LikeRepository likeRepository;

    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
    
    public UserNicknameUpdateResponse updateNickname(String userId, String newNickname) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. id=" + userId));
        user.setNickname(newNickname);
        return new UserNicknameUpdateResponse(user.getUserId(), user.getNickname());
    }
    
    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("새 비밀번호가 기존과 동일합니다.");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }
    
    public void withdrawUser(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 닉네임 중복 방지: "탈퇴한 회원_" + userId 일부 + 타임스탬프
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMddHHmmss"));
        String newNickname = "탈퇴한 회원_" + userId.substring(Math.max(0, userId.length() - 4)) + "_" + timestamp;

        user.setNickname(newNickname);           // 닉네임 변경
        user.setActive(false);                   // 비활성화
        user.setDeletedAt(LocalDateTime.now());  // 탈퇴 시각
        user.setPasswordHash("");                // 비밀번호 초기화(선택)
        user.setEmail("");                       // 이메일 초기화(선택)
        // 필요시 추가 필드도 초기화
    }
    
    public List<BoardResponseDTO> getMyPosts(String userId) {
        List<Object[]> rows = boardRepository.findAllMyPosts(userId);
        return rows.stream().map(BoardResponseDTO::fromRow).collect(Collectors.toList());
    }
    
    public List<MyCommentResponseDTO> getMyComments(String userId) {
        // 1. 게시판 댓글 조회
        List<Comment> boardComments = boardCommentRepository.findAllByUserId(userId);
        List<MyCommentResponseDTO> boardDtos = boardComments.stream()
            .map(comment -> {
                String postTitle = comment.getBoard() != null ? comment.getBoard().getTitle() : null;
                return MyCommentResponseDTO.fromBoard(new CommentResponseDTO(comment), postTitle);
            })
            .collect(Collectors.toList());

        // 2. Q&A 댓글 조회
        List<QnaCommentEntity> qnaComments = qnaCommentRepository.findAllByUserId(userId);
        List<MyCommentResponseDTO> qnaDtos = qnaComments.stream()
            .map(comment -> {
                String postTitle = comment.getQna() != null ? comment.getQna().getQnaTitle() : null;
                return MyCommentResponseDTO.fromQna(QnaCommentResponseDTO.fromEntity(comment), postTitle);
            })
            .collect(Collectors.toList());

        // 3. 합치기 + 최신순 정렬(옵션)
        List<MyCommentResponseDTO> all = new ArrayList<>();
        all.addAll(boardDtos);
        all.addAll(qnaDtos);
        all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return all;
    }
    
    public List<MyLikeResponseDTO> getMyLikes(String userId) {
        // 게시판 좋아요 테이블에서 내가 누른 게시글 목록 가져오기
        List<Object[]> rows = likeRepository.findAllMyLikes(userId);

        // rows → DTO 변환 (fromRow 메소드 활용)
        return rows.stream()
            .map(MyLikeResponseDTO::fromRow)
            .collect(Collectors.toList());
    }
}
