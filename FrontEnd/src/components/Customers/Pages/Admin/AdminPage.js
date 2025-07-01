import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './AdminPage.css';

import FAQForm from './Tabs/FAQForm';
import ReportedPosts from './Tabs/ReportPosts';
import ReportedComments from './Tabs/ReportComments';
import NewQnA from './Tabs/NewQnA';
import DataReset from './Tabs/DataReset';

const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <h2 style={{ textAlign: 'center' }}>관리자 메뉴</h2>
                <ul>
                    <li>
                        <button onClick={() => navigate('/admin/reported')} style={{ fontSize: '20px' }}>
                            🚨 신고된 게시글
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/comment')} style={{ fontSize: '20px' }}>
                            💬 신고된 댓글
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/newqna')} style={{ fontSize: '20px' }}>
                            ❓ 미답변 QnA
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/faqform')} style={{ fontSize: '20px' }}>
                            📄 FAQ 작성하기
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/reset')} style={{ fontSize: '20px' }}>
                            🔄 데이터 새로고침
                        </button>
                    </li>
                </ul>
            </div>

            <div className="admin-main">
                <Routes>
                <Route path="reported" element={<ReportedPosts />} />
                <Route path="comment" element={<ReportedComments />} />
                <Route path="newqna" element={<NewQnA />} />
                <Route path="faqform" element={<FAQForm />} />
                <Route path="reset" element={<DataReset />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
