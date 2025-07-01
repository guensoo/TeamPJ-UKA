package com.teamProject.UKA.apiData.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnimalDTO {
    private String desertionNo;
    private String happenDt;
    private String happenPlace;
    private String kindFullNm;
    private String upKindCd;
    private String upKindNm;
    private String kindCd;
    private String kindNm;
    private String colorCd;
    private String age;
    private String weight;
    private String noticeNo;
    private String noticeSdt;
    private String noticeEdt;
    private String popfile1;
    private String popfile2;
    private String processState;
    private String sexCd;
    private String neuterYn;
    private String specialMark;
    private String careRegNo;
    private String careNm;
    private String careTel;
    private String careAddr;
    private String careOwnerNm;
    private String orgNm;
    private String vaccinationChk;
    private String etcBigo;
    private String rfidCd;
    private String updTm;
    
    private String endReason;
}
