import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './DetailSelect.css'
import { useEffect } from 'react';

// {
//           "desertionNo" : "448567202500980",
//           "happenDt" : "20250613",
//           "happenPlace" : "진해구 명동방파제",
//           "kindFullNm" : "[개] 믹스견",
//           "upKindCd" : "417000",
//           "upKindNm" : "개",
//           "kindCd" : "000114",
//           "kindNm" : "믹스견",
//           "colorCd" : "흰색",
//           "age" : "2023(년생)",
//           "weight" : "15(Kg)",
//           "noticeNo" : "경남-창원1-2025-00377",
//           "noticeSdt" : "20250613",
//           "noticeEdt" : "20250623",
//           "popfile1" : "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2025/06/202506130706422.jpg",
//           "popfile2" : "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2025/06/202506130706903.jpg",
//           "processState" : "보호중",
//           "sexCd" : "M",
//           "neuterYn" : "N",
//           "specialMark" : "진트리버처럼 생긴 순딩순딩 똥꼬발랄한 아이~키트검사 지알디아양성. 원충약투여.",
//           "careRegNo" : "348527200900001",
//           "careNm" : "창원동물보호센터",
//           "careTel" : "055-225-5701",
//           "careAddr" : "경상남도 창원시 성산구 공단로474번길 117 (상복동) 창원동물보호센터",
//           "careOwnerNm" : "창원시장",
//           "orgNm" : "경상남도 창원시 의창성산구",
//           "updTm" : "2025-06-13 07:40:54.0"
//         }


export const DetailSelect = () => {
  const data = useLocation().state;
  console.log(data)

  // Params를 사용해서 선택한 정보 전달
  const {id} = useParams();

  const navigate = useNavigate();

  // 백엔드에서 id(혹은 더 자세한 정보)로 조회해서 단건 정보 받아올 예정.
  useEffect(()=>{
      // fetch

  },[])

// ========================================================
  //날짜 데이터 포멧팅
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  // 성별 표시
  const getGenderText = (sexCd) => {
    return sexCd === 'M' ? '수컷' : sexCd === 'F' ? '암컷' : '미상';
  };

  // 중성화 여부
  const getNeuterText = (neuterYn) => {
    return neuterYn === 'Y' ? '완료' : neuterYn === 'N' ? '미완료' : '미상';
  };
    
  const address = data.careAddr?.split(" ") || [];


  return(
    <div className='DScardStyle'>
    {/* 헤더 */}
    <div className='DSheaderStyle'>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          동물 프로필
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>유기동물 보호 정보</p>
      </div>
      <div className='DSheaderInfoStyle'>
        <p style={{ margin: '0 0 4px 0', fontSize: '14px', opacity: 0.9,marginTop:'8px', alignSelf:'center'  }}>보호번호</p>
        <div style={{borderTop:'1px solid #9b7fc5'}}>
        <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 'bold', margin:'0 12px',marginBottom:'8px',}}>
          {data.desertionNo}
        </p>
        </div>
      </div>
    </div>

    <div className='DScontentStyle'>
      {/* 사진 섹션 */}
      <div>
        <div className='DSsectionTitleStyle'>
          <span style={{ color: '#e74c3c' }}>❤️</span>
          사진
        </div>
        {data.popfile1 && (
          <div style={{textAlign:'center'}}>
          <img
            src={data.popfile1} 
            alt="동물 사진"
            className='DSimageStyle'
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+7IKs7KeEIOuhnOuUqSDsi6TtjqA8L3RleHQ+Cjwvc3ZnPg=='
            }}
          /></div>
        )}
        
      </div>

      {/* 기본 정보와 보호 정보 */}
      <div className='DSinfoGridStyle'>
        <div>
          <div className='DSsectionTitleStyle'>
            <span style={{ color: '#28a745' }}>🛡️</span>
            기본 정보
          </div>
          <div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>품종</span>
              <span>{data.kindFullNm}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>색상</span>
              <span>{data.colorCd}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>나이</span>
              <span>{data.age}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>체중</span>
              <span>{data.weight}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>성별</span>
              <span>{getGenderText(data.sexCd)}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>중성화</span>
              <span style={{ 
                fontWeight: '600', 
                color: data.neuterYn === 'Y' ? '#28a745' : '#fd7e14' 
              }}>
                {getNeuterText(data.neuterYn)}
              </span>
            </div>
            <div className='DSinfoItemStyle' style={{borderBottom: 'none' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>보호상태</span>
              <span style={{ fontWeight: '600', color: '#007bff' }}>{data.processState}</span>
            </div>
          </div>
        </div>

        <div>
          <div className='DSsectionTitleStyle'>
            <span style={{ color: '#007bff' }}>📅</span>
            보호 정보
          </div>
          <div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>발견일</span>
              <span>{formatDate(data.happenDt)}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>발견장소</span>
              <span>{data.happenPlace}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>공고시작</span>
              <span style={{ fontWeight: '600' }}>{formatDate(data.noticeSdt)}</span>
            </div>
            <div className='DSinfoItemStyle'>
              <span style={{ color: '#666', fontWeight: '500' }}>공고종료</span>
              <span style={{ fontWeight: '600', color: '#dc3545' }}>{formatDate(data.noticeEdt)}</span>
            </div>
            <div className='DSinfoItemStyle' style={{borderBottom: 'none' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>공고번호</span>
              <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{data.noticeNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 특이사항 */}
      {data.specialMark && (
        <div>
          <div className='DSsectionTitleStyle'>
            <span style={{ color: '#ffc107' }}>⚠️</span>
            특이사항
          </div>
          <div className='DSspecialMarkStyle'>
            <p style={{ margin: 0, color: '#856404', lineHeight: '1.6' }}>
              {data.specialMark}
            </p>
          </div>
        </div>
      )}

      {/* 보호센터 정보 */}
      <div>
        <div className='DSsectionTitleStyle'>
          <span style={{ color: '#6f42c1' }}>📍</span>
          보호센터 정보
        </div>
        <div className='DScenterInfoStyle'>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '50px' 
          }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                {data.careNm}
              </h3>
              <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                {address[0]||""} {address[1]||""} {address[2]||""}<br/>
                {address[3]||""} {address[4]||""} {address[5]||""}{address[6]||""}
                </p>
                

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#666' }}>📞</span>
                <span style={{ fontWeight: '500' }}>{data.careTel}</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                관리기관: {data.orgNm}
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                최종수정: {data.updTm}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 입양 문의 버튼 */}
      <div style={{ marginTop: '32px',display:'flex', justifyContent:'space-around' }}>
        <button 
          className='DSbuttonStyle'
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 82, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 82, 0.4)';
          }}
        >
          ⬅️ 이전 동물
        </button>

        <button 
          className='DSbuttonStyle'
          onClick={()=>{navigate('/customer/adoption')}}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 82, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 82, 0.4)';
          }}
        >
          💕 입양 문의하기
        </button>

        <button 
          className='DSbuttonStyle'
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 82, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 82, 0.4)';
          }}
        >
          다음 동물 ➡️
        </button>
      </div>
    </div>
  </div>
  )
}


    // <div className="DScontainer">

    //         <div className='DStop'>
    //             {/* 이미지 */} 
    //             <img src={data.popfile1} />
            
            
    //         </div>{/* end top */}   

    //         <div className='DSbottom'>
    //             {/* 가져온 정보로 상세 정보 표시 */}
    //             <h2>센터 정보</h2>
    //             <div className='DSinfo-box'>
    //                 <div className='DSinfo'>
    //                     <h3><Chip label="유기 번호" className='DSinfo-text' color="primary" /></h3>
    //                     <p>{data.desertionNo}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="공고 번호" className='DSinfo-text' color="primary" /></h3>
    //                     <p>{data.noticeNo}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="공고 날짜" className='DSinfo-text' color="primary" /></h3>
    //                     <p>{data.noticeSdt}~{data.noticeEdt}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="보호센터이름" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.careNm}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="보호센터전화번호" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.careTel}</p>
    //                 </div>


    //                 <div className='DSinfo'>
    //                     <h3><Chip label="보호자닉네임" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.careOwnerNm}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="보호번호" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.careRegNo}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="발견일자" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.happenDt}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="발견장소" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.happenPlace}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="센터주소" className='DSinfo-text' color="primary"/></h3>
    //                     <p>{data.careAddr}</p>
    //                 </div>

                    
    //             </div>



    //             {/* 가져온 정보로 상세 정보 표시 */}
    //             <h2>동물정보</h2>
    //             <div className='DSinfo-box'>
    //                 <div className='DSinfo'>
    //                     <h3><Chip label="종류" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.upKindNm}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="품종" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.kindNm}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="털색" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.colorCd}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="출생년도" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.age}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="몸무게" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.weight}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="성별" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.sexCd==='M'?'수컷':'암컷'}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="보호상태" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.processState}</p>
    //                 </div>

    //                 <div className='DSinfo'>
    //                     <h3><Chip label="특징" className='DSinfo-text' color="success"/></h3>
    //                     <p>{data.specialMark}</p>
    //                 </div>
 
    //             </div>

    //         </div>{/* ent bottom */}
    //         {/* 고객센터로 값과 함께 전달할 버튼 */}
    //             <div className='DSbutton'>
    //                 <Button variant="contained" color='secondary' onClick={()=>navigate('/about/select')} >이전 동물</Button>
    //                 <Button variant="contained" onClick={()=>navigate('/customer/adoption')} >입양 문의</Button>
    //                 <Button variant="contained" color='secondary' onClick={()=>navigate('/about/select')} >다음 동물</Button>
    //             </div> 
