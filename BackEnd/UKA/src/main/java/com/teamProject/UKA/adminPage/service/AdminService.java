package com.teamProject.UKA.adminPage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.teamProject.UKA.adminPage.dto.ReportListDTO;
import com.teamProject.UKA.adminPage.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
	
	private final AdminRepository adminRepository;

    public List<ReportListDTO> getAllReportList() {
        List<Object[]> datas = adminRepository.findReportedPostsNative();
        return datas.stream()
            .map(r -> new ReportListDTO(
                String.valueOf(r[0]),
                String.valueOf(r[1]),
                String.valueOf(r[2])
            	))
        .collect(Collectors.toList());
    }

}
