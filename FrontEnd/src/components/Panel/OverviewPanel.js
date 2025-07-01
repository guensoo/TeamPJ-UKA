// src/components/Panel/OverviewPanel.js
import { useMemo, useRef  } from "react";
import "./OverviewPanel.css";

import chartCat from "../../assets/chartCat.png";
import chartCat1 from "../../assets/chartCat1.png";
import chartCat2 from "../../assets/chartCat2.png";
import chartCat3 from "../../assets/chartCat3.png";

import chartDog from "../../assets/chartDog.png";
import chartDog1 from "../../assets/chartDog1.png";
import chartDog2 from "../../assets/chartDog2.png";
import chartDog3 from "../../assets/chartDog3.png";

// Recharts import
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Cell,
    PieChart,
    Pie,
} from "recharts";

const allImages = [
    chartDog, chartDog1, chartDog2, chartDog3,
    chartCat, chartCat1, chartCat2, chartCat3
];

export default function OverviewPanel({ allRegionData, regionData, regionNm, setRegionNm, loading, error }) {
    const selectRef = useRef(null);

    // 전체 집계
    const overallData = useMemo(() => {
        return allRegionData.reduce (
            (acc, item) => {
                acc.centerCount  = item.centerCount   ?? 0;
                acc.animalCount  = item.animalCount   ?? 0;
                acc.dogs         = item.dogsCount     ?? 0;
                acc.cats         = item.catsCount     ?? 0;
                acc.others       = item.otherCount    ?? 0;
                return acc;
            },
            { centerCount: 0, animalCount: 0, dogs: 0, cats: 0, others: 0 }
        );
    }, [allRegionData]);

    // 지역별 집계 데이터
    const selectedRegion = useMemo(() => {
    if (!regionNm) return null;
    
    // orgNm(예: "경상북도 포항시")이 regionNm으로 시작하는 항목 찾기
    return regionData.find(item => item.region.startsWith(regionNm)) || null;
    }, [regionData, regionNm]);

    // 파이 차트 이미지 랜덤 호출
    const randomImg = useMemo(() => {
        const idx = Math.floor(Math.random() * allImages.length);
        return allImages[idx];
    }, [regionNm]);
  
    const today = new Date().toISOString().split("T")[0];
    if (loading) return <p>Loading…</p>;
    if (error?.type === "empty") return <p>데이터가 없습니다.</p>;
    if (error) return <p>Error: {error.detail || error.message}</p>;

    // 차트용 전체 데이터 생성
    const chartAllData = [
        { name: "개", value: overallData.dogs },
        { name: "고양이", value: overallData.cats },
        { name: "기타", value: overallData.others },
    ];
    const colors = ["#8884d8", "#82ca9d", "#ffc658"];

    // 전체 차트 데이터 선언 아래에 추가
    const chartRegionalData = selectedRegion ? [
        { name: "개", value: selectedRegion.dogsCount },
        { name: "고양이", value: selectedRegion.catsCount },
        { name: "기타", value: selectedRegion.otherCount },
    ]
    : [];
    const pieColors = ["#8884d8", "#82ca9d", "#ffc658"];

    return (
        <div className="info-panel">
            <div className="info-top">
                {/* 전체 현황판 패널 */}
                <div className="overall-status-panel">
                    
                    <h2 style={{textAlign:"center", marginTop : 5}}>전체 현황판</h2>
                    <p style={{textAlign:"center", fontSize : 14, marginTop : -10}}>전체 동물 수 : {overallData.animalCount} | 전체 센터 수 : {overallData.centerCount}</p>
                    {/* 스타일 적용된 차트 */}
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartAllData} margin={{ top: 10, right: 20, left: -15, bottom: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#555" }} />
                                <YAxis tick={{ fontSize: 14, fill: "#555" }} />
                                <Tooltip
                                    formatter={(val) => [`${val} 마리`, "수량"]}
                                    contentStyle={{ backgroundColor: "#fff", borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                                    itemStyle={{ fontSize: 14 }}
                                />
                                {/* 커스텀 payload로 범례 항목을 각각 표시 */}
                                    <Legend
                                        verticalAlign="top"
                                        align="center"
                                        iconType="circle"
                                        payload={chartAllData.map((entry, i) => ({
                                            id: entry.name,
                                            value: entry.name,
                                            type: "circle",
                                            color: colors[i],
                                        }))}
                                        wrapperStyle={{
                                            top: -5,          // 범례를 컨테이너 최상단으로 올림
                                            left: '55%',     // 가운데 정렬을 유지하면서
                                            transform: 'translateX(-50%)', // 정확한 중앙 배치
                                        }}
                                    />
                                <Bar dataKey="value">
                                    {/* Cell 컴포넌트로 각 바마다 다른 색상 적용 */}
                                    {chartAllData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <h6 style={{textAlign:"center", marginTop : 5, marginBottom : 0, marginLeft : 20}}>{today} 기준</h6>
                </div>
            </div>
            {/* 지역 현황판 패널 */}
            <div className="info-middle">
                <div className="regional-status-panel">
                    {selectedRegion ? (
                        <h2 style={{ textAlign: "center", marginTop : 5 }}> {selectedRegion.region} 현황판</h2>
                    ) : (
                        <h2 style={{ textAlign: "center", marginTop : 5 }}> 지역현황판</h2>
                    )}
                    {/* 1) 지역명, 전체 동물 수, 센터 수 추가 */}
                    {selectedRegion ? (
                        <div className="regional-summary">
                            <p style={{fontSize:14, marginTop:-10}}>전체 동물 수: {selectedRegion.animalCount} 마리 | 센터 수: {selectedRegion.centerCount} 개</p>
                        </div>
                    ) : (
                        null
                    )}
                    {/* 2) 파이차트 */}
                    {selectedRegion ? (
                        <div className="pie-chart-container">
                            {/* 1) 중앙 이미지 */}
                            <img
                                src={randomImg} // 예시 이미지 경로
                                alt="센터 로고"
                                className="center-img"
                            />
                            <ResponsiveContainer width="100%" height={250}>
                                {/* margin을 넉넉히 줘서 라벨이 짤리지 않도록 */}
                                <PieChart 
                                    margin={{ top: 12, right: 20, left: 20, bottom: 10 }}
                                    style={{ outline: 'none' }}
                                >
                                    <Pie
                                        data={chartRegionalData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        /* innerRadius 추가로 도넛 형태로 */
                                        innerRadius={60}
                                        outerRadius={80}
                                        /* 라벨 라인 제거, 값만 중앙 바깥쪽으로 표시 */
                                        stroke="none"
                                        labelLine={false}
                                        label={({ value }) => `${value}마리`}
                                    >
                                        {chartRegionalData.map((_, idx) => (
                                            <Cell key={idx} fill={pieColors[idx]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={val => [`${val} 마리`, "수량"]}
                                        wrapperStyle={{
                                            zIndex: 3,           // 툴팁을 최상위로
                                            position: 'absolute' // 절대 위치 지정 (기본값이 relative 일 수 있어 명시)
                                        }}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            borderRadius: 4,
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        payload={chartRegionalData.map((e, i) => ({
                                            id: e.name,
                                            value: e.name,
                                            type: "circle",
                                            color: pieColors[i],
                                        
                                        }))}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: "center", marginTop: 32 }}>지역을 선택해주세요.</p>
                    )}
                </div>
            </div>

            <div className="info-bottom">
                <h4>선택 지역 유기동물 찾기</h4>

                {/* select + button 을 묶는 컨테이너 */}
                <div className="bottom-actions">
                    <select
                        className="info-bottom-select"
                        ref={selectRef}
                        value={regionNm || ""}
                        onChange={e => setRegionNm(e.target.value)}
                    >
                        <option value="">-- 지역 선택 --</option>
                        {regionData.map(item => (
                            <option key={item.region} value={item.region}>
                                {item.region}
                            </option>
                        ))}
                    </select>
                    <button
                        className="info-bottom-button"
                        onClick={() => {

                        }}
                    > 찾기
                    </button>
                </div>
            </div>
        </div>
    );
}
