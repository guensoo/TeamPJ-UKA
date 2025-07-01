import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useChat } from '../Context/ChatContext';
import './ChatDetail.css';

const AdoptionReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {review} = useChat();

    const [reviews, setReviews] = useState(null);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);

    useEffect(() => {
        const reviewId = parseInt(id);
        const sorted = [...review].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const currentIndex = sorted.findIndex((item) => item.id === reviewId);
        const current = sorted[currentIndex];

        setReviews(current);
        setPrev(sorted[currentIndex - 1] || null);
        setNext(sorted[currentIndex + 1] || null);
    }, [id, review]);

    if (!reviews) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    } 

    // 🔒 비밀글 접근 체크
    if (reviews.isSecret && !window.sessionStorage.getItem(`chat_access_${reviews.id}`)) {
        const input = prompt('🔒 비밀글입니다. 비밀번호를 입력해주세요');
        if (input === reviews.password) {
            window.sessionStorage.setItem(`chat_access_${reviews.id}`, 'true');
        } else {
            alert('❌ 비밀번호가 일치하지 않습니다.');
            navigate('/board/adoptionReview');
            return null;
        }
    }

    const handleSecretNavigate = (post) => {
        if (post.isSecret) {
            const input = prompt('🔒 비밀글입니다. 비밀번호를 입력해주세요');
            if (input === post.password) {
                window.sessionStorage.setItem(`chat_access_${post.id}`, 'true');
                navigate(`/board/adoptionReview/${post.id}`);
            } else {
                alert('❌ 비밀번호가 틀렸습니다.');
            }
        } else {
            navigate(`/board/adoptionReview/${post.id}`);
        }
     };

    return (
        <div style={{ padding: '20px' }}>
            <h2>{reviews.title}</h2>
            <p>작성자: {reviews.author}</p>
            <p>{reviews.content}</p>

            <div className="chat-button-group">
                <button
                    className="chat-button"
                    onClick={() => navigate(`/board/adoptionReview/${reviews.id}/edit`, { state: reviews })}
                    >
                ✏️ 수정
                </button>
                <button
                className="chat-button"
                onClick={() => {
                    if (window.confirm('삭제하시겠습니까?')) {
                    alert('삭제 기능은 아직 구현되지 않았습니다.');
                    navigate('/board/adoptionReview');
                    }
                }}
                >
                🗑 삭제
                </button>
                <button
                className="chat-button"
                onClick={() => navigate('/board/adoptionReview')}
                >
                ← 목록으로
                </button>
        </div>

        <div className="chat-navigation">
                {prev && (
                <div className="chat-nav-item" onClick={() => navigate(`/board/adoptionReview/${prev.id}`)}>
                    <span className="chat-nav-label">◀️ 이전글</span>
                    <span className="chat-nav-title">
                    {prev.isSecret ? '비밀글입니다.' : prev.title}
                    </span>
                </div>
                )}
                {next && (
                <div className="chat-nav-item" onClick={() => navigate(`/board/adoptionReview/${next.id}`)}>
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

export default AdoptionReviewDetail;
