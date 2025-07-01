import { useCallback, useState } from "react";
import "./ScrollArrowButtons.css";
import chatbot from '../../assets/chatbot.png'
import Chatbot from "../Customers/Pages/Chatbot";

export default function ScrollArrowButtons() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    // 챗봇용
    const [showChatbot, setShowChatbot] = useState(false);

    const toggleChatbot = () => {
        setShowChatbot(prev => !prev);
    };

    return (
        <div>
            <div className="scroll-arrow-buttons">
                {/* 🎧 채팅 상담 버튼 */}
                <button className="chat-bot-btn" onClick={toggleChatbot} aria-label="채팅상담">
                    <img src={chatbot} alt="챗봇 아이콘" style={{width: '100%', height: '100%'}} />
                </button>
                <button className="arrow-btn up" onClick={scrollToTop} aria-label="맨 위로">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <polyline points="5 12 10 7 15 12" fill="none" stroke="#222" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button className="arrow-btn down" onClick={scrollToBottom} aria-label="맨 아래로">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <polyline points="5 8 10 13 15 8" fill="none" stroke="#222" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
        </div>
    );
}
