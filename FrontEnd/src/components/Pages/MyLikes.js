import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api/BaseUrl';

const MyLikes = () => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.userId && !user?.seq) {
            setLikes([]);
            setLoading(false);
            return;
        }
        setLoading(true);

        // 게시판/질문 모두 좋아요 한 글 병렬 조회 (API가 각각이면 병렬로)
        Promise.all([
            axios.get(`${BASE_URL}/board/likes`, { params: { userId: user.seq } }),
            axios.get(`${BASE_URL}/customer/qna/likes`, { params: { userId: user.seq } }),
        ])
        .then(([boardRes, qnaRes]) => {
            // board와 qna 각각 type 붙여서 합침
            const boards = (boardRes.data || []).map(item => ({
                ...item,
                type: 'board',
            }));
            const qnas = (qnaRes.data || []).map(item => ({
                ...item,
                type: 'qna',
            }));
            // 최신순 정렬
            const merged = [...boards, ...qnas].sort(
                (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
            );
            setLikes(merged);
        })
        .catch(() => setLikes([]))
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>좋아요 목록 불러오는 중...</div>;
    }

    return (
        <div className="activity-list-section">
            <h3>❤️ 좋아요 누른 게시물 ({likes.length}개)</h3>
            <div className="liked-list">
                {likes.length === 0 ? (
                    <div>좋아요 누른 게시물이 없습니다.</div>
                ) : (
                    likes.map((liked, index) => (
                        <div key={liked.id || liked.qnaNo || index} className="list-item liked-item">
                            <div className="item-content">
                                <h4 className="item-title">{liked.title}</h4>
                                <div className="item-meta">
                                    <span className="item-type">
                                        {liked.type === 'board' ? '게시판' : 'QnA'}
                                    </span>
                                    <span className="item-author">
                                        작성자: {liked.author || liked.nickname || liked.userName || '-'}
                                    </span>
                                    <span className="item-date">
                                        {(liked.createdAt || liked.date || '').slice(0, 10)}
                                    </span>
                                    <span className="item-likes">
                                        좋아요 {liked.likes ?? 0}
                                    </span>
                                </div>
                            </div>
                            <div className="item-action">
                                <button
                                    className="unlike-btn"
                                    onClick={() => {
                                        // 좋아요 취소(언라이크) 로직 필요시 구현
                                    }}
                                >❤️</button>
                                <button
                                    className="view-btn"
                                    onClick={() => {
                                        if (liked.type === 'qna') {
                                            window.location.href = `customer/qna/${liked.id || liked.qnaNo}`;
                                        } else {
                                            window.location.href = `/board/all/detail/${liked.id}`;
                                        }
                                    }}
                                >보기</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyLikes;
