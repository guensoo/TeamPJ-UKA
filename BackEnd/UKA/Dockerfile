# 1. 공식 JDK 17 이미지 사용
FROM eclipse-temurin:17-jdk

# 2. 작업 디렉토리 지정
WORKDIR /app

# 3. 모든 파일 복사 (UKA 폴더 기준)
COPY . .

# 4. gradlew 파일에 실행권한 부여
RUN chmod +x gradlew

# 5. Spring Boot 빌드
RUN ./gradlew build

# 6. jar 파일 실행
CMD ["java", "-jar", "build/libs/UKA-0.0.1-SNAPSHOT.jar"]
