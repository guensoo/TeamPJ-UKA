import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FAQEdit from './FAQEdit';
import './FAQList.css';
import { useAlert } from '../Context/AlertContext';
import { useAdmin } from '../../../api/AdminContext';
import { fetchFaqs } from '../../../api/CustomerApiData';
import { deleteFaq } from '../../../api/CustomerApiData';

function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase()
            ? <span key={i} className="highlight">{part}</span>
            : part
    );
}

const FAQList = ({ searchKeyword = "", onDelete = () => { } }) => {
    const [faqList, setFaqList] = useState([]);
    const [openId, setOpenId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // 테스트용
    const {isAdmin} = useAdmin();

    useEffect(() => {
        fetchFaqs().then(setFaqList);
    }, []);

    const toggle = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    // 검색 필터 적용
    const filteredFaqs = faqList.filter(
        faq =>
            faq.faqQuestion.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            faq.faqAnswer.toLowerCase().includes(searchKeyword.toLowerCase())
    );


    // 수정 버튼 클릭 시 모달 열기 or 페이지 이동
    const handleEdit = (faq) => {
        // 모달로 띄울 경우
        setSelectedFaq(faq);
        setShowEditModal(true);

        // or 페이지 이동 방식
        // navigate(`/customer/faq/edit/${faq.id}`, { state: { ...faq } });
    };

    // 삭제
    const handleDelete = async (faqId) => {
        const result = await showAlert({
            title: "정말 삭제할까요?",
            text: "삭제하면 되돌릴 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "네, 삭제",
            cancelButtonText: "아니오"
        });

        if (!result || !result.isConfirmed) return;

        try {
            await deleteFaq(faqId); // ← 여기에서 DB 삭제 API 호출!
            setFaqList(faqList => faqList.filter(f => f.faqId !== faqId)); // 프론트 목록에서도 제거

            await showAlert({
                title: "삭제 완료!",
                icon: "success",
                timer: 1200
            });
        } catch (e) {
            await showAlert({
                title: "삭제 실패",
                text: "서버 오류가 발생했습니다.",
                icon: "error"
            });
        }
    };
    return (
        <div className='faq-container'>
            <div className="faq-list">
                {filteredFaqs.length === 0 ? (
                    <div className="faq-empty">검색 결과가 없습니다.</div>
                ) : filteredFaqs.map((faq) => (
                    <div key={faq.faqId} className="faq-item">
                        <div className="faq-question" onClick={() => toggle(faq.faqId)}>
                            <div className="faq-question-left">
                                <span className="faq-label">Q</span>
                                <span className="faq-text">{highlightKeyword(faq.faqQuestion, searchKeyword)}</span>
                            </div>
                            <button
                                className={`faq-toggle-button ${openId === faq.faqId ? 'open' : ''}`}
                                aria-label="토글"
                            >
                                {openId === faq.faqId ? '▲' : '▼'}
                            </button>
                        </div>
                        {openId === faq.faqId && (
                            <div className="faq-answer">
                                <div className="faq-answer-content">
                                    <span className="faq-label">⮡ A</span>
                                    <span
                                        className="faq-text"
                                        dangerouslySetInnerHTML={{ __html: faq.faqAnswer }}
                                    />
                                </div>
                                {isAdmin && (
                                    <div className="faq-admin-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/customer/faq/edit/${faq.faqId}`, { state: { ...faq } })}
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(faq.faqId)}>🗑️ 삭제</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* 수정 모달 (예시, 모달 컴포넌트 분리 추천) */}
            {showEditModal && selectedFaq && (
                <div className="modal">
                    {/* FAQEditForm 컴포넌트에 데이터 전달 */}
                    <FAQEdit
                        faq={selectedFaq}
                        onClose={() => setShowEditModal(false)}
                    // onSave={...} ← 저장 시 콜백 처리
                    />
                </div>
            )}
        </div>
    );
};

export default FAQList;
