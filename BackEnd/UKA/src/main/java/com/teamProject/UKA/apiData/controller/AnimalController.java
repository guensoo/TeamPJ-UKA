package com.teamProject.UKA.apiData.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.apiData.dto.AnimalDTO;
import com.teamProject.UKA.apiData.service.AnimalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor // Lombok으로 생성자 주입
//@CrossOrigin(origins = "http://localhost:3000")
public class AnimalController {
	
	private final AnimalService animalService;
	
	@GetMapping("/")
	public ResponseEntity<List<AnimalDTO>> getAllAnimals() {
	    // Entity → DTO 변환 필요 (아직 toDTO 없으면 아래 예시 추가)
	    List<AnimalDTO> animals = animalService.getAllAnimals();
	    return ResponseEntity.ok(animals);
	}
	
    @PostMapping("/import")
    public ResponseEntity<?> importAnimals(@RequestBody List<AnimalDTO> animals) {
    	System.out.println("받은 동물 데이터 수: " + animals.size());

        try {
            animalService.saveAllAnimals(animals);
            return ResponseEntity.ok(Collections.singletonMap("message", "Success"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
