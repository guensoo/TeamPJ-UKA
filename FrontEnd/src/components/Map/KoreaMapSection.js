import { Tooltip } from "react-tooltip";

const KoreaMapSection = ({
    regionList,
    onRegionSelect,
    onRegionHover,
    tooltipContent,
    regionNm,
}) => (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 524 631">
            {regionList.map((city) => (
                <path
                    key={city.orgCd}
                    className={`${city.className} ${regionNm === city.orgdownNm ? "selected-region" : ""}`}
                    d={city.d}
                    stroke="#333"
                    strokeWidth={0.5}
                    fill="#D1E5F4"
                    style={{ cursor: "pointer", outline: "none" }}
                    data-tooltip-id="region-tooltip"
                    onClick={() => onRegionSelect(city.orgdownNm)}
                    onMouseEnter={() => onRegionHover(city.orgdownNm)}
                    onMouseLeave={() => onRegionHover(null)}
                //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  
                />
            ))}
        </svg>
        <Tooltip
            id="region-tooltip"
            render={() =>
                tooltipContent ? (
                    <div style={{ padding: "8px" }}>
                        <strong>{tooltipContent.name}</strong>
                        <p>센터 : {tooltipContent.centerCount}</p>
                        <p>동물 수 : {tooltipContent.animalCount}</p>
                        <p>강아지: {tooltipContent.dogs}</p>
                        <p>고양이: {tooltipContent.cats}</p>
                        <p>기타: {tooltipContent.others}</p>
                    </div>
                ) : null
            }
        />
    </>
);

export default KoreaMapSection;
