import KoreaMapSection from "../Map/KoreaMapSection";

const MapPanel = ({
    regionList,
    onRegionSelect,
    onRegionHover,
    tooltipContent,
    regionNm,
}) => (
    <div className="map-panel">
        <div className="info-box-top">🗺 지역을 선택해주세요</div>
        <KoreaMapSection
            regionList={regionList}
            onRegionSelect={onRegionSelect}
            onRegionHover={onRegionHover}
            tooltipContent={tooltipContent}
            regionNm={regionNm}
        />
        <div className="info-box-bottom marquee">
            <span>
                🐶 강아지 입양 캠페인 중!
                🐱 고양이 입양 시 사료 지원!
                📢 센터 자원봉사자 모집 중!
                고객센터: 1588-1234
                운영시간: 평일 09:00~18:00
                후원계좌: 국민은행 1234567890 (예금주: 멍냥입양소)
                최신공지: 테스트중~~~
            </span>
        </div>
    </div>
);

export default MapPanel;
