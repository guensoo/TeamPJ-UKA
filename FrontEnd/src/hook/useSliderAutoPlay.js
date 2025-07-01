import { useEffect } from "react";

/**
 * 슬라이드 자동 전환 훅
 * @param {boolean} isPlaying - 자동 전환 On/Off
 * @param {function} setCurrentSlide - 슬라이드 인덱스 setter
 * @param {number} total - 슬라이드 개수
 * @param {number} intervalMs - 전환 시간(ms), 기본값 3000
 */

const useSliderAutoPlay = (setCurrentSlide, total, intervalMs = 10000) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % total);
        }, intervalMs);
        return () => clearInterval(interval);
    }, [setCurrentSlide, total, intervalMs]);
};

export default useSliderAutoPlay;
