import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FAQEdit from './FAQEdit';
import './FAQList.css';
import { useAlert } from '../Context/AlertContext';
import { useAdmin } from '../../../api/AdminContext';
import { fetchFaqs } from '../../../api/CustomerApiData';
import { deleteFaq } from '../../../api/CustomerApiData';

// const dummyFaqs = [
//   { id: 1, question: '입양 절차는 어떻게 되나요?', answer: '입양 절차는 상담 → 서류 작성 → 방문 순입니다.' },
//   { id: 2, question: '봉사 신청은 어디서 하나요?', answer: '봉사 신청은 마이페이지 → 봉사 신청 탭에서 가능합니다.' },
//   { id: 3, question: '입양 시 준비물은 무엇이 있나요?', answer: '배변패드, 침대쿠션, 밥그릇, 물그릇, 이전에 먹던 사료, 약간의 간식 등이 있습니다.' },
//   { id: 4, question: '제게 맞는 견종은 어떻게 알 수 있나요?', answer: '입양하기에서 자체 진단표를 통해 확인하실 수 있습니다.' },
//   { id: 5, question: '입양 시 서류는 무엇이 필요한가요?', answer: '반려동물 매매계약서를 비롯해 허가증을 보아야 합니다.' },
//   { id: 6, question: '반려동물을 데려온 후 피해를 입었어요', answer: `- 데려온 날로부터 15일 이내 폐사 시 : \nᅟ⮡ 같은 종류의 반려동물로 교환 또는 입양 비용 환불\n\n- 데려온 날로부터 15일 이내 질병 발생 시 : \nᅟ⮡ 판매업소(사업자)가 제반 비용을 부담해서 회복시킨 후 소비자에게 인도 하는 방법이 있습니다.` },
//   { id: 7, question: '반려동물 수수료는 어떻게 되나요?', answer: '- 내장형 등록 인식표｜무료~8만원(서울시 1만원)\n- 외장형 등록 인식표 4만원 이내로 예상됩니다.' },
//   { id: 8, question: '주민등록상 거주지가 아닌 곳에서도 동물등록신청이 가능한가요?', answer: '타 지역 거주민이 신청을 하는 경우에도 신청을 받은 시·군·구청에서 동물등록 처리 및 동물등록증 발급 가능합니다.' },
//   { id: 9, question: '반려동물을 데려오고 나서 가족의 반대가 있어서 파양해야 할 것 같아요', answer: '반려동물 파양은 신중하게 결정해야 할 문제입니다.\n부득이한 사정으로 파양하게 될 경우 동물보호소 연락, 주변 지인에게 무료 분양 등을 활용하여 주시길 바랍니다.' },
//   // { id: 10, question: '', answer: '' },
//   // { id: 11, question: '', answer: '' },
//   // { id: 12, question: '', answer: '' },
//   // { id: 13, question: '', answer: '' },
// ];

function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase()
            ? <span key={i} className="highlight">{part}</span>
            : part
    );
}

const FAQList = ({ searchKeyword = "", onDelete = () => {} }) => {
  const [faqList, setFaqList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 테스트용
  const isAdmin = useAdmin();

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
