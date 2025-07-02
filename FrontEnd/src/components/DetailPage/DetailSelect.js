import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './DetailSelect.css'
import { useEffect } from 'react';
import defimg from '../../assets/noImage.jpg';

export const DetailSelect = () => {

  const filteredData = useLocation().state.list
  const index = useLocation().state.index;
  const data = filteredData[index];
  // console.log('전달받은 filter : ',filteredData)
  // console.log('몇번째 : ',index)
  // console.log('현재 페이지 데이터 : ',data)

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
              e.target.src = defimg
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
          onClick={()=>{
            navigate('/about/select',{state:{list:filteredData,index:index-1<0?index:index-1}})
            window.scrollTo(0,0)
          }}
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
          onClick={()=>{navigate('/customer/adoption',{state:data})}}
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
            onClick={()=>{
            navigate('/about/select',{state:{list:filteredData,index:index+1>=filteredData.length?index:index+1}})
            window.scrollTo(0,0)
          }}
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

