package com.teamProject.UKA.apiData.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BodyDTO {
	private ItemsDTO items;
}
