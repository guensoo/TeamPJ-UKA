import { useState } from 'react';
import './NoticeBar.css';
import m_dog_search01 from '../../assets/m_dog_search01.jpg';
import coverMain from '../../assets/cover_main.png';
import cover1 from '../../assets/cover1.png';
import cover2 from '../../assets/cover2.png';
import cover3 from '../../assets/cover3.png';
import cover4 from '../../assets/cover4.png';

export default function NoticeBar() {
    const slides = [
        { img: coverMain, link: '/promo/main', alt: '메인 슬라이드' },
        { img: cover1, link: '/promo/1', alt: '슬라이드 1' },
        { img: cover2, link: '/promo/2', alt: '슬라이드 2' },
        { img: cover3, link: '/promo/3', alt: '슬라이드 3' },
        {
            img: cover4,
            alt: '슬라이드 4',
            isTest: true // 마지막 슬라이드임을 표시
        }
    ];
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(c => Math.min(c + 1, slides.length - 1));
    const prev = () => setCurrent(c => Math.max(c - 1, 0));

    return (
        <div className="notice-bar-stack">
            {/* 캠페인 이미지 배너 */}
            <div className="notice-bar-section">
                <div className="notice-bar notice-bar--image">
                    <img src={m_dog_search01} alt="캠페인 배너" className="notice-bar-img" />
                    <a href="https://kr.vonvon.me/quiz/145/?type=intro" className="notice-bar-img-btn">캠페인 참여하기</a>
                </div>
            </div>
            {/* 슬라이드(캐러셀) 배너 */}
            <div className="notice-bar-section">
                <div className="notice-bar notice-bar--carousel">
                    <button
                        className="carousel-arrow left"
                        onClick={prev}
                        aria-label="이전 배너"
                        disabled={current === 0}
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20">
                            <path d="M13 5l-5 5 5 5" stroke="#888" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="carousel-img-wrapper">
                        <img
                            src={slides[current].img}
                            alt={slides[current].alt}
                            className="carousel-img"
                        />
                        {/* 마지막(테스트용) 슬라이드일 때만 버튼 노출 */}
                        {slides[current].isTest && (
                            <a
                                href="https://poomang.com/t/finally_animal?from_detail=True"
                                className="carousel-test-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                테스트 시작하기
                            </a>
                        )}
                    </div>
                    <button
                        className="carousel-arrow right"
                        onClick={next}
                        aria-label="다음 배너"
                        disabled={current === slides.length - 1}
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20">
                            <path d="M7 5l5 5-5 5" stroke="#888" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
