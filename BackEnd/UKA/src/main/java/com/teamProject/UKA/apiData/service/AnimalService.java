package com.teamProject.UKA.apiData.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.apiData.dto.AnimalDTO;
import com.teamProject.UKA.apiData.model.AnimalEntity;
import com.teamProject.UKA.apiData.repository.AnimalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnimalService {
	
    private final AnimalRepository animalRepository;

    public List<AnimalDTO> getAllAnimals() {
        List<AnimalEntity> entities = animalRepository.findAll();
        // Entity → DTO 변환 함수 필요 (예시 아래)
        return entities.stream().map(AnimalEntity::toDTO).collect(Collectors.toList());
    }
    
    @Transactional
    public void saveAllAnimals(List<AnimalDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) return;
        List<AnimalEntity> entities = dtos.stream().map(AnimalEntity::fromDTO).collect(Collectors.toList());
        animalRepository.saveAll(entities);
    }
}
