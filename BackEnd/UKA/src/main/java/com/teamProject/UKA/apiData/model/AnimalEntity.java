package com.teamProject.UKA.apiData.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teamProject.UKA.apiData.dto.AnimalDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor // 추가!
@AllArgsConstructor // 있으면 더 좋음(Builder 사용할 때 유용)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnimalEntity {
    @Id
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
    
    // DTO → Entity 변환용 정적 메소드
    public static AnimalEntity fromDTO(AnimalDTO dto) {
        return AnimalEntity.builder()
            .desertionNo(dto.getDesertionNo())
            .happenDt(dto.getHappenDt())
            .happenPlace(dto.getHappenPlace())
            .kindFullNm(dto.getKindFullNm())
            .upKindCd(dto.getUpKindCd())
            .upKindNm(dto.getUpKindNm())
            .kindCd(dto.getKindCd())
            .kindNm(dto.getKindNm())
            .colorCd(dto.getColorCd())
            .age(dto.getAge())
            .weight(dto.getWeight())
            .noticeNo(dto.getNoticeNo())
            .noticeSdt(dto.getNoticeSdt())
            .noticeEdt(dto.getNoticeEdt())
            .popfile1(dto.getPopfile1())
            .popfile2(dto.getPopfile2())
            .processState(dto.getProcessState())
            .sexCd(dto.getSexCd())
            .neuterYn(dto.getNeuterYn())
            .specialMark(dto.getSpecialMark())
            .careRegNo(dto.getCareRegNo())
            .careNm(dto.getCareNm())
            .careTel(dto.getCareTel())
            .careAddr(dto.getCareAddr())
            .careOwnerNm(dto.getCareOwnerNm())
            .orgNm(dto.getOrgNm())
            .vaccinationChk(dto.getVaccinationChk())
            .etcBigo(dto.getEtcBigo())
            .rfidCd(dto.getRfidCd())
            .updTm(dto.getUpdTm())
            .build();
    }
    
    public AnimalDTO toDTO() {
        AnimalDTO dto = new AnimalDTO();
        dto.setDesertionNo(this.desertionNo);
        dto.setHappenDt(this.happenDt);
        dto.setHappenPlace(this.happenPlace);
        dto.setKindFullNm(this.kindFullNm);
        dto.setUpKindCd(this.upKindCd);
        dto.setUpKindNm(this.upKindNm);
        dto.setKindCd(this.kindCd);
        dto.setKindNm(this.kindNm);
        dto.setColorCd(this.colorCd);
        dto.setAge(this.age);
        dto.setWeight(this.weight);
        dto.setNoticeNo(this.noticeNo);
        dto.setNoticeSdt(this.noticeSdt);
        dto.setNoticeEdt(this.noticeEdt);
        dto.setPopfile1(this.popfile1);
        dto.setPopfile2(this.popfile2);
        dto.setProcessState(this.processState);
        dto.setSexCd(this.sexCd);
        dto.setNeuterYn(this.neuterYn);
        dto.setSpecialMark(this.specialMark);
        dto.setCareRegNo(this.careRegNo);
        dto.setCareNm(this.careNm);
        dto.setCareTel(this.careTel);
        dto.setCareAddr(this.careAddr);
        dto.setCareOwnerNm(this.careOwnerNm);
        dto.setOrgNm(this.orgNm);
        dto.setVaccinationChk(this.vaccinationChk);
        dto.setEtcBigo(this.etcBigo);
        dto.setRfidCd(this.rfidCd);
        dto.setUpdTm(this.updTm);
        return dto;
    }
}
