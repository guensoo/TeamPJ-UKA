package com.teamProject.UKA.apiData.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnimalDTO {

    @JsonProperty("desertion_no")
    private String desertionNo;

    @JsonProperty("happen_dt")
    private String happenDt;

    @JsonProperty("happen_place")
    private String happenPlace;

    @JsonProperty("kind_full_nm")
    private String kindFullNm;

    @JsonProperty("up_kind_cd")
    private String upKindCd;

    @JsonProperty("up_kind_nm")
    private String upKindNm;

    @JsonProperty("kind_cd")
    private String kindCd;

    @JsonProperty("kind_nm")
    private String kindNm;

    @JsonProperty("color_cd")
    private String colorCd;

    @JsonProperty("age")
    private String age;

    @JsonProperty("weight")
    private String weight;

    @JsonProperty("notice_no")
    private String noticeNo;

    @JsonProperty("notice_sdt")
    private String noticeSdt;

    @JsonProperty("notice_edt")
    private String noticeEdt;

    @JsonProperty("popfile1")
    private String popfile1;

    @JsonProperty("popfile2")
    private String popfile2;

    @JsonProperty("process_state")
    private String processState;

    @JsonProperty("sex_cd")
    private String sexCd;

    @JsonProperty("neuter_yn")
    private String neuterYn;

    @JsonProperty("special_mark")
    private String specialMark;

    @JsonProperty("care_reg_no")
    private String careRegNo;

    @JsonProperty("care_nm")
    private String careNm;

    @JsonProperty("care_tel")
    private String careTel;

    @JsonProperty("care_addr")
    private String careAddr;

    @JsonProperty("care_owner_nm")
    private String careOwnerNm;

    @JsonProperty("org_nm")
    private String orgNm;

    @JsonProperty("vaccination_chk")
    private String vaccinationChk;

    @JsonProperty("etc_bigo")
    private String etcBigo;

    @JsonProperty("rfid_cd")
    private String rfidCd;

    @JsonProperty("upd_tm")
    private String updTm;

    @JsonProperty("end_reason")
    private String endReason;
}
