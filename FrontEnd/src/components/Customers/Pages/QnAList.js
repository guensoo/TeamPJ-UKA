import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QnAList.css';
import { useAlert } from '../Context/AlertContext';
import { fetchQnaList } from '../../../api/CustomerApiData';
import isAdminCheck from '../../Common/isAdminCheck';

const ITEMS_PER_PAGE = 10;
const PAGE_BUTTON_LIMIT = 5;

const QnAList = () => {
    const navigate = useNavigate();
    const [qnas, setQnas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { showAlert } = useAlert();
    const isAdmin = isAdminCheck();

    const sortedQnAs = [...qnas].sort((a, b) => Number(b.id) - Number(a.id));

    // [1] QnA 전체 조회 - 최초 1회만
    useEffect(() => {
        const getQnas = async () => {
            try {
                const rawData = await fetchQnaList();
                const mapped = rawData.map(q => ({
                    id: q.qnaNo,
                    title: q.qnaTitle,
                    content: q.qnaContent,
                    author: q.qnaWriter,
                    answer: q.qnaAnswer,
                    answerWriter: q.qnaAnswerWriter,
                    isSecret: q.qnaIsSecret === "Y",
                    password: q.qnaPassword,
                    isReported: q.qnaIsReported === "Y",
                    isAnswered: q.qnaIsAnswered === "Y",
                    createdAt: q.qnaCreatedAt,
                    updatedAt: q.qnaUpdatedAt,
                }));
                setQnas(mapped);
            } catch (err) {
                await showAlert?.({
                    title: '오류',
                    text: 'QnA 데이터를 불러오지 못했습니다.',
                    icon: 'error',
                });
            }
        };
        getQnas();
    }, [showAlert]);

    // 페이징 처리
    const totalItems = sortedQnAs.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentQnAs = sortedQnAs.slice(indexOfFirst, indexOfLast);

    // yyyy-mm-dd → yy.mm.dd
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [yyyy, mm, dd] = dateString.split('-');
        return `${yyyy.slice(2)}.${mm}.${dd}`;
    };

    // << < 1 2 3 4 5 > >>
    const getPageRange = () => {
        let start = Math.max(1, currentPage - Math.floor(PAGE_BUTTON_LIMIT / 2));
        let end = start + PAGE_BUTTON_LIMIT - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - PAGE_BUTTON_LIMIT + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // 제목 클릭 시(비밀글 입력창 처리)
    const handleTitleClick = (qna) => {
        // 어드민은 상관없음
        if (isAdmin) {
            navigate(`/customer/qna/${qna.id}`);
            return;
        }
        // 🚫 신고된 글은 이동 금지 (비밀 여부와 상관없이)
        if (!isAdmin && qna.isReported) {
            showAlert && showAlert({
                title: '🚫 관리자 검토중',
                text: '신고가 누적된 글입니다.',
                // imageUrl: process.env.PUBLIC_URL + '/img/badCat.jpg',   // ← 확장자 포함!
                // imageWidth: 300,
                // imageHeight: 300,
                // imageAlt: '조져쓰',
                icon: 'warning', // 주의: imageUrl이 있으면 icon은 무시됨!
            });
            return;
        }
        // 비밀글이면 비밀번호 확인, 아니면 이동
        if (qna.isSecret) {
            handlePasswordConfirm(qna); // ✅ 팝업 바로 실행
        } else {
            navigate(`/customer/qna/${qna.id}`);
        }
    };

    // 비밀번호 확인
    const handlePasswordConfirm = async (qna) => {
        if (isAdmin) {
            navigate(`/customer/qna/${qna.id}`);
            return;
        }
        const result = await showAlert({
            title: '🔒 비밀글입니다',
            text: '비밀번호를 입력해주세요',
            input: 'password',
            inputPlaceholder: '비밀번호',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        });

        // 1. 취소, X, 닫기, 아무것도 입력 안했을 때
        if (!result || result.isDismissed || result.isDenied || !result.isConfirmed) return;

        const password = result.value;
        if (!password) {
            // 입력 안함
            await showAlert({
                title: '⚠️ 비밀번호 입력 필요',
                text: '비밀번호를 입력해주세요.',
                imageUrl: process.env.PUBLIC_URL + '/img/pwWhat.jpg',
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: '비밀번호',
                icon: 'warning',
            });
            return;
        }

        if (password !== qna.password) {
            // 입력했는데 틀림
            await showAlert({
                title: '❌ 비밀번호 오류',
                text: '비밀번호가 틀렸습니다.',
                imageUrl: process.env.PUBLIC_URL + '/img/pwWhat.jpg',
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: '패스워드',
                icon: 'warning',
            });
            return;
        }

        // 맞으면 통과
        window.sessionStorage.setItem(`qna_access_${qna.id}`, 'true');
        navigate(`/customer/qna/${qna.id}`, { state: { password } });
    };

    // 글쓰기 이동
    const handleWrite = () => navigate('/customer/qna/new');

    return (
        <div className="customer-container">
            <div className="customer-controls">
                <button className="qna-action-btn" onClick={handleWrite}>✏️ 글쓰기</button>
            </div>
            <div className="customer-table-container">
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>답변</th>
                            <th>상태</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQnAs.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 50 }}>
                                    등록된 게시글이 없습니다.
                                </td>
                            </tr>
                        ) : currentQnAs.map(qna => (
                            <React.Fragment key={qna.id}>
                                <tr>
                                    <td>{qna.id}</td>
                                    <td
                                        className="title-cell"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: qna.isReported ? '#ff2e2e' : '#222', // 신고면 빨간색, 아니면 기본색
                                            fontWeight: qna.isReported ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleTitleClick(qna)}
                                    >
                                        {qna.isSecret && <span style={{ marginRight: 5, color: '#b19cd9' }}>🔒</span>}
                                        {qna.title}
                                    </td>
                                    <td>{qna.author}</td>
                                    <td style={{ color: qna.isAnswered ? '#00aaff' : '#ff7676' }}>
                                        {qna.isAnswered ? '답변' : '미답변'}
                                    </td>
                                    {/* 👉 여기가 상태 */}
                                    <td
                                        style={{
                                            color: qna.isReported ? '#ff7676'
                                                : qna.isSecret ? '#b19cd9'
                                                    : '#0090dd',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {qna.isSecret && qna.isReported
                                            ? '비밀/신고됨'
                                            : qna.isSecret
                                                ? '비밀'
                                                : qna.isReported
                                                    ? '신고됨'
                                                    : '공개'
                                        }
                                    </td>
                                    <td>
                                        {formatDate(qna.createdAt?.slice(0, 10))}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 페이징 */}
            <div className="pagination">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>&lt;&lt;</button>
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>&lt;</button>
                {getPageRange().map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? 'active' : ''}
                    >{page}</button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>&gt;</button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>&gt;&gt;</button>
            </div>
        </div>
    );
};

export default QnAList;