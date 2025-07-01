import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888';

const CATEGORY_LABELS = {
    CHAT: '속닥속닥',
    REVIEW: '입양후기',
    qna: 'QnA',
};

const ReportedPosts = () => {
    const navigate = useNavigate();
    const [reportedPosts, setReportedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/admin/report`)
            .then(res => {
                setReportedPosts(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('신고글 불러오기 실패');
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>🚨 신고된 게시글</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p>{error}</p>
            ) : reportedPosts.length === 0 ? (
                <p>신고된 게시글이 없습니다.</p>
            ) : (
                <ul>
                    {reportedPosts.map(post => (
                        <li key={`${post.category}_${post.id}`} className="admin-post" style={{ marginBottom: 16 }}>
                            {/* 카테고리 표시 */}
                            <div style={{ fontWeight: 'bold', color: '#d32f2f', marginBottom: 3 }}>
                                [{CATEGORY_LABELS[post.category] || post.category}]
                            </div>
                            <div
                                className="admin-post-title"
                                onClick={() =>
                                    post.category === 'qna'
                                        ? navigate(`/customer/qna/${post.id}`)
                                        : navigate(`/board/all/detail/${post.id}`)
                                }
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: 17,
                                }}
                            >
                                [신고 누적] {post.title}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReportedPosts;
