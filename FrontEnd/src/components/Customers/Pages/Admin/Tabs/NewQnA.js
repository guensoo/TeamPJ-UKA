import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchQnaList } from '../../../../../api/CustomerApiData';

const NewQnA = () => {
    const navigate = useNavigate();
    const [qnaList, setQnaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getQnaList = async () => {
            try {
                const list = await fetchQnaList();
                // filter로 답변 안 된 QnA만 추출

                console.log("list ::", list);
                const unanswered = (list || []).filter(item => item.qnaIsAnswered === 'N');
                console.log("unanswered ::", unanswered);
                setQnaList(unanswered);
                setLoading(false);
            } catch (e) {
                setError('QnA 목록을 불러올 수 없습니다.');
                setLoading(false);
            }
        };
        getQnaList();
    }, []);

    return (
        <div>
            <h2>🆕 미답변 QnA</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p>{error}</p>
            ) : qnaList.length === 0 ? (
                <p>미답변 QnA가 없습니다.</p>
            ) : (
                <ul>
                    {qnaList.map(qna => (
                        <li key={qna.qnaNo} className="admin-post">
                            <div
                                className="admin-post-title"
                                onClick={() => navigate(`/customer/qna/${qna.qnaNo}`)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {qna.qnaIsSecret === 'Y' ? '🔒' : ''} {qna.qnaTitle}
                            </div>
                            <div className="admin-post-author">
                                작성자: {qna.qnaWriter} | 작성일: {qna.qnaCreatedAt && new Date(qna.qnaCreatedAt).toLocaleString()}
                            </div>
                            <div className="admin-post-status">⌛ 미답변</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewQnA;
