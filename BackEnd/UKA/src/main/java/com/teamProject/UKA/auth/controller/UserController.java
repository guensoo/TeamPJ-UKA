package com.teamProject.UKA.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.auth.dto.MyCommentResponseDTO;
import com.teamProject.UKA.auth.dto.MyLikeResponseDTO;
import com.teamProject.UKA.auth.dto.PasswordChangeRequest;
import com.teamProject.UKA.auth.dto.UserNicknameUpdateRequest;
import com.teamProject.UKA.auth.dto.UserNicknameUpdateResponse;
import com.teamProject.UKA.auth.service.UserService;
import com.teamProject.UKA.board.dto.BoardResponseDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam("userId") String userId) {
        boolean exists = userService.existsByUserId(userId);
        return ResponseEntity.ok(exists);
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam("nickname") String nickname) {
        boolean exists = userService.existsByNickname(nickname);
        return ResponseEntity.ok(exists);
    }
    
    // 마이페이지 - 닉네임 변경
    @PutMapping("/{userId}/nickname")
    public UserNicknameUpdateResponse updateNickname(@PathVariable("userId") String userId, 
    												 @RequestBody UserNicknameUpdateRequest request) {
        return userService.updateNickname(userId, request.getNickname());
    }
    
    // 마이페이지 - 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) authentication.getPrincipal(); // principal을 userId로 설정한 경우

        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
    
    // 마이페이지 - 계정 삭제
    @DeleteMapping("/me")
    public ResponseEntity<?> withdrawUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) authentication.getPrincipal(); // principal이 userId 문자열이라 가정

        userService.withdrawUser(userId);
        return ResponseEntity.ok().build();
    }
    
    // 마이페이지 - 내 작성글
    @GetMapping("/myPost")
    public List<BoardResponseDTO> getMyPosts(@RequestParam("userId") String userId) {
    	System.out.println("myPost userId ::" + userId);
        return userService.getMyPosts(userId);
    }
    
    // 마이페이지 - 내 댓글
    @GetMapping("/myComment")
    public List<MyCommentResponseDTO> getMyComments(@RequestParam("userId") String userId) {
    	System.out.println("myComment` userId ::" + userId);
        return userService.getMyComments(userId);
    }
    
    // 마이페이지 - 내 좋아요
    @GetMapping("/myLikes")
    public List<MyLikeResponseDTO> getMyLikes(@RequestParam("userId") String userId) {
    	System.out.println("myLikes userId ::" + userId);
        return userService.getMyLikes(userId);
    }
}
