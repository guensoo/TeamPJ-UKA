import DatePicker from 'react-datepicker';
import defimg from '../../assets/default.jpg'
import './RequestWrite.css'
import { Button, Dialog, DialogTitle, ListItem, ListItemButton, Switch} from "@mui/material";
import { forwardRef, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { useAlert } from '../Customers/Context/AlertContext';
import { animal } from "../DetailPage/DetailBodyData.js";

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
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    // 폼 데이터
    const [formData, setFormData] = useState({
        kind:'',
        sex:'',
        age:'',
        name:'',
        image:'default.jpg',
        selectedBreed:'',
        date:'',
        local:'',
        phone:'',
        detail:'',
    });

    // 고객센터에 만들어진 alert 가져오기
    const { showAlert } = useAlert();

    //이미지 등록
    const handleImgChange = (e) => {
        try {
            const file = e.target.files[0];
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
    
    



    // 취소 버튼 눌렀을시
    const handleCancle = async () => {

        const result = await showAlert({
            title:`작성을 취소하시겠습니까?\n(이전 화면으로 돌아갑니다)`,
            icon:'warning',
            showCancelButton : true,
            confirmButtonText: '네',
            cancelButtonText:'아니요',
        })

        // '네' 버튼 눌렀을 시
        if(result.isConfirmed){
            navigate(-1)
        }
    }


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
                kind : formData.kind==='cat'?'고양이':'강아지',
                selectedbreed: formData.selectedBreed,
                // JSON.stringify(body.user)
                user_no : JSON.parse(localStorage.getItem('user')).seq,
                // user_seq : localStorage.getItem('userId'),
                img : imageUrl,          //이미지 파일 Url
                sex : formData.sex==='on',    // 성별
                detail:formData.detail,      // 특징
                age:formData.age,                // 나이
                local: formData.local,      // 실종 장소
                time: formatDateToYYYYMMDD(formData.date),// 실종 시간  
                phone: formData.phone,     // 연락수단
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

        // 날짜 형식 변환 함수
        const formatDateToYYYYMMDD = (date) => {
            const year = date.getFullYear();
            const month = `${date.getMonth() + 1}`.padStart(2, '0');
            const day = `${date.getDate()}`.padStart(2, '0');
            return `${year}${month}${day}`;
        };


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
                                        <div style={{display:'flex',flexDirection:'row',gap :'20px'}}>
                                            <span>
                                                🏷️
                                                <input
                                                    placeholder='이름'
                                                    style={{width:'150px'}}
                                                    value={formData.name}
                                                    onChange={(e)=>{setFormData(prev=>({...prev,name:e.target.value}))}}
                                                    className='RWinput_main'
                                            /></span>

                                            |

                                            <span>🐾
                                                <select value={formData.kind} onChange={(e)=>{setFormData(prev=>({...prev,kind:e.target.value}))}}>
                                                    <option value="" disabled hidden>종류</option>
                                                    <option value="dog">강아지</option>
                                                    <option value="cat" >고양이</option>
                                                </select>

                                                <Button variant="contained" onClick={
                                                    formData.kind===''?(()=>{}):()=>setOpen(true)}
                                                >
                                                    {formData.selectedBreed===''?'품종':formData.selectedBreed}
                                                </Button>
                                            
                                                <Dialog
                                                    onClose={()=>{setOpen(!open)}}
                                                    open={open}
                                                >
                                                    <DialogTitle
                                                        sx={{background:'#cceeff'}}
                                                    >품종을 선택하세요</DialogTitle>
                                                        {animal[formData.kind === 'cat' ? 'cat' : 'dog'].map((animal, index) => (
                                                            <ListItemButton key={index} 
                                                                onClick={()=>{
                                                                    const result = Object.keys(animal)[0]
                                                                    setFormData(prev=>({...prev,selectedBreed:result}))
                                                                    console.log(result)
                                                                    // setSeletedBreed(Object.keys(animal)[0])
                                                                    setOpen(false);
                                                                }}>
                                                                <ListItem disablePadding sx={{border:'1px solid #cceeff'}}>
                                                                    {<img className="DBdialogimg" src={`/img/${formData.kind}_picture/${Object.values(animal)[0]}.jpg`} alt="고양이 이미지" />}
                                                                    {Object.keys(animal)[0]}
                                                                </ListItem>
                                                        </ListItemButton>
                                                        ))}               
                                                </Dialog>
                                            </span>
                                        </div>
                                        <div style={{display:'flex',gap :'20px'}}>   
                                            <span>🕒
                                                <input
                                                    style={{width:'150px'}}
                                                    placeholder='나이'
                                                    value={formData.age}
                                                    onChange={(e)=>setFormData(prev=>({...prev,age:e.target.value}))
                                                    }
                                                    className='RWinput_main'/>
                                            </span>
                                            |
                                            <span>🧸
                                                <small style={{alignSelf:'center'}}>수컷</small>
                                                <Switch onChange={(e)=>setFormData(prev=>({...prev,sex:e.target.value}))} defaultChecked color="default" /><small style={{alignSelf:'center'}}>암컷</small>
                                            </span>
                                        </div>
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
                                        placeholder="연락 가능한 전화번호 또는 SNS아이디를 입력해주세요"
                                    />
                                    </div>

                                    <div className="RWinputRow">
                                    <label className="RWlabel">특징:</label>
                                    <textarea
                                        name="characteristics"
                                        value={formData.detail}
                                        onChange={e=>{setFormData(prev=>({...prev,detail:e.target.value}))}}
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
                    <div className='RWbuttonbox'>
                        <Button 
                            variant="contained"
                            className="DBButton"
                            color="primary"
                            onClick={()=>{
                                handleCancle();
                            }}>취소
                        </Button>

                        <Button 
                            variant="contained"
                            className="DBButton"
                            color="primary"
                            
                            onClick={()=>{
                                handleSuccess();
                            }}>완료
                        </Button>
                    </div>
            </div>{/* end top */}
        </div>//end container
        )
}
