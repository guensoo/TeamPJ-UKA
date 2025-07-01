package com.teamProject.UKA.apiData.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamProject.UKA.apiData.model.AnimalEntity;

public interface AnimalRepository extends JpaRepository<AnimalEntity, String> {
	
}
