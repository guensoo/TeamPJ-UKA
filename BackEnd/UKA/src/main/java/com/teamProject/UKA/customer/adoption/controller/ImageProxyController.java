package com.teamProject.UKA.customer.adoption.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;

@RestController
public class ImageProxyController {

    @GetMapping("/api/proxy-image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam("url") String url) {
        try {
            URL imageUrl = new URL(url);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (InputStream is = imageUrl.openStream()) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    baos.write(buffer, 0, bytesRead);
                }
            }
            byte[] imageBytes = baos.toByteArray();

            // *** 확장자 보고 Content-Type 세팅 (간단버전) ***
            HttpHeaders headers = new HttpHeaders();
            if (url.toLowerCase().endsWith(".png")) {
                headers.setContentType(MediaType.IMAGE_PNG);
            } else if (url.toLowerCase().endsWith(".webp")) {
                headers.setContentType(MediaType.valueOf("image/webp"));
            } else {
                headers.setContentType(MediaType.IMAGE_JPEG); // 기본 jpg
            }

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}