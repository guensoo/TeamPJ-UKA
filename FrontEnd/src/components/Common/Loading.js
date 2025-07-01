import { useMemo } from "react";
import DogRun from "../../assets/DogRun2.gif";
import DogRun2 from "../../assets/DogRun3.gif";
import DogRun3 from "../../assets/DogRun4.gif";
import CatRun from "../../assets/CatRun.gif";
import BirdFly from "../../assets/BirdFly.gif";
import "./Loading.css";

// 이미지+텍스트 세트
const loadingItems = [
  {
    img: [DogRun, DogRun2, DogRun3],
    texts: [
        "🐶💾 멍멍이가 데이터를 물고 오는 중입니다!",
        "🦴🐾 멍멍! 곧 데이터를 가져올게요!",
        "🐶🏃‍♂️ 강아지가 빠르게 달려가고 있어요!",
    ]
  },
  {
    img: CatRun,
    texts: [
      "😺 고양이들이 살금살금 데이터를 가져오는 중이에요!",
      "🐾 냥냥이가 서버 위를 걷는 중... 기다려주세요!",
      "🐈‍⬛🕸️ 냥냥이가 서버망을 타고 이동 중입니다!",
    ]
  },
  {
    img: BirdFly,
    texts: [
      "🐦 새들이 날아가 정보를 물어오고 있어요!",
      "🐦💨 쨱쨱! 빠르게 데이터 가져오는 중입니다! 💨",
      "🐤➡️📦 쨱쨱! 데이터 배달 중입니다!",
    ]
  }
];

const Loading = () => {
    // 한 번만 랜덤으로 선택
    const { img, texts } = useMemo(
        () => loadingItems[Math.floor(Math.random() * loadingItems.length)],
        []
    );

  // 이미지도 Dog일 땐 배열 중 랜덤, 나머진 그대로
    const selectedImg = useMemo(() => {
        if (Array.isArray(img)) {
            // Dog 그룹일 때
            return img[Math.floor(Math.random() * img.length)];
        }
        return img;
    }, [img]);

    // 텍스트도 랜덤
    const randomText = useMemo(
        () => texts[Math.floor(Math.random() * texts.length)],
        [texts]
    );

    return (
        <div className="loading-container">
        <img src={selectedImg} alt="로딩 중" />
        <p>{randomText}</p>
        </div>
    );
};


export default Loading;
