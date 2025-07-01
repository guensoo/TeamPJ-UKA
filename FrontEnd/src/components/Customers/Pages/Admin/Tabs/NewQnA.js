import { useNavigate } from 'react-router-dom';

const NewQnA = ({ qnas=[] }) => {
  const navigate = useNavigate();

    const newQnAs = qnas.filter(q => q.qnaIsAnswered !== 'Y');

    return (
        <div>
            <h2>🆕 미답변 QnA</h2>
            {newQnAs.length === 0 ? (
                <p>미답변 QnA가 없습니다.</p>
            ) : (
                <ul>
                    {newQnAs.map(qna => (
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
