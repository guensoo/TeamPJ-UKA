import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BoardDetail.css';
import { useChat } from '../Context/ChatContext';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {notice} = useChat();

  const [notices, setNotices] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    const noticeId = parseInt(id);
    const sorted = [...notice].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const currentIndex = sorted.findIndex((item) => item.id === noticeId);
    const current = sorted[currentIndex];

    setNotices(current);
    setPrev(sorted[currentIndex - 1] || null);
    setNext(sorted[currentIndex + 1] || null);
  }, [id, notices]);

  if (!notices) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{notices.title}</h2>
      <p>작성자: {notices.author}</p>
      <p>{notices.content}</p>

      <div className="chat-button-group">
        <button
          className="chat-button"
          onClick={() => navigate(`/board/chat/${notices.id}/edit`, { state: notices })}
        >
          ✏️ 수정
        </button>
        <button
          className="chat-button"
          onClick={() => {
            if (window.confirm('삭제하시겠습니까?')) {
              alert('삭제 기능은 아직 구현되지 않았습니다.');
              navigate('/board/notice');
            }
          }}
        >
          🗑 삭제
        </button>
        <button
          className="chat-button"
          onClick={() => navigate('/board/notice')}
        >
          ← 목록으로
        </button>
      </div>

      <div className="chat-navigation">
        {prev && (
          <div className="chat-nav-item" onClick={() => navigate(`/board/notice/${prev.id}`)}>
            <span className="chat-nav-label">◀️ 이전글</span>
            <span className="chat-nav-title">
              {prev.isSecret ? '비밀글입니다.' : prev.title}
            </span>
          </div>
        )}
        {next && (
          <div className="chat-nav-item" onClick={() => navigate(`/board/notice/${next.id}`)}>
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

export default NoticeDetail;
