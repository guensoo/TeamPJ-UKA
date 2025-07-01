import DatePicker from 'react-datepicker';
import defimg from '../../assets/default.jpg'
import './RequestWrite.css'
import { Button, Switch} from "@mui/material";
import { forwardRef, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { useAlert } from '../Customers/Context/AlertContext';

export const RequestWrite = () => {

    // 사진 예시로 보여주기.
    const [preview,setPreview] = useState(defimg);
    // 사진 세팅
    const [img,setImg] = useState('default.jpg')
    // 에러 메세지
    const [error,setError] = useState(' ');
    // 한번이라도 수정했는지-에러 컨트롤
    const [isTouched,setIsTouched] = useState(false);
    // 
    const navigate = useNavigate();
    // 폼 데이터
    const [formData, setFormData] = useState({
        kind:'',
        sex:'',
        age:'',
        name:'',
        image:'default.jpg',

        date:'',
        local:'',
        phone:'',
        descripsion:'',
    });

    // 고객센터에 만들어진 alert 가져오기
    const { showAlert } = useAlert();

    //이미지 등록
    const handleImgChange = (e) => {
        try {
            const file = e.target.file[0];
            if(!file) return;

            setImg(file)
            console.log(file)
            //받은 이미지 저장 (유저아이디+파일명으로 파일 이름 저장.)
            // setFormData(prev=>({...prev,image:localStorage.getItem('userId')+file.name}))
            //받은 이미지로 프리뷰에 쓸 임시 URL 만들고 세팅.
            setPreview(URL.createObjectURL(file));    
        } catch (error) {
            console.error('이미지 변경 중 오류:', error);
        }
    }
    // 간접 클릭
    const handleOnClick = () => {
        document.querySelector('.RWimageinput').click();
    }

    // 에러메세지 작동
    useState(()=>{
        if(!isTouched) return;

        if(formData.name===''){
            setError('이름을 입력해주세요')
        }
        // setError(' ')
    },[formData.name])


    //(중요) 완료 눌렀을 시 동작
    const handleSuccess = async () => {
        // console.log(localStorage.getItem("user_Id"))
        // console.log(formData.sex==='on'?true:false)

        const result = await showAlert({
            title:'작성하시겠습니까?',
            showCancelButton : true,
            confirmButtonText: '네',
            cancelButtonText:'아니요',
        })

        // '네' 버튼 눌렀을 시
        if(result.isConfirmed){

            // 이미지 파일 백엔드에 저장 후 접근 URL받기
            const imageForm = new FormData();
            imageForm.append("file",img);
            imageForm.append("userId",JSON.parse(localStorage.getItem('user')).userId)
            console.log("img",img)
            let imageUrl = null;

            if(img==='default.jpg'){
                // imageUrl = 'default.jpg';
            }else{
                try {
                    const uploadImg = await fetch("http://localhost:8888/request/image",{
                    method:"POST",
                    body:imageForm
                    })
                    const result = await uploadImg.json();            
                    imageUrl= result.imageUrl;
                    } catch (error) {
                        console.log(error)                    
                }
            }

            // request 게시판 데이터 업로드
            const data = {
                find : false,

                name : formData.name,
                kind : formData.kind,
                // JSON.stringify(body.user)
                user_no : JSON.parse(localStorage.getItem('user')).seq,
                // user_seq : localStorage.getItem('userId'),
                img : imageUrl,          //이미지 파일 Url
                sex : formData.sex==='on',    // 성별
                detail:formData.descripsion,      // 특징
                age:formData.age,                // 나이
                lostLocation: formData.local,      // 실종 장소
                lostTime: formData.date,          // 실종 시간  
                contactNumber: formData.phone,     // 연락수단
            }

            const option = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body : JSON.stringify(data)
            }

            try {
                const response = await fetch('http://www.localhost:8888/request',option)

                const list = await response.json()

                console.log(list.length>0,"저장 성공")
                console.log('전송데이터',data)
            } catch (error) {
                console.log(error)
            } finally{
                navigate('/request')
            }
        }
    }

        //공고날짜 커스텀 버튼
        const CustomButton = forwardRef(({ value, onClick }, ref) => (
            <Button variant="outlined" onClick={onClick} ref={ref} sx={{width:'400px'}}>
                {formData.date===""?"날짜 선택":value+' ~'}
            </Button>
        ));


    return(
        <div className="RWmaincontainer">
            {/* 규격화된 신청서 작성하기 */}
            <div className='RWtop'>
                 {/* <RequestCardComponent/> */}
                <div className="RWex"
                    onDrop={(e)=>{
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        setFormData(prev=>({...prev,image:file}))
                        setImg(file)
                        setPreview(URL.createObjectURL(file))
                    }}
                    onDragOver={(e)=>{
                        e.preventDefault()
                    }}
                >
                    {/* 안보이는 input버튼 */}
                    <input className='RWimageinput' type='file' onChange={handleImgChange}/>

                    <div className="RWcontainer">
                            {/* 메인 카드 컴포넌트 - 회색*/}
                            <div className="RWcard">
                                
                                {/* 카드 내부 콘텐츠 영역 - 카드 전부 */}
                                <div className="RWcardContent">

                                {/* 좌측 프로필 이미지 섹션 */}
                                <div className="RWleftSection" onClick={handleOnClick}>

                                    {/* 안내문구 */}
                                    <div className="RWinfo">
                                        사진을 넣어주세요(클릭 또는 드래그 앤 드롭)
                                    </div>
                                    
                                    <img style={{height:'400px', width:'400px',borderRadius: '10px', objectFit:"cover"}} src={preview} />
                                </div>


                                
                                {/* 우측 정보 입력 섹션 */}


                                <div className='RWbottom'>
                                {/* 빨간색 바 */}
                                <div className="RWbottomBar">
                                    <span className="RWbottomBarText">
                                        🐾<input
                                            placeholder='종류'
                                            value={formData.kind}
                                            onChange={(e)=>{
                                                setFormData(prev=>({...prev,kind:e.target.value}))
                                                if (!isTouched) setIsTouched(true);
                                            }}
                                            className='RWinput_main'
                                        />
                                        | 🧸
                                         <small>수컷</small>
                                        <Switch onChange={(e)=>setFormData(prev=>({...prev,sex:e.target.value}))} defaultChecked color="default" /><small>암컷</small>
                                        | 🕒
                                        <input
                                            placeholder='나이'
                                            value={formData.age}
                                            onChange={(e)=>setFormData(prev=>({...prev,age:e.target.value}))
                                            }
                                            className='RWinput_main'
                                        />
                                        | 🏷️
                                        <input
                                            placeholder='이름'
                                            value={formData.name}
                                            onChange={(e)=>{setFormData(prev=>({...prev,name:e.target.value}))}}
                                            className='RWinput_main'
                                        />
                                        </span>
                                </div>

                                {/* 작성내용 */}
                                <div className="RWrightSection">
                                    {/* 각 입력 필드를 개별 그룹으로 구성 */}
                                    <div className="RWinputRow">
                                    <label className="RWlabel">실종 장소:</label>
                                    <input
                                        type="text"
                                        name="lostLocation"
                                        value={formData.local}
                                        onChange={(e)=>{setFormData(prev=>({...prev,local:e.target.value}))}}
                                        className="RWinput"
                                        placeholder="실종된 장소를 입력하세요"
                                    />
                                    </div>

                                    <div className="RWinputRow">
                                    <label className="RWlabel">실종 시간:</label>
                                    {/* 달력 */}
                                    <DatePicker
                                        showIcon
                                        closeOnScroll={true}
                                        selected={formData.date}
                                        dateFormat="YYYY/MM/dd"
                                        className='RWinput'
                                        customInput={
                                        <CustomButton
                                            variant="contained"
                                        >{formData.date}</CustomButton>
                                        }
                                        onChange={(selecteddate)=>setFormData(prev=>({...prev,date:selecteddate}))}
                                    />
                                    </div>

                                    
                                    <div className="RWinputRow">
                                    <label className="RWlabel">연락수단:</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.phone}
                                        onChange={(e)=>{setFormData(prev=>({...prev,phone:e.target.value}))}}
                                        className="RWinput"
                                        placeholder="연락 가능한 전화번호를 입력해주세요"
                                    />
                                    </div>

                                    <div className="RWinputRow">
                                    <label className="RWlabel">특징:</label>
                                    <textarea
                                        name="characteristics"
                                        value={formData.descripsion}
                                        onChange={e=>{setFormData(prev=>({...prev,descripsion:e.target.value}))}}
                                        className="RWtextarea"
                                        placeholder="외모나 특이사항을 입력하세요"
                                        rows={3}
                                    />
                                    </div>

                                   
                                    </div>
                                     {/* 에러 메시지 */}
                                    <div style={{color:'red', textAlign:'center',marginBottom:'20px'}}>
                                        {error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>{/* end ex */}
                    <Button 
                        variant="contained"
                        className="DBButton"
                        color="primary"
                        sx={{marginLeft:'auto', marginTop:'20px'}}
                        onClick={()=>{
                            handleSuccess();
                        }}>완료
                    </Button>
            </div>{/* end top */}
        </div>//end container
        )
}
