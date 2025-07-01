import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../Context/AlertContext';

const ReportedPosts = ({ qnas=[] }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const reportedPosts = qnas.filter(q => q.qnaIsReported === 'Y' || q.isReported === true);

  return (
    <div>
      <h2>🚨 신고된 게시글</h2>
      {reportedPosts.length === 0 ? (
        <p>신고된 게시글이 없습니다.</p>
      ) : (
        <ul>
          {reportedPosts.map(post => (
            <li key={post.id} className="admin-post">
              <div
                className="admin-post-title"
                onClick={() => navigate(`/customer/qna/${post.id}`)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                [신고 누적] {post.title}
              </div>
              <div className="admin-post-author">by {post.author}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportedPosts;
