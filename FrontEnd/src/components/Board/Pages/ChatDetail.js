import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BoardDetail.css';
import { useChat } from '../Context/ChatContext';

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {chats} = useChat();

  const [chat, setChat] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    const chatId = parseInt(id);
    const sorted = [...chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const currentIndex = sorted.findIndex((item) => item.id === chatId);
    const current = sorted[currentIndex];

    setChat(current);
    setPrev(sorted[currentIndex - 1] || null);
    setNext(sorted[currentIndex + 1] || null);
  }, [id, chats]);

  if (!chat) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  // 🔒 비밀글 접근 체크
  if (chat.isSecret && !window.sessionStorage.getItem(`chat_access_${chat.id}`)) {
    const input = prompt('🔒 비밀글입니다. 비밀번호를 입력해주세요');
    if (input === chat.password) {
      window.sessionStorage.setItem(`chat_access_${chat.id}`, 'true');
    } else {
      alert('❌ 비밀번호가 일치하지 않습니다.');
      navigate('/board/chat');
      return null;
    }
  }

  const handleSecretNavigate = (post) => {
    if (post.isSecret) {
      const input = prompt('🔒 비밀글입니다. 비밀번호를 입력해주세요');
      if (input === post.password) {
        window.sessionStorage.setItem(`chat_access_${post.id}`, 'true');
        navigate(`/board/chat/${post.id}`);
      } else {
        alert('❌ 비밀번호가 틀렸습니다.');
      }
    } else {
      navigate(`/board/chat/${post.id}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{chat.title}</h2>
      <p>작성자: {chat.author}</p>
      <p>{chat.content}</p>

      <div className="chat-button-group">
        <button
          className="chat-button"
          onClick={() => navigate(`/board/chat/${chat.id}/edit`, { state: chat })}
        >
          ✏️ 수정
        </button>
        <button
          className="chat-button"
          onClick={() => {
            if (window.confirm('삭제하시겠습니까?')) {
              alert('삭제 기능은 아직 구현되지 않았습니다.');
              navigate('/board/chat');
            }
          }}
        >
          🗑 삭제
        </button>
        <button
          className="chat-button"
          onClick={() => navigate('/board/chat')}
        >
          ← 목록으로
        </button>
      </div>

      <div className="chat-navigation">
        {prev && (
          <div className="chat-nav-item" onClick={() => navigate(`/board/chat/${prev.id}`)}>
            <span className="chat-nav-label">◀️ 이전글</span>
            <span className="chat-nav-title">
              {prev.isSecret ? '비밀글입니다.' : prev.title}
            </span>
          </div>
        )}
        {next && (
          <div className="chat-nav-item" onClick={() => navigate(`/board/chat/${next.id}`)}>
            <span className="chat-nav-label">▶️ 다음글</span>
            <span className="chat-nav-title">
              {next.isSecret ? '비밀글입니다.' : next.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
