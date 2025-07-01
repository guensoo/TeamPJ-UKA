import { useState } from 'react';
import QnACommentItem from './QnACommentItem';

const QnAComment = ({
  comments,
  user,
  isAdmin,
  onRegister,       // 댓글 등록 함수 (handleCommentSubmit 등)
  handleEditSave,   // 댓글 수정 함수
  handleDeleteComment, // 댓글 삭제 함수
}) => {
  const [commentInput, setCommentInput] = useState('');

  return (
    <div style={{ margin: "35px 0 0 0" }}>
      <h4 style={{ marginBottom: 12, fontWeight: 700, fontSize: 17 }}>
        댓글 <span style={{ color: '#b19cd9' }}>({comments ? comments.length : 0})</span>
      </h4>

      <div style={{ marginLeft: 3 }}>
        {(!comments || comments.length === 0) && (
          <div style={{ color: "#aaa" }}>등록된 댓글이 없습니다.</div>
        )}

        {comments && comments.map(c => (
          <QnACommentItem
            key={c.qnaCommentId}
            comment={c}
            user={user}
            isAdmin={isAdmin}
            handleEditSave={handleEditSave}
            handleDeleteComment={handleDeleteComment}
          />
        ))}
      </div>

      <form style={{ display: "flex", gap: 8, marginBottom: 18, marginTop: 12 }} onSubmit={e => {
        e.preventDefault();
        onRegister(commentInput, setCommentInput);
      }}>
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          style={{
            flex: 1,
            border: "1px solid #b19cd9",
            borderRadius: 7,
            fontSize: 16,
            padding: "8px 14px"
          }}
        />
        <button type="submit" className="qna-detail-recommend-btn">등록</button>
      </form>
    </div>
  );
};

export default QnAComment;
