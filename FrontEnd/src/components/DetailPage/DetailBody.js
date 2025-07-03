import { forwardRef, useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { animal as animalData } from "./DetailBodyData";
import './DetailBody.css'
import { CardComponent } from "./CardComponent";
import { Box, Button, Dialog, DialogTitle, ListItem, ListItemButton, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';
import DatePicker from 'react-datepicker';
import { useAlert } from '../Customers/Context/AlertContext';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
// css검사해보니 모든 클래스들이 react-datepicker로 시작해서 사용해도 괜찮을듯.
import 'react-datepicker/dist/react-datepicker.css';

//전달받음.
import NaverMap from "../Map/NaverMap.js";
import SiDoData from "../Map/koreaSiDoData";
import SiGunGooData from "../Map/KoreaSiGunGooData";
import { fetchSavedAnimals } from "../../api/AnimalApiData.js";
import Loading from "../Common/Loading.js";

export const DetailBody = () => {
    // 1) useLocation() 으로 쿼리스트링 읽어오기
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const regionNm = params.get("regionNm") || "";
    // console.log("받아온 regionNm:", regionNm);

    const navigate = useNavigate();
    
    // 품종 버튼을 위한  데이터 저장소
    const [animal,setAnimal] = useState([]);

    //콤보박스 시군구+센터이름
    const [siDo, setSiDo] = useState('');
    const [gunGu, setGunGu] = useState('');
    const [center, setCenter] = useState('');
    const [allData, setAllData] = useState([]);
    const [targetAddress, setTargetAddress] = useState('');
    const [targetCenters, setTargetCenters] = useState([]);
    const [detailFilter, setDetailFilter] = useState([]);
    // 지도 준비 상태 
    const [mapLoad, setMapLoad] = useState(false);

    const { showAlert } = useAlert();

    // 동물 데이터 로딩
    useEffect(() => {
        async function loadData() {
            try {
                const result = await fetchSavedAnimals();
                setAllData(result);
            } catch (e) {
                setAllData([]);
            }
        }
        loadData();
    }, []);

    // 주소 변화 감지해서 데이터 다시 가져오기
    useEffect(() => {
        const newSido = params.get('siDo')||'';
        const newGungu = params.get('gunGu')||'';
        const newCenter = params.get('center') ||'';
        setSiDo(newSido);
        setGunGu(newGungu);
        setCenter(newCenter);
        console.log("뒤로가기 후 받은 siDo:", newSido);
        console.log("뒤로가기 후 받은 gunGu:", newGungu);
        console.log("뒤로가기 후 받은 gunGu:", newCenter);
        //강제 클릭
        // document.querySelector('.DBButton')?.click();
        setTimeout(() => {
            document.querySelector('.DBButton')?.click();
        }, 200); 
    }, [search]);

    const [neuter,setNeuter] = useState('');
    const [sex,setSex] = useState('');
    const [kind,setKind] = useState('')
    // 품종 값 선택
    const [selectedBreed,setSeletedBreed] = useState('')
    // 달력 값 선택
    const [selectedDate, setSelectedDate] = useState("");
    // 품종 모달창 열기 옵션
    const [open,setOpen] = useState(false);

    //하단 정보 보여주기 옵션들
    const [isRow,setIsRow] = useState(false);
    const [show,setShow] = useState(false);

    // 페이징 상태
    const [currentPage,setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const gunList = siDo ? SiGunGooData.filter(item => item.uprCd === siDo) : [];
    const siDoName = siDo ? SiDoData.find(x => x.orgCd === siDo)?.orgdownNm : "";
    const gunGuName = gunGu ? SiGunGooData.find(x => x.orgCd === gunGu)?.orgdownNm : "";
    const centerOptions = getFilteredCentersByOrgNm(allData, siDoName, gunGuName);
    const selectedCenterData = center ? allData.find(item => item.careRegNo === center) : null;
    const selectedCenterDataOnly = center ? allData.filter(item => item.careRegNo === center) : null;

    // 유틸 함수-센터명
    function getFilteredCentersByOrgNm(allData, siDoName, gunGuName) {
    if (!Array.isArray(allData) || !siDoName || !gunGuName) return [];
    const targetNm = `${siDoName} ${gunGuName}`;
    const unique = {};
    allData
        .filter(item => item.orgNm === targetNm)
        .forEach(item => {
            if (!unique[item.careRegNo]) unique[item.careRegNo] = item.careNm;
        });
    return Object.entries(unique).map(([careRegNo, careNm]) => ({
        careRegNo, careNm
    }));
}

    //공고날짜 커스텀 버튼
    const CustomButton = forwardRef(({ value, onClick }, ref) => (
        <Button variant="contained" onClick={onClick} ref={ref}>
            {selectedDate===""?"공고 날짜":value+' ~'}
        </Button>
    ));

    // 페이지 
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = detailFilter?.slice(startIdx, startIdx + itemsPerPage);
    const totalPages = Math.ceil(detailFilter.length / itemsPerPage);

    //보드에서 가져온 페이지 버튼
    const getPageNumbers = () => {
        const maxButtons = 5; //페이지 바에서 최대 보여주는 버튼 개수
		const groupIndex = Math.floor((currentPage - 1) / maxButtons)
		const start = groupIndex * maxButtons + 1;
        const end = Math.min( totalPages, start + maxButtons - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    // 날짜 형식 변환 함수
    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}${month}${day}`;
    };
    return(
        <div className="DBcontainer">
            {/* 헤더 */}
            <div className="DBcombobox">
                <h2 className="DBcombotitle">지역선택</h2>
                {/* 시 */}
                <div className="DBcomboboxcenter">
                    <select
                        id="siDo"
                        value={siDo}
                        onChange={e => {
                            navigate(`?siDo=${e.target.value}`,{replace:true})
                            setSiDo(e.target.value);
                            setGunGu("");
                            setCenter("");
                            setTargetAddress("");
                        }}
                    >
                        <option value="">시/도 선택</option>
                        {SiDoData.map(siItem => (
                            <option key={siItem.orgCd} value={siItem.orgCd}>
                                {siItem.orgdownNm}
                            </option>
                        ))}
                    </select>
                {/* 군 */}
                    <select
                        id="gunGu"
                        value={gunGu}
                        onChange={e => {
                            navigate(`?siDo=${siDo}&gunGu=${e.target.value}`,{replace:true})
                            setGunGu(e.target.value);
                            setCenter('');
                            setTargetAddress('');
                        }}
                        disabled={!siDo}
                    >
                        <option value="">군/구 선택</option>
                        {gunList.map(item => (
                            <option key={item.orgCd} value={item.orgCd}>
                                {item.orgdownNm}
                            </option>
                        ))}
                    </select>
                {/* 센터 */}
                    <select
                        id="center"
                        value={center}
                        onChange={e => {
                            setCenter(e.target.value)
                            navigate(`?siDo=${siDo}&gunGu=${gunGu}&center=${e.target.value}`,{replace:true})
                        }}
                        disabled={!gunGu}
                    >
                        <option value="">센터 선택</option>
                        {centerOptions.map(item => (
                            <option key={item.careRegNo} value={item.careRegNo}>
                                {item.careNm}
                            </option>
                        ))}
                    </select>
                </div>
                {/* 센터 선택, 마커 생성 버튼 */}
                <div className="DBcomboboxright">
                    <Button
                        variant="contained"
                        className="DBButton"
                        color="info"
                        sx={{ marginLeft: '20px'}}
                        onClick={() => {
                            let filteredCenters = [];
                            if (selectedCenterData) {
                                // 센터 선택 시 1개 센터만 마커 표시
                                // filteredCenters = [selectedCenterData];
                                filteredCenters=selectedCenterDataOnly;
                            } else if (siDoName && gunGuName) {
                                // 시군구 선택 시 그 지역 내 모든 센터 표시
                                filteredCenters = allData.filter(
                                    item => item.orgNm === `${siDoName} ${gunGuName}`
                                );
                            } else if (siDoName) {
                                // 시/도 선택 시 그 시도 내 모든 센터 표시
                                filteredCenters = allData.filter(
                                    item => item.orgNm.startsWith(siDoName)
                                );
                            }
                            setShow(true)
                            setTargetCenters(filteredCenters);
                            setDetailFilter(filteredCenters)
                            console.log("마커 표시할 센터 목록:", filteredCenters);
                            // window.scrollTo({ top: 300, left: 0, behavior: 'smooth' });
                        }}
                        >
                        <span>검색하기</span>
                    </Button>
                </div>
            </div>
            {/* 상단 div */}
            <div className="DBtop">
                {/* 여기에 지도 들어갈 것 같아요. */}
                <div className="DBmap">
                    {!mapLoad&& <Loading />}
                    <NaverMap centers={targetCenters} onMapReady={()=>setMapLoad(true)} />
                </div>
            </div>{/* end top */}
            {/* 보드에서 가져온 헤더 */}
                    <div className="DBboard-header-container">
                        <div className="DBboard-header-left">
                            <h2 className="DBboard-title">상세검색</h2>
                        </div>
                        <div className="DBboard-header-center">

                            <select value={neuter} onChange={(e)=>{setNeuter(e.target.value)}}>
                                <option value="" disabled selected hidden>중성화 여부</option>
                                <option value={''}>(전체)</option>
                                <option value={'Y'}>완료</option>
                                <option value={'N'}>미완료</option>
                                <option value={'U'}>불확실</option>
                            </select>
                            {/* 달력 */}
                            <DatePicker
                                showIcon
                                minDate={new Date().setDate(new Date().getDate()-30)}
                                maxDate={new Date().setDate(new Date().getDate()+5)}
                                closeOnScroll={true}
                                selected={selectedDate}
                                dateFormat="YYYY/MM/dd"
                                customInput={
                                    <CustomButton
                                        variant="contained"
                                        onClick={()=>{if(!show){
                                    }}}
                                        >{selectedDate}
                                    </CustomButton>
                                }
                                onChange={(date)=>setSelectedDate(date)}
                            />

                            <select value={kind} onChange={(e)=>{setKind(e.target.value)}}>
                                                    <option value="" disabled hidden>종류</option>
                                                    <option value="dog">강아지</option>
                                                    <option value="cat" >고양이</option>
                                                    <option value="etc" >기타</option>
                                                </select>

                                                <Button variant="contained" onClick={
                                                    kind===''?(()=>{
                                                        showAlert({
                                                            title:`종류를 먼저 선택해주세요`,
                                                            icon:'warning',
                                                        })
                                                    }):kind==='etc'?()=>{    
                                                        //동작안함.
                                                    }:()=>{
                                                        setOpen(true)
                                                        setAnimal(animalData[kind]);
                                                    }}
                                                    sx={{opacity:kind==='etc'?'0.3':'1'}}
                                                >
                                                    {selectedBreed===''?'품종':selectedBreed}
                                                </Button>
                                            
                                                <Dialog
                                                    fullWidth={true}
                                                    maxWidth={'sm'}
                                                    onClose={()=>{setOpen(!open)}}
                                                    open={open}
                                                >
                                                    <DialogTitle
                                                        sx={{background:'#cceeff'}}
                                                    >품종을 선택하세요</DialogTitle>
                                                    <div className='dialogSearch'>
                                                        <TextField
                                                            fullWidth
                                                            placeholder='검색어를 입력해주세요'
                                                            onChange={e=>{
                                                                const keyword = e.target.value.trim();

                                                                if(keyword===''){
                                                                    setAnimal(animalData[kind])
                                                                    return;
                                                                }
                                                                const filtered = (animalData[kind] || []).filter(item => {
                                                                    const breedName = Object.keys(item)[0];
                                                                    return breedName.includes(keyword);
                                                                });

                                                                setAnimal(filtered);
                                                            }}
                                                        />
                                                        <RefreshIcon
                                                            onClick={()=>{
                                                                setAnimal(animalData[kind])
                                                            }}
                                                        sx={{fontSize:'50px'}} /> 
                                                        <SearchIcon 
                                                        sx={{fontSize:'50px'}} /> 
                                                    </div>

                                                    {(animal||[]).map((animalItem, index) => {
                                                        const breedName = Object.keys(animalItem)[0];
                                                        const breedImg = Object.values(animalItem)[0];
                                                        return (
                                                            <ListItemButton
                                                                key={index}
                                                                onClick={() => {
                                                                    setSeletedBreed(breedName)
                                                                    setOpen(false);
                                                                    setAnimal(animalData[kind] || []);
                                                                }}
                                                                >
                                                                <ListItem disablePadding sx={{ border: '1px solid #cceeff' }}>
                                                                    <img
                                                                    className="DBdialogimg"
                                                                    src={`/img/${kind}_picture/${breedImg}.jpg`}
                                                                    alt={`${breedName} 이미지`}
                                                                    />
                                                                    {breedName}
                                                                </ListItem>
                                                            </ListItemButton>
                                                        );
                                                        })}
                                                </Dialog>
                            <select value={sex} onChange={(e)=>{setSex(e.target.value)}}>
                                <option  value="" disabled selected hidden>성별</option>
                                <option value=''>(전체)</option>
                                <option value='M' >수컷</option>
                                <option value='F'>암컷</option>
                            </select>
                        </div>
                            {/* 상세검색 오른쪽 */}
                        <div className="DBboard-header-right">
                            <Button 
                                variant="contained"
                                className="DBButton"
                                color="primary"
                                fullWidth
                                sx={{marginLeft:2}}
                                onClick={()=>{
                                    setKind('')
                                    setSex('')
                                    setNeuter('')
                                    setSelectedDate('')
                                    setSeletedBreed('')
                                }}>
                            초기화
                            </Button>
                            <Button 
                                variant="contained"
                                className="DBButton"
                                color="primary"
                                fullWidth
                                onClick={()=>{
                                    if(!show){
                                        showAlert({
                                            title:'지역 검색을 먼저 해주세요',
                                            icon: 'warning'
                                        })
                                    }
                                    // 통합 필터
                                    setDetailFilter(
                                        targetCenters.filter((item) =>
                                            (!selectedDate || item.happenDt >= formatDateToYYYYMMDD(selectedDate)) &&
                                            (!neuter || item.neuterYn === neuter) &&
                                            (!selectedBreed || item.kindNm === selectedBreed) &&
                                            (!sex || item.sexCd === sex) &&
                                            (!kind || item.upKindNm === (kind === 'dog' ? '개' : '고양이'))
                                        )
                                    );

                                }}>상세검색하기
                            </Button>
                        </div>   
                    </div>
{/* ================================================================================================ */}
            {/* 지역선택하면 값을 받아서 렌더링하게 설정할것(지금은 일단 보임.) */}
            <div className="DBbottom">
                {/* 렌더링 방식 정하는 드롭다운. */}
                <div className="DBdropdown">
                    {/* 토글 버튼 두개 */}
                    <ToggleButtonGroup
                        value={isRow}
                        exclusive
                        onChange={(event,newRow)=>{
                            if(newRow !== null){
                                setIsRow(newRow)
                                console.log('newRow',newRow)
                                console.log('isRow',isRow)
                            }
                            
                        }}
                    >
                        <ToggleButton value={false}>
                            <AppsIcon/>
                        </ToggleButton>
                        <ToggleButton value={true}>
                            <FormatListBulletedIcon/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {/* 상세정보 하나 들어가는 박스 */}
                {show&&<><Box className="DBdetail-box">
                    {currentItems.length<1?
                        <div>
                        <div><h2>표시할 데이터가 없습니다. </h2></div>
                        </div>:
                         currentItems.map((item,index) => (
                        <CardComponent
                            key={item.desertionNo}
                            row={isRow}
                            img={item.popfile1}
                            detail={item.description}
                            title={item.title}
                            list={item}
                            filteredData={detailFilter}
                            index={index+(currentPage*itemsPerPage)-itemsPerPage}
                        />
                    ))}
                </Box>
                {/* 페이징 버튼 */}
                <div className="DBpagination">
                    <button
                        onClick={() => {
                            const prevGroupStart = Math.ceil((currentPage - 1) / 5 - 1) * 5;
                            //ex) currentPage = 14 -> ceil((14-1)/5-1) = 2 , 2*5 = 10page
                            const prevGroupPage = Math.max(prevGroupStart, 1); //둘중에 최댓값의 페이지로 이동
                            setCurrentPage(prevGroupPage);
                        }}
                        disabled={currentPage === 1}
                    >
                    «
                    </button>
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                    {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                    ))}
                    <button onClick={() => {
                        setCurrentPage(currentPage + 1)}} disabled={currentPage === totalPages}>›</button>
                    <button
                        onClick={() => {
                            const nextGroupStart = Math.floor((currentPage - 1) / 5 + 1) * 5 + 1;
                            //ex) currentPage = 14 -> floor((14-1)/5+1) = 3, 3*5+1 = 16page
                            const nextGroupPage = Math.min(nextGroupStart, totalPages); //둘중에 최솟값의 페이지의로 이동
                            setCurrentPage(nextGroupPage);
                        }}
                        disabled={currentPage === totalPages}
                    >
                    »
                    </button>
                </div></>}
            </div>{/* end bottom */}
                {/* 통합검색  */}
                {show&&<nav className="DBmini-tab-bar">
                    <div className="DBboard-header-center">
                        <input
                            className="DBboard-search-input"
                            type="text"
                            placeholder="통합검색"
                        />
                        <button className="DBboard-search-button">
                        🔍
                        </button>
                    </div>
                </nav>}

        </div>
    )
}