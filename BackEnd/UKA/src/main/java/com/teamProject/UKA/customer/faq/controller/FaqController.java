package com.teamProject.UKA.customer.faq.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.customer.faq.dto.FaqRequestDTO;
import com.teamProject.UKA.customer.faq.dto.FaqResponseDTO;
import com.teamProject.UKA.customer.faq.service.FaqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer/faq")
@RequiredArgsConstructor
public class FaqController {
	private final FaqService faqService;
	
    @PostMapping
    public ResponseEntity<FaqResponseDTO> createFaq(@RequestBody FaqRequestDTO dto) {
        return ResponseEntity.ok(faqService.createFaq(dto));
    }
    
    @GetMapping
    public ResponseEntity<List<FaqResponseDTO>> getAllFaqs() {
        return ResponseEntity.ok(faqService.getAllFaqs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqResponseDTO> updateFaq(
            @PathVariable("id") Long id,
            @RequestBody FaqRequestDTO dto) {
        return ResponseEntity.ok(faqService.updateFaq(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaq(@PathVariable("id") Long id) {
        faqService.deleteFaq(id);
        return ResponseEntity.noContent().build();
    }
}
