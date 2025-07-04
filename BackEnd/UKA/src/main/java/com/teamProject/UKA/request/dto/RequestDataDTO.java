package com.teamProject.UKA.request.dto;

import com.teamProject.UKA.auth.model.User;
import com.teamProject.UKA.request.model.RequestDataEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestDataDTO {
	
	private int no;
	private boolean find;
	
	private String img;
	private String kind;
	private String selectedbreed;
	private boolean sex;
	private String age;
	private String name;
	
	private String time;
	private String local;
	private String phone;
	private String detail;
	
	private Long user_no;
	
	public RequestDataEntity toEntity() {
		return RequestDataEntity.builder()
				.no(no)
				.find(find)
				.user(User.builder().seq(user_no).build())
				
				.img(img)
				.kind(kind)
				.selectedbreed(selectedbreed)
				.sex(sex)
				.age(age)
				.name(name)
				
				.time(time)
				.local(local)
				.phone(phone)
				.detail(detail)
				.build();
	}

}
