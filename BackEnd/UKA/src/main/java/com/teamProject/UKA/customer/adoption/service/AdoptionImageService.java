package com.teamProject.UKA.customer.adoption.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.teamProject.UKA.customer.adoption.Enum.ImageType;
import com.teamProject.UKA.customer.adoption.entity.AdoptionImage;
import com.teamProject.UKA.customer.adoption.repository.AdoptionImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdoptionImageService {
    private final AdoptionImageRepository repository;

    // 전체 조회
    public List<AdoptionImage> getAllImages() {
        return repository.findAllByOrderByTypeAscSeqAsc();
    }

    // 타입별 조회
    public List<AdoptionImage> getImagesByType(ImageType type) {
        return repository.findByTypeOrderBySeq(type);
    }

    // 단건 조회
    public Optional<AdoptionImage> getImage(Long id) {
        return repository.findById(id);
    }

    // 추가/수정(업서트)
    public AdoptionImage saveImage(AdoptionImage image) {
        return repository.save(image);
    }

    // 삭제
    public void deleteImage(Long id) {
        repository.deleteById(id);
    }

    // 여러개 저장 (seq 일괄 갱신 등)
    public List<AdoptionImage> saveAll(List<AdoptionImage> images) {
        return repository.saveAll(images);
    }
    
    
}