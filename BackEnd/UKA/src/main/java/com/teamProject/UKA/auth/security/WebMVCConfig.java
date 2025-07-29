package com.teamProject.UKA.auth.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMVCConfig  implements WebMvcConfigurer{
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
		.addResourceHandler("/request/img/**")
		.addResourceLocations("file:///C:/my-app/upload/");


	    registry.addResourceHandler("/uploads/**")
	            .addResourceLocations("file:///C:/my-app/customer/");
	    
	    registry
        .addResourceHandler("/images/**")
        .addResourceLocations("file:///C:/my-app/board/");
	}
	
	@Override
	public void addCorsMappings(CorsRegistry registry) { 
		registry.addMapping("/**")
			.allowedOrigins("http://localhost:3000","http://teamproject-uka.s3-website.ap-northeast-2.amazonaws.com")
			.allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
			.allowedHeaders("*")
			.allowCredentials(true);
	}
}
