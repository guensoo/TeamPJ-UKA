package com.teamProject.UKA.request.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;

import com.teamProject.UKA.auth.model.User;
import com.teamProject.UKA.auth.repository.UserRepository;
import com.teamProject.UKA.request.dto.RequestDataDTO;
import com.teamProject.UKA.request.model.RequestDataEntity;
import com.teamProject.UKA.request.repository.RequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RequestService {
	@Autowired final private RequestRepository repository;
	@Autowired final private UserRepository userrepository;
	//C
	public List<RequestDataDTO> write(RequestDataDTO dto){
		//데이터 검증
		valiDated(dto);
		
		 // 유저 ID로 실제 User 엔티티를 조회
	    User user = userrepository.findById(dto.getUser_no())
	            .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

	    // DTO → Entity
	    RequestDataEntity entity = dto.toEntity();

	    // 연관관계 주입 (실제 영속 상태의 유저)
	    entity.setUser(user);

	    // 저장
		
		repository.save(dto.toEntity());
		return findAll();
	}
	
	//C-image 이미지 업로드용 
	
	
	
	//R
	public List<RequestDataDTO> findAll(){		
		return repository.findAll().stream().map(entity->entity.toDTO()).collect(Collectors.toList());		  
	}
	
	//U
	public List<RequestDataDTO> update(RequestDataDTO dto){
		//데이터 검증
		valiDated(dto);
		
		//받아온 데이터로 검색 후 데이터 수정
		repository.findById(dto.getNo()).ifPresent(entity ->{
			entity.setImg(dto.getImg());
			entity.setAge(dto.getAge());
			entity.setDetail(dto.getDetail());
			entity.setContactNumber(dto.getContactNumber());
			entity.setSex(dto.isSex());
			entity.setKind(dto.getKind());
			entity.setTime(dto.getTime());
			entity.setLostLocation(dto.getLostLocation());
			entity.setName(dto.getName());
			//내부 데이터이므로 사용안함			
			//entity.setFind(dto.isFind());
			//entity.setNo(dto.getNo());
			
			//데이터 저장
			repository.save(entity)	;
		});;
		return findAll();
	}
	
	//D
	public List<RequestDataDTO> delete(int no){
		repository.deleteById(no);
		return findAll();
	}
	
	
	
	
	//데이터 검증.
	public void valiDated(RequestDataDTO dto) {
		
	}

}
