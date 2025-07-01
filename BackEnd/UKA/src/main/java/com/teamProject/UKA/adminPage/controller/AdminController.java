package com.teamProject.UKA.adminPage.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamProject.UKA.adminPage.dto.ReportListDTO;
import com.teamProject.UKA.adminPage.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	@GetMapping("/report")
	public ResponseEntity<List<ReportListDTO>> adminReportList() {
	    List<ReportListDTO> reportList = adminService.getAllReportList();
	    return ResponseEntity.ok(reportList);
	}
	
}
