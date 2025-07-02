package com.teamProject.UKA.customer.adoption.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.multipart.MultipartFile;

import com.teamProject.UKA.customer.adoption.Enum.ImageType;
import com.teamProject.UKA.customer.adoption.entity.AdoptionImage;
import com.teamProject.UKA.customer.adoption.service.AdoptionImageService;
import com.teamProject.UKA.customer.adoption.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/adoption")
@RequiredArgsConstructor
public class AdoptionImageController {
    private final AdoptionImageService service;
    private final FileStorageService fileStorageService;

    // 전체 목록 조회 (썸네일/팝업 모두 포함)
    @GetMapping
    public List<AdoptionImage> getAll() {
        return service.getAllImages();
    }

    // 타입별 목록 조회 (선택)
    @GetMapping("/{type}")
    public List<AdoptionImage> getByType(@PathVariable("type") ImageType type) {
        return service.getImagesByType(type);  // .name()은 필요에 따라
    }

    // 추가(등록)
    @PostMapping
    public AdoptionImage create(@RequestBody AdoptionImage image) {
        return service.saveImage(image);
    }

    // 수정(전체 필드)
    @PutMapping("/{id}")
    public ResponseEntity<AdoptionImage> update(@PathVariable("id") Long id, @RequestBody AdoptionImage image) {
        return service.getImage(id)
                .map(exist -> {
                    exist.setType(image.getType());
                    exist.setSeq(image.getSeq());
                    exist.setSrc(image.getSrc());
                    return ResponseEntity.ok(service.saveImage(exist));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file); // 파일 저장 후 URL 생성
        return ResponseEntity.ok(Collections.singletonMap("url", url));
    }
}
