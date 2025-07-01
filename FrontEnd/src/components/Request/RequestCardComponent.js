import React, { useState } from 'react';

// Material-UI가 사용 불가능하므로 기본 React로 구현합니다
// 원본 이미지의 레이아웃을 최대한 유지하면서 깔끔한 디자인을 구현해보겠습니다

export default function RequestCardComponent() {
  // 입력 필드들의 상태를 관리하는 useState 훅
  // 실제 애플리케이션에서는 이 데이터가 상위 컴포넌트나 전역 상태에서 관리될 수 있습니다
  const [profileData, setProfileData] = useState({
    lostLocation: '',      // 실종 장소
    lostTime: '',          // 실종 시간  
    contactNumber: '',     // 연락수단
    characteristics: ''    // 특징
  });

  // 입력 필드 값 변경 핸들러
  // 이벤트 객체에서 name과 value를 구조분해할당으로 추출하여 해당 필드만 업데이트합니다
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div style={styles.container}>
      {/* 메인 카드 컴포넌트 */}
      {/* 원본 이미지와 동일한 비율과 레이아웃을 유지합니다 */}
      <div style={styles.card}>
        
        {/* 카드 내부 콘텐츠 영역 */}
        <div style={styles.cardContent}>
          
          {/* 좌측 프로필 이미지 섹션 */}
          {/* 원본의 보라색 배경과 프로필 아이콘을 재현합니다 */}
          <div style={styles.leftSection}>
            
            {/* 프로필 아바타 영역 */}
            <div style={styles.avatarContainer}>
              {/* 사람 모양의 SVG 아이콘 */}
              {/* 원본 이미지의 검은색 실루엣 형태를 재현했습니다 */}
              <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V10.5L21 9ZM11 10.5V15.5L17 17V12L11 10.5ZM15 20H5V18C5 15.8 8.5 14 12 14C12.5 14 13 14.1 13.4 14.1L15 20Z"/>
              </svg>
            </div>
            
            {/* 하단의 원형 요소 (원본 이미지의 회색 원을 재현) */}
            <div style={styles.bottomCircle}></div>
          </div>

          {/* 우측 정보 입력 섹션 */}
          <div style={styles.rightSection}>
            
            {/* 각 입력 필드를 개별 그룹으로 구성 */}
            {/* 라벨과 입력 필드가 한 줄에 배치되도록 flexbox를 사용합니다 */}
            
            <div style={styles.inputRow}>
              <label style={styles.label}>실종 장소:</label>
              <input
                type="text"
                name="lostLocation"
                value={profileData.lostLocation}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="실종된 장소를 입력하세요"
              />
            </div>

            <div style={styles.inputRow}>
              <label style={styles.label}>실종 시간:</label>
              <input
                type="datetime-local"
                name="lostTime"
                value={profileData.lostTime}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputRow}>
              <label style={styles.label}>연락수단:</label>
              <input
                type="tel"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="연락 가능한 전화번호"
              />
            </div>

            <div style={styles.inputRow}>
              <label style={styles.label}>특징:</label>
              <textarea
                name="characteristics"
                value={profileData.characteristics}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="외모나 특이사항을 입력하세요"
                rows={3}
              />
            </div>
            
          </div>
        </div>

        {/* 하단의 빨간색 바 */}
        {/* 원본 이미지의 "///" 텍스트가 있는 빨간색 영역을 재현합니다 */}
        <div style={styles.bottomBar}>
          <span style={styles.bottomBarText}>///</span>
        </div>
      </div>
    </div>
  );
}

// 스타일 객체 정의
const styles = {
  // 전체 컨테이너: 카드를 중앙에 배치하고 적절한 여백을 제공합니다
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },

  // 메인 카드: 원본과 유사한 비율과 그림자 효과를 적용합니다
  card: {
    width: '600px',
    maxWidth: '90vw',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #e0e0e0'
  },

  // 카드 내부 콘텐츠: flexbox로 좌우 분할 레이아웃을 구현합니다
  cardContent: {
    display: 'flex',
    minHeight: '300px'
  },

  // 좌측 프로필 섹션: 원본의 연보라색 배경을 재현합니다
  leftSection: {
    flex: '0 0 200px',  // 고정 너비 200px
    backgroundColor: '#d8c7d8',  // 원본과 유사한 연보라색
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
    position: 'relative'
  },

  // 프로필 아바타 컨테이너
  avatarContainer: {
    width: '80px',
    height: '80px',
    backgroundColor: '#8b7a8b',  // 원본의 어두운 회색
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },

  // 아바타 아이콘 스타일
  avatarIcon: {
    width: '45px',
    height: '45px',
    color: '#d8c7d8'  // 배경색과 대비되는 색상
  },

  // 하단 원형 요소: 원본 이미지의 회색 원을 재현합니다
  bottomCircle: {
    width: '100px',
    height: '100px',
    backgroundColor: '#8b7a8b',
    borderRadius: '50%',
    marginTop: '10px'
  },

  // 우측 정보 입력 섹션
  rightSection: {
    flex: 1,
    padding: '30px 25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px'
  },

  // 각 입력 행의 스타일: 라벨과 입력 필드를 한 줄에 배치합니다
  inputRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    minHeight: '40px'
  },

  // 라벨 스타일: 일정한 너비를 유지하여 정렬을 맞춥니다
  label: {
    minWidth: '80px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
    paddingTop: '10px',  // 입력 필드의 패딩과 맞춤
    flexShrink: 0  // 라벨이 줄어들지 않도록 설정
  },

  // 입력 필드 공통 스타일
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'white'
  },

  // 텍스트 영역 스타일 (특징 입력용)
  textarea: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'white',
    resize: 'vertical',
    fontFamily: 'inherit'
  },

  // 하단 빨간색 바: 원본의 브랜딩 요소를 재현합니다
  bottomBar: {
    height: '40px',
    backgroundColor: '#ff0000',  // 원본과 동일한 빨간색
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // 하단 바의 텍스트 스타일
  bottomBarText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  }
};