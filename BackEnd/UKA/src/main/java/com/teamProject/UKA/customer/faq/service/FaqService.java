package com.teamProject.UKA.customer.faq.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamProject.UKA.customer.faq.dto.FaqRequestDTO;
import com.teamProject.UKA.customer.faq.dto.FaqResponseDTO;
import com.teamProject.UKA.customer.faq.entity.FaqEntity;
import com.teamProject.UKA.customer.faq.repository.FaqRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;

    // 입력
    @Transactional
    public FaqResponseDTO createFaq(FaqRequestDTO dto) {
        FaqEntity faq = FaqEntity.builder()
        		.faqId(generateFaqId())
                .faqOrderNum(dto.getFaqOrderNum())
                .faqQuestion(dto.getFaqQuestion())
                .faqAnswer(dto.getFaqAnswer())
                .faqCategory(dto.getFaqCategory())
                .build();
        FaqEntity saved = faqRepository.save(faq);
        return FaqResponseDTO.fromEntity(saved);
    }
    
    // 조회
    @Transactional(readOnly = true)
    public List<FaqResponseDTO> getAllFaqs() {
        return faqRepository.findAll().stream()
                .map(FaqResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // faq Id 자동생성(001~)
    public Long generateFaqId() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd")); // "250626"
        String prefix = dateStr; // 오늘 날짜 접두어
        String likePattern = prefix + "%";

        Long lastId = faqRepository.findMaxIdByDate(likePattern);
        int nextSeq = 1;
        if (lastId != null) {
            // 마지막 id에서 뒷자리 3개만 일련번호로 분리
            String lastIdStr = lastId.toString();
            int lastSeq = 0;
            if (lastIdStr.length() >= 9) {
                lastSeq = Integer.parseInt(lastIdStr.substring(6));
            }
            nextSeq = lastSeq + 1;
        }
        // 날짜(6자리) + 3자리 일련번호
        String newIdStr = prefix + String.format("%03d", nextSeq);
        return Long.valueOf(newIdStr);
    }
    
    // 수정
    @Transactional
    public FaqResponseDTO updateFaq(Long id, FaqRequestDTO dto) {
        FaqEntity faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ Not Found"));
        faq.setFaqOrderNum(dto.getFaqOrderNum());
        faq.setFaqQuestion(dto.getFaqQuestion());
        faq.setFaqAnswer(dto.getFaqAnswer());
        faq.setFaqCategory(dto.getFaqCategory());
        return FaqResponseDTO.fromEntity(faq);
    }

    // 삭제
    @Transactional
    public void deleteFaq(Long id) {
        faqRepository.deleteById(id);
    }

}
