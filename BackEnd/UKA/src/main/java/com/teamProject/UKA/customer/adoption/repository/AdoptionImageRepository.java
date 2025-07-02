package com.teamProject.UKA.customer.adoption.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamProject.UKA.customer.adoption.Enum.ImageType;
import com.teamProject.UKA.customer.adoption.entity.AdoptionImage;

public interface AdoptionImageRepository extends JpaRepository<AdoptionImage, Long> {
	List<AdoptionImage> findByTypeOrderBySeq(ImageType type);
    List<AdoptionImage> findAllByOrderByTypeAscSeqAsc();
}
