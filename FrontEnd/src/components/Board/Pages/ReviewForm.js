import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormButton.css';

const ReviewForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('게시글 작성됨:', { title, content });
        navigate('/board/adoptionReview');
    };

    return (
        <div className="faq-form">
        <h2>게시글 글쓰기</h2>
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
            <button type="submit" className="write-button">등록</button>
        </form>
        </div>
    );
};

export default ReviewForm;
