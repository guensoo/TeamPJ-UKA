package com.teamProject.UKA.request.controller;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.teamProject.UKA.request.dto.RequestDataDTO;
import com.teamProject.UKA.request.service.RequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/request")
public class RequestController {
	
	@Autowired final private RequestService service;
	
	//C - 찾고 있어요 '단건' 작성.
	@PostMapping
	public ResponseEntity<?> write(@RequestBody RequestDataDTO dto){
		List<RequestDataDTO> result = service.write(dto);
		return ResponseEntity.ok().body(result);
	}
	
	//C-image 이미지 업로드용 
	@PostMapping("/image")
	public ResponseEntity<?> uploadFile(@RequestParam("file")MultipartFile file, @RequestParam("userId") String userId){
		String imageUrl = "";
		
		File directory = new File("C:/my-app/upload/");
		if (!directory.exists()) {
		    directory.mkdirs(); // 폴더 자동 생성
		}
		//파일 저장 위치 및 파일 이름
		//파일 저장 위치 : C:/my-app/upload/~
		//파일 이름 : userId + UUID + .jpg
		String uniqueFileName = UUID.randomUUID().toString() + ".jpg";
		
		String filePath = "C:/my-app/upload/" + userId +uniqueFileName;
		
		try {
			file.transferTo(new File(filePath));
			//요청하면 보여줄 url
			imageUrl = "http://localhost:8888/request/img/"+userId+uniqueFileName;
		} catch (Exception e) {
		    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "파일 업로드 실패"));
		}
		return ResponseEntity.ok(Map.of("imageUrl",imageUrl));
	}
	
		
	@GetMapping
	//R - 전체 조회.
	public ResponseEntity<?> findAll(){
		List<RequestDataDTO> result = service.findAll();
		return ResponseEntity.ok().body(result);
	}
	
	//U
	@PutMapping
	public ResponseEntity<?> update(@RequestBody RequestDataDTO dto){
		List<RequestDataDTO> result = service.update(dto);
		return ResponseEntity.ok().body(result);
	}
	
	//D
	@DeleteMapping("/{no}")
	public ResponseEntity<?> delete(@PathVariable(name = "no") int no){
		List<RequestDataDTO> result = service.delete(no);
		return ResponseEntity.ok().body(result);
	}
}
