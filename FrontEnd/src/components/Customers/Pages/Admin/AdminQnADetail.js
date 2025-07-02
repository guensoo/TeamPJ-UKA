import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchQnaDetail } from '../../../../api/CustomerApiData';
import { useAlert } from '../../Context/AlertContext';
import { editQna } from '../../../../api/CustomerApiData';
import './AdminQnADetail.css';

const AdminQnADetail = () => {
    const { qnaNo } = useParams(); // 라우터 파라미터
    const [qna, setQna] = useState(null);
    const [answer, setAnswer] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchQnaDetail(qnaNo).then(data => {
            setQna(data);
            setAnswer(data.qnaAnswer || '');
        });
    }, [qnaNo]);

    const handleAnswerSubmit = async () => {
        await editQna(qnaNo, { qnaAnswer: answer, qnaIsAnswered: 'Y' });
        setQna(prev => ({ ...prev, qnaAnswer: answer, qnaIsAnswered: 'Y' }));
        setIsEditing(false);
        await showAlert({
            title: '답변이 저장되었습니다!',
            imageUrl: process.env.PUBLIC_URL + '/img/goodCat.jpg',
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: '좋았쓰',
            icon: 'success'
        });
    };

    return (
        <div>
            <h2>QnA 답변</h2>
            <p><strong>질문:</strong> {qna.title}</p>
            <p>세부내용 : {qna.content}</p>

            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변 내용을 입력하세요"
                rows={5}
                cols={50}
            />
            <br />
            <div className="qna-admin-buttons">
                {!qna.isAnswered || isEditing ? (
                    <button className="qna-save-btn" onClick={handleAnswerSubmit}>
                        답변 저장
                    </button>
                ) : (
                    <button className="qna-edit-btn" onClick={() => setIsEditing(true)}>
                        답변 수정
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminQnADetail;
