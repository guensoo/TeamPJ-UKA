package com.teamProject.UKA.adminPage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.teamProject.UKA.adminPage.model.ReportListEntity;

public interface AdminRepository extends CrudRepository<ReportListEntity, String> {
	@Query(
			value = "SELECT brd_id as id, brd_category AS category, brd_title AS title " +
					"FROM board_main WHERE brd_report >= 5 " +
					"UNION ALL " +
					"SELECT qna_no as id, 'qna' AS category, qna_title AS title " +
					"FROM qna WHERE qna_is_reported = 'Y' OR qna_report_count >= 5",
					nativeQuery = true)
	List<Object[]> findReportedPostsNative();
}
