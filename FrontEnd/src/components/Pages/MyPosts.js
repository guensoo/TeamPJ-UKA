import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api/BaseUrl';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.userId) {
            setPosts([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // 1) Board, QnA를 병렬로 조회 → 프론트에서 합침
        Promise.all([
            axios.get(`${BASE_URL}/board`, { params: { userId: user.seq } }),
            axios.get(`${BASE_URL}/customer/qna`, { params: { userId: user.seq } })
        ])
        .then(([boardRes, qnaRes]) => {
            // Board에 type 붙이기
            const boards = (boardRes.data || []).map(post => ({
                ...post,
                type: 'board',
            }));
            // QnA에 type 붙이기
            const qnas = (qnaRes.data || []).map(post => ({
                ...post,
                type: 'qna',
            }));
            // 병합 후 최신순 정렬
            const merged = [...boards, ...qnas].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setPosts(merged);
        })
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="activity-list-section">
            <h3>📝 내가 작성한 글 ({posts.length}개)</h3>
            <div className="post-list">
                {loading ? (
                    <div className="list-empty">로딩 중...</div>
                ) : posts.length === 0 ? (
                    <div className="list-empty">작성한 글이 없습니다.</div>
                ) : posts.map(post => (
                    <div key={post.id || post.qnaNo} className="list-item post-item">
                        <div className="item-content">
                            <h4 className="item-title">{post.title}</h4>
                            <div className="item-meta">
                                <span className="item-date">
                                    {post.createdAt?.slice(0, 10) || post.createAt?.slice(0, 10)}
                                </span>
                                <span className="item-stats">
                                    조회 {post.view ?? post.views ?? 0} · 추천수 {post.likes ?? 0}
                                </span>
                            </div>
                            {/* [선택] 글 종류 표시 */}
                            <span className="item-type">
                                {post.type === 'board' ? '게시판' : 'QnA'}
                            </span>
                        </div>
                        <div className="item-action">
                            <button
                                className="view-btn"
                                onClick={() => {
                                    if (post.type === 'qna') {
                                        // QnA 상세페이지로 이동
                                        window.location.href = `customer/qna/${post.id || post.qnaNo}`;
                                    } else {
                                        // Board 상세페이지로 이동
                                        window.location.href = `/board/all/detail/${post.id}`;
                                    }
                                }}
                            >
                                보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPosts;
