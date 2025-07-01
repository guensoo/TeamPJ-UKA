--테이블 기존 데이터 삭제
--(data.sql사용시 실행 할때 마다 data.sql이 실행되기 때문.(중복 insert))
delete from request;
ALTER TABLE request AUTO_INCREMENT = 1;
delete from users;


--관리자 샘플 데이터
--아이디 admin01@example.com 비번 11111111 
--아이디 admin02@example.con 비번 22222222
INSERT INTO users (seq,user_id, nickname, email, password_hash, created_at) VALUES
(1,'admin01', '관리자1', 'admin01@example.com', '$2a$10$TWAYab1Ccl0HMH.Ymw1X3uoapLKKjkhsqJ3BVs7zXwVt2Ta2uff7K', '2025-06-27 10:00:00'),
(2,'admin02', '관리자2', 'admin02@example.com', '$2a$10$di6Zx4NcAeiOrbq2l01q4u9UKGPxQA01gR5SdhB91R6ciKaq0gDli	', '2025-06-27 10:05:00'),
(3,'one', 'oneKorea', 'one@naver.com', '$2a$10$TWAYab1Ccl0HMH.Ymw1X3uoapLKKjkhsqJ3BVs7zXwVt2Ta2uff7K', '2025-06-27 10:05:00'),
(4,'two', 'twoKorea', 'two@naver.com', '$2a$10$TWAYab1Ccl0HMH.Ymw1X3uoapLKKjkhsqJ3BVs7zXwVt2Ta2uff7K', '2025-06-27 10:05:00');

--찾아주세요 샘플데이터
INSERT INTO request (find, img, kind, sex, age, name, time, lost_location, contact_number, detail, user_seq) VALUES
(false, 'http://localhost:8888/request/img/dog1.jpg', '진돗개', true, '2살', '바둑이', '2025-06-01 14:00', '서울 강남구 논현동', '010-1111-2222', '하얀색 진돗개, 목줄 착용', 1),
(false, 'http://localhost:8888/request/img/cat1.jpg', '코리안숏헤어', false, '3개월', '나비', '2025-06-02 09:30', '서울 마포구 합정동', '010-3333-4444', '왼쪽 귀에 검은 점 있음', 2),
(false, 'http://localhost:8888/request/img/dog2.jpg', '포메라니안', true, '1살', '쫑이', '2025-06-03 17:00', '서울 송파구 잠실동', '010-5555-6666', '크림색 털, 활동적임', 1),
(false, 'http://localhost:8888/request/img/dog3.jpg', '시베리안 허스키', true, '5살', '로키', '2025-06-04 12:15', '경기 성남시 분당구', '010-7777-8888', '양쪽 눈 색깔 다름', 1),
(false, 'http://localhost:8888/request/img/cat2.jpg', '페르시안', false, '4살', '루비', '2025-06-05 20:00', '서울 은평구 응암동', '010-9999-0000', '털이 풍성하고 조용함', 2),
(false, 'http://localhost:8888/request/img/dog4.jpg', '치와와', true, '6개월', '보리', '2025-06-06 08:20', '서울 강서구 화곡동', '010-1212-3434', '갈색 짧은 털, 잘 짖음', 1),
(false, 'http://localhost:8888/request/img/cat3.jpg', '터키시 앙고라', false, '1살', '하양이', '2025-06-07 10:45', '서울 노원구 중계동', '010-5656-7878', '완전 흰색 털', 2),
(false, 'http://localhost:8888/request/img/dog5.jpg', '닥스훈트', true, '3살', '길동이', '2025-06-08 15:30', '서울 성북구 성신여대입구', '010-3434-5656', '등에 점 있음', 1),
(false, 'http://localhost:8888/request/img/dog6.jpg', '래브라도 리트리버', true, '7살', '순돌이', '2025-06-09 11:10', '서울 용산구 이태원동', '010-9898-6767', '온순하고 크기가 큼', 1),
(false, 'http://localhost:8888/request/img/cat4.jpg', '러시안블루', false, '2살', '미소', '2025-06-10 13:40', '서울 구로구 구로동', '010-4747-8585', '회색 털, 조용함', 2),
(false, 'http://localhost:8888/request/img/dog7.jpg', '웰시코기', true, '1살', '콩이', '2025-06-11 16:00', '서울 동작구 상도동', '010-3535-2525', '다리가 짧고 활동적', 2),
(false, 'http://localhost:8888/request/img/cat5.jpg', '스코티시 폴드', false, '8개월', '단지', '2025-06-12 19:30', '서울 금천구 가산동', '010-2323-1414', '귀가 접혀 있음', 1),
(false, 'http://localhost:8888/request/img/dog8.jpg', '푸들', true, '2살', '탄이', '2025-06-13 07:20', '경기 고양시 덕양구', '010-1212-3434', '갈색 털, 깡총깡총 뜀', 2),
(false, 'http://localhost:8888/request/img/cat6.jpg', '샴', false, '6개월', '라라', '2025-06-14 10:10', '서울 관악구 봉천동', '010-7878-5656', '눈이 파란색, 얌전함', 1),
(false, 'http://localhost:8888/request/img/dog9.jpg', '말티즈', true, '1살', '몽이', '2025-06-15 14:45', '서울 서초구 방배동', '010-6767-4545', '하얀 털, 짖지 않음', 2),
(false, 'http://localhost:8888/request/img/cat7.jpg', '먼치킨', false, '3개월', '젤리', '2025-06-16 09:00', '서울 중랑구 면목동', '010-5656-2323', '다리가 짧고 애교 많음', 2),
(false, 'http://localhost:8888/request/img/dog10.jpg', '보더콜리', true, '4살', '초코', '2025-06-17 18:20', '서울 강동구 천호동', '010-2323-6565', '검정과 흰색 털', 1),
(false, 'http://localhost:8888/request/img/cat8.jpg', '아메리칸 숏헤어', false, '5살', '두리', '2025-06-18 20:40', '서울 양천구 목동', '010-3434-5656', '줄무늬 있음', 2),
(false, 'http://localhost:8888/request/img/dog1.jpg', '불독', true, '6살', '복실이', '2025-06-19 10:05', '서울 중구 명동', '010-1212-7878', '주름 많고 무거움', 1),
(false, 'http://localhost:8888/request/img/cat9.jpg', '렉돌', false, '2살', '솜이', '2025-06-20 11:15', '서울 서대문구 연희동', '010-9999-1111', '눈이 크고 온순함', 2);
