import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

const keywordMap = {
  입양: "입양 절차는 상담 → 서류 → 방문입니다.",
  후원: "후원은 각 보호소 상세페이지에서 가능합니다.",
  운영시간: "운영시간은 평일 09:00 ~ 18:00입니다.",
  위치: {
    message: "궁금하신 위치를 선택해주세요!",
  },
  전화번호: "고객센터 전화번호는 1588-1234입니다.",
};

const keywordAliasMap = {
  입양: ["입양", "입양절차", "입양이", "입양 어떻게", "입양 절차", "입양방법"],
  후원: ["후원", "기부", "도와주고 싶어", "후원방법", "도움"],
  운영시간: ["운영", "시간", "운영시간", "여는 시간", "몇 시까지", "몇시에", "야 시간"],
  위치: ["위치", "어디", "장소", "위치좀", "어디야", "지역", "위치 알려줘"],
  전화번호: ["전화", "전화번호", "연락처", "문의전화", "콜센터", "번호"],
};

const regionPathMap = {
  서울: "seoul",
  인천: "incheon",
  경기: "gyeonggi",
  강원: "gangwon",
  세종: "sejong",
  대전: "daejeon",
  충북: "chungbuk",
  충남: "chungnam",
  대구: "daegu",
  광주: "gwangju",
  전북: "jeonbuk",
  전남: "jeonnam",
  울산: "ulsan",
  부산: "busan",
  경북: "gyeongbuk",
  경남: "gyeongnam",
  제주: "jeju",
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeywordClick = (keyword) => {
    if (keyword === "위치") {
      setMessages((prev) => [
        ...prev,
        // { type: "user", text: keyword },
        { type: "bot", text: "궁금하신 위치를 선택해주세요!" },
        {
          type: "options",
          options: Object.keys(regionPathMap),
          actionType: "select-region",
        },
      ]);
    } else if (regionPathMap[keyword]) {
      setMessages((prev) => [
        ...prev,
        // { type: "user", text: keyword },
        {
          type: "bot",
          text: `${keyword} 지역 보호소 목록입니다. 아래 버튼을 눌러 상세페이지로 이동해주세요.`,
        },
        {
          type: "options",
          options: [`${keyword} 보호소 보러가기`],
          actionType: "navigate",
          path: `/location/${regionPathMap[keyword]}`,
        },
      ]);
    } else {
      const botMessage =
        keywordMap[keyword] || "죄송합니다. 해당 키워드는 준비되어 있지 않아요.";
      setMessages((prev) => [
        ...prev,
        // { type: "user", text: keyword },
        { type: "bot", text: botMessage },
      ]);
    }
  };

  const findKeywordMatch = (input) => {
    const trimmed = input.trim();

    for (const [mainKey, aliasList] of Object.entries(keywordAliasMap)) {
      if (aliasList.some((alias) => trimmed.includes(alias))) {
        return mainKey;
      }
    }

    return null; // 매칭 없음
  };

  const handleSend = () => {
      if (!input.trim()) return;

      const userInput = input.trim(); // 사용자의 원본 입력
      const matchedKeyword = findKeywordMatch(userInput); // 입력에서 일치하는 키워드 찾기

      // 1. 사용자 메시지를 즉시 추가합니다.
      setMessages((prev) => [
          ...prev,
          { type: "user", text: userInput },
      ]);

      // 2. 잠시 후 챗봇 응답을 처리합니다.
      setTimeout(() => {
          if (matchedKeyword) {
              // 키워드가 매칭되면, handleKeywordClick 함수를 호출하여
              // 해당 키워드에 맞는 정확한 챗봇 응답을 추가하도록 합니다.
              // 여기서는 사용자의 입력 키워드를 다시 챗봇이 반복하는 메시지를 추가하지 않습니다.
              handleKeywordClick(matchedKeyword);
          } else {
              // 매칭되는 키워드가 없으면, 이해하지 못했다는 메시지를 추가합니다.
              setMessages((prev) => [
                  ...prev,
                  { type: "bot", text: "죄송합니다. 무슨 말씀인지 이해하지 못했어요." },
              ]);
          }
      }, 100); // 챗봇이 약간의 딜레이를 가지고 응답하는 것처럼 보이게 100ms 딜레이를 줍니다.

      setInput(""); // 입력 필드를 비웁니다.
  };



  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3 className="chatbot-title">상담 챗봇</h3>
        <button className="chatbot-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        <div className="message bot">안녕하세요! 무엇을 도와드릴까요?</div>
        {messages.map((msg, idx) => {
          if (msg.type === "options") {
            return (
              <div key={idx} className="message options">
                {msg.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (msg.actionType === "navigate") {
                        navigate(msg.path);
                      } else {
                        handleKeywordClick(opt);
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            );
          } else {
            return (
              <div key={idx} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            );
          }
        })}
      </div>

      <div className="keyword-buttons">
        {Object.keys(keywordMap).map((kw) => (
          <button key={kw} onClick={() => handleKeywordClick(kw)}>
            {kw}
          </button>
        ))}
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          placeholder="질문을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
};

export default Chatbot;
