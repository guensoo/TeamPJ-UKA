import { useState, useCallback, useEffect } from "react";

/* 화면 */
import OverviewPanel from "../Panel/OverviewPanel";
import MapPanel from "../Panel/MapPanel";
import SliderPanel from "../Panel/SliderPanel";

/* 데이터 */
import SiDoData from "../Map/koreaSiDoData";

/* 훅 */
import useRegionData from "../../hook/useRegionData";
import useSliderAutoPlay from "../../hook/useSliderAutoPlay";

/* 공통 */
import Loading from "../Common/Loading";
import Error from "../Common/Error";

/* 스타일 */
import "./MainBody.css";

const MainBodys = () => {
    // 현재 선택된 지역 orgNm
    const [regionNm, setRegionNm] = useState(null);
    
    // 툴팁 정보
    const [tooltipContent, setTooltipContent] = useState(null);

    // 슬라이드 관련
    const [currentSlide, setCurrentSlide] = useState(0);

    // DB에서 전체 데이터 호출
    const {rawData, allRegionData, regionData, loading, error } = useRegionData();

    // 슬라이드 데이터 세팅
    const [MainSlides, setMainSlides] = useState([]);

    // 슬라이드 자동 전환 훅
    useSliderAutoPlay(setCurrentSlide, MainSlides.length);

    // 슬라이드 전환
    const slideCount = MainSlides.length;

    const handlePrev = useCallback(() => {
        if (slideCount === 0) return;
            setCurrentSlide(prev => (prev - 1 + slideCount) % slideCount);
    }, [slideCount]);

    const handleNext = useCallback(() => {
        if (slideCount === 0) return;
            setCurrentSlide(prev => (prev + 1) % slideCount);
    }, [slideCount]);

    // 지역 선택 시 orgNm 설정
    const handleRegionSelect = useCallback((orgdownNm) => {
        setRegionNm(orgdownNm);
    }, []);

    // 지역 hover 시 툴팁 정보 설정
    const handleRegionHover = useCallback((orgdownNm) => {
        if (!orgdownNm) {
            setTooltipContent(null);
            return;
        }

        const region = regionData.find(item => item.region.startsWith(orgdownNm)) || null;
        setTooltipContent(
            region ? {
                name: region.region,
                centerCount: region.centerCount || 0,
                animalCount: region.animalCount || 0,
                dogs: region.dogsCount || 0,
                cats: region.catsCount || 0,
                others: region.otherCount || 0,
            } : null
        );
    }, [regionData]);

    // rawData에서 오늘과 7일 전 사이의 데이터 필터링 - 새로운 동물들
    useEffect(() => {
        if (!Array.isArray(rawData)) return;

        // 오늘과 7일 전 날짜 계산
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 3);

        // YYYY-MM-DD 포맷을 만드는 헬퍼
        const pad = n => n.toString().padStart(2, '0');
        const formatDate = date =>
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const todayStr    = formatDate(today);
        const sevenAgoStr = formatDate(sevenDaysAgo);

        // happenDt가 "YYYYMMDD"라 가정하고 하이픈 넣어서 비교
        const filtered = rawData.filter(item => {
            // happenDt 체크
            if (typeof item.happenDt !== 'string' || item.happenDt.length !== 8) return false;

            // processState가 "보호중"인 것만
            if (item.processState !== '보호중') return false;

            const itemDateStr = 
                `${item.happenDt.slice(0,4)}-${item.happenDt.slice(4,6)}-${item.happenDt.slice(6,8)}`;
                return itemDateStr >= sevenAgoStr && itemDateStr <= todayStr;
        });

        // 필터링한 결과를 상태에 저장
        setMainSlides(filtered);
    }, [rawData]);
    if (loading) return <Loading />;
    
    if (error) return <Error type={error.type} detail={error.detail} />;

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <MapPanel
                    regionList={SiDoData}
                    onRegionSelect={handleRegionSelect}
                    onRegionHover={handleRegionHover}
                    tooltipContent={tooltipContent}
                    regionNm={regionNm}
                />
                <OverviewPanel 
                    allRegionData={allRegionData} 
                    regionData={regionData} 
                    regionNm={regionNm}
                    setRegionNm={setRegionNm}
                    loading={loading} 
                    error={error}
                />
            </div>
            <SliderPanel
                currentSlide={currentSlide}
                onPrev={handlePrev}
                onNext={handleNext}
                MainSlides={MainSlides}
            />
        </div>
    );
};

export default MainBodys;
