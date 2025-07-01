package com.teamProject.UKA.request.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamProject.UKA.request.model.RequestDataEntity;

public interface RequestRepository extends JpaRepository<RequestDataEntity, Integer>{

}
