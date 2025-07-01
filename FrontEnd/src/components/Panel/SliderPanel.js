import SliderBanner from "../../shared/SliderBanner";

const SliderPanel = ({
    MainSlides,
    currentSlide,
    onPrev,
    onNext,
}) => (
    <div className="bottom-panel">
        <h3 style={{textAlign : "center", marginTop : 0}}>새로 들어온 동물들 🐾</h3>
        <SliderBanner
            MainSlides={MainSlides}
            currentSlide={currentSlide}
            onPrev={onPrev}
            onNext={onNext}
        />
    </div>
);

export default SliderPanel;
