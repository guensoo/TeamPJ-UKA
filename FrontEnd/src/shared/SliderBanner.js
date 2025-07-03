import { Link } from "react-router-dom";
import "./SliderBanner.css";
import DogRun2 from "../assets/DogRun2.gif";
import noImage from "../assets/noImage.jpg";

const SliderBanner = ({ currentSlide, onPrev, onNext, MainSlides }) => {
    const visibleCount = 2; // 한 번에 보여줄 슬라이드 개수
    const translatePercent = (currentSlide * 100) / visibleCount;


    console.log("MainSlides ::", MainSlides);

    // 1) MainSlides가 비어 있을 때
    if (!MainSlides || MainSlides.length === 0) {
        return (
            <div className="slider-empty">
                {/* 대체 이미지 */}
                <img
                    src={DogRun2}       // 프로젝트에 맞게 경로 조정
                    alt="데이터 없음"
                    className="slider-empty-image"
                />
                {/* 대체 텍스트 */}
                <p className="slider-empty-text">새로 들어온 동물이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="main-slider-container">
            {/* 1. 왼쪽 버튼 */}
            <button
                className="main-slider-button prev"
                onClick={onPrev}
                aria-label="Previous Slide"
            > ◀ </button>
            {/* 2. 슬라이드 뷰포트 */}
        <div className="slider-viewport">
            <div
                className="slider-content"
                style={{ transform: `translateX(-${translatePercent}%)` }}
            >
                {MainSlides.map(slide => {
                    // "[고양이] 한국 고양이" → "한국 고양이"
                    const displayName = slide.kindFullNm.replace(/^\[.*?\]\s*/, '');

                    return (
                        <div className="slide" key={slide.desertionNo}>
                            <div className="slide-image-wrapper">
                                <img
                                    src={slide.popfile1}
                                    alt={slide.kindNm}
                                    className="slide-image"
                                    onError={e => { e.target.src = noImage; }}
                                />
                            </div>
                            <div className="slide-info">
                                <Link
                                    to={`/about/select?desertionNo=${slide.desertionNo}`}
                                    className="slide-link"
                                    style={{ textDecoration: 'none', fontSize : 16}}
                                >
                                    {displayName}
                                </Link>
                                <p><strong>발견장소 : </strong>{slide.happenPlace}</p>
                                <p><strong>특이사항 : </strong>{slide.specialMark}</p>
                                <p><strong>보호장소 : </strong>{slide.careAddr}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* 3. 오른쪽 버튼 */}
        <button
            className="main-slider-button next"
            onClick={onNext}
            aria-label="Next Slide"
        >
            ▶
        </button>
        </div>
    );
};

export default SliderBanner;
