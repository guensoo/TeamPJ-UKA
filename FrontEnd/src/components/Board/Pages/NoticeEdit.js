import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const NoticeEdit = () => {
  const { id } = useParams();
  const { state } = useLocation(); // ChatDetail에서 전달한 데이터
  const navigate = useNavigate();

  // 상태 초기화 (state가 없을 경우 빈 문자열로 방어 처리)
  const [title, setTitle] = useState(state?.title || '');
  const [content, setContent] = useState(state?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 여기에 실제 API 요청(예: PUT /qna/:id) 들어가야 함
    alert('수정이 완료되었습니다.');

    // 수정된 글 상세페이지로 이동
    navigate(`/board/notice/${id}`);
  };

  return (
    <div className="faq-form">
        <h2>게시글 수정하기</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>제목</label><br />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
                />
            </div>
    <div>
          <label>내용</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button type="submit" className="write-button">✅ 수정 완료</button>
      </form>
    </div>
  );
};

export default NoticeEdit;
