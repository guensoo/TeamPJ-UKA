import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { useAlert } from '../Context/AlertContext';
import 'react-quill/dist/quill.snow.css';
import { fetchQnaDetail, editQna } from '../../../api/CustomerApiData';

const QnAEdit = () => {
	const { id } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const { showAlert } = useAlert();

	const [title, setTitle] = useState(state?.title || '');
	const [content, setContent] = useState(state?.content || '');
	const user = JSON.parse(localStorage.getItem('user'));
	const [isSecret, setIsSecret] = useState(state?.isSecret || false);
	const [password, setPassword] = useState(state?.password || '');

	useEffect(() => {
	if (!state) {
		// QnA 상세를 서버에서 불러와서 폼에 표시
		fetchQnaDetail(id).then(data => {
		setTitle(data.qnaTitle);    // ★ 백엔드 DTO 필드명에 맞게
		setContent(data.qnaContent);
		});
	}
	}, [id, state]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await editQna(id, {
			qnaNo: Number(id),
			qnaTitle: title,
			qnaContent: content,
			qnaWriter: user?.nickname || '익명',
			qnaIsSecret: isSecret ? 'Y' : 'N',
			qnaPassword: isSecret ? password : '',
			qnaIsReported: 'N',
			qnaAnswer: '',
			qnaAnswerWriter: '',
			qnaReportCount: 0
			});

			await showAlert({
			title: '수정완료',
			text: '수정이 완료되었습니다.',
			icon: "success",
			});
			navigate(`/customer/qna/${id}`);
		} catch (err) {
			await showAlert({
			title: '수정 실패',
			text: '서버 오류가 발생했습니다.',
			icon: 'error',
			});
			console.error(err);
		}
		};


    // 취소 버튼 클릭 핸들러 추가
    const handleCancel = () => {
        // 이전 페이지로 돌아가거나, QnA 상세 페이지로 이동
        navigate(`/customer/qna/${id}`);
    };

  return (
    <div className="qna-form">
      <h2>QnA 수정하기</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
          />
        </div>
        <div>
          <label>내용</label><br />
          <ReactQuill
            value={content}
            onChange={setContent}
            style={{
              height: '200px',
              marginBottom: '24px',
              background: '#fff',
              borderRadius: '8px'
            }}
            placeholder="내용을 입력하세요"
          />
        </div>
        <div className="customer-write-button-container">
          <button type="submit" className="qna-action-btn">수정 완료</button>
          <button type="button" className="qna-action-btn" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default QnAEdit;
