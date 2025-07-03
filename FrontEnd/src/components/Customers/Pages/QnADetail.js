import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAlert } from '../Context/AlertContext';
import {
    deleteQnaAnswer,
    updateQnaAnswer,
    fetchQnaDetail,
    fetchQnaList,
    reportQna,
    restoreQna,
    deleteQna,
    createQnaComment,
    editQnaComment,
    deleteQnaComment,
    likeQna,
    increaseViewCount,
} from '../../../api/CustomerApiData';
import './QnADetail.css';
import { MapQnaRaw } from '../Mappers/QnaMapper';
import isAdminCheck from '../../Common/isAdminCheck';
import {
    handleLikeAction,
    handleReportAction,
    handleCommentSubmit,
    handleEditSave,
    handleDeleteComment,
} from './QnAActions';
import QnAComment from './QnAComment';

const QnADetail = () => {
    // --- React Router 훅 ---
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const password = location.state?.password ?? null;

    // --- 상태 관리 ---
    const [qna, setQna] = useState(null);
    const [qnaList, setQnaList] = useState([]);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [answerEditMode, setAnswerEditMode] = useState(false);
    const [answerInput, setAnswerInput] = useState('');
    const [isReported, setIsReported] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    // --- 사용자 & 권한 ---
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = isAdminCheck();
    const isOwner = user?.nickname === qna?.author;

    // --- 알림 함수 ---
    const { showAlert } = useAlert();
    const { confirm, success, error, warning } = useAlert();

    // --- fetchData 함수 선언: useEffect 밖에 두어 props로 전달 가능하게 함 ---
    const fetchData = async () => {
        try {
            const rawDetail = await fetchQnaDetail(id, password);
            const mappedDetail = MapQnaRaw(rawDetail);
            setQna(mappedDetail);

            // ✅ 신고 상태
            setIsReported(!!mappedDetail.isReportedByMe);
            console.log('QNA DETAIL API RAW:', rawDetail);
            console.log('QNA DETAIL MAPPED:', mappedDetail);

            // ✅ 추천 상태 (서버 기준)
            setIsLiked(mappedDetail.isLikedByMe === true); // ← 이게 핵심!
            

            // ✅ localStorage는 참고용으로 동기화 (선택)
            const storageKey = `qna_liked_${user?.userId}_${mappedDetail.id}`;
            if (mappedDetail.isLikedByMe) {
                localStorage.setItem(storageKey, 'true');
            } else {
                localStorage.removeItem(storageKey);
            }

            // ✅ 추천 수
            setLikes(mappedDetail.likes || 0);

            // ✅ 리스트 + 이전/다음
            const rawList = await fetchQnaList();
            const mappedList = rawList.map(MapQnaRaw);
            setQnaList(mappedList);

            const idx = mappedList.findIndex(item => String(item.id) === String(id));
            setPrev(idx > 0 ? mappedList[idx - 1] : null);
            setNext(idx >= 0 && idx < mappedList.length - 1 ? mappedList[idx + 1] : null);

            // ✅ 답변 입력창 초기값
            setAnswerInput(mappedDetail.answer || '');

            console.log('QNA DETAIL API RAW:', rawDetail);
        } catch (err) {
            await error('QnA 데이터를 불러오지 못했습니다.');
            navigate('/customer/qna');
        }
    };


useEffect(() => {
    const lastViewTimeKey = `qna_last_view_time_${id}`;
    const now = Date.now();
    const lastViewTime = localStorage.getItem(lastViewTimeKey);

    // ✅ 상위에서 만든 fetchData만 부르기
    fetchData();

    // 조회수 증가 로직
    if (!lastViewTime || now - lastViewTime > 10 * 60 * 1000) {
        (async () => {
            try {
                await increaseViewCount(id);
                await fetchData();
                localStorage.setItem(lastViewTimeKey, now);
            } catch (error) {
                console.error('조회수 증가 중 에러:', error);
            }
        })();
    }
}, [id, password, isLiked]);



    // 날짜 변환 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [date, time] = dateString.split('T');
        const [yyyy, mm, dd] = date.split('-');
        return `${yyyy.slice(2)}.${mm}.${dd}`;
    };

    // 추천 버튼 핸들러
    const handleLike = () => {
        handleLikeAction({
            qna,
            user,
            isLiked,
            setQna,
            setLikes,
            setIsLiked,
            showAlert,
        });
    };
    // 신고 처리 함수
    const handleReport = () => {
        handleReportAction({
            qna,
            user,
            isReported,
            setQna,
            setIsReported,
            showAlert,
        });
    };

    if (!qna) return <p>게시글을 찾을 수 없습니다.</p>;

    // 복원, 삭제, 완전삭제 함수들은 원하는 대로 정의
    const handleRestore = async () => {
        const result = await showAlert({
            title: '복원하시겠습니까?',
            imageUrl: process.env.PUBLIC_URL + '/img/what.jpg',
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: '에?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
        });
        // 취소 시
        if (!result || !result.isConfirmed) return;

        await restoreQna(qna.id);
        const response = await restoreQna(qna.id);
        console.log("복원 결과:", response);
        // QnA 리스트에서 복원 처리 (isReported: false, reportCount: 0)
        setQna(prev => ({
            ...prev,
            isReported: "N", // 또는 false, 백엔드와 일관성 유지
            reportCount: 0
        }));

        // 실제 복원 로직 (API 호출 등)
        await showAlert({
            title: '복원되었습니다.',
            imageUrl: process.env.PUBLIC_URL + '/img/helmetGood.png',
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: '좋았쓰(헬멧)',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false
        });
        navigate(`/customer/qna`);
    };

    // 이전/다음글 네비
    const handleSecretNavigate = async (post) => {
        if (isAdmin) {
            // 어드민은 패스워드 없이 이동
            navigate(`/customer/qna/${post.id}`);
            return;
        }
        if (post.isReported) {
            showAlert && showAlert({
                title: '🚫 관리자 검토중',
                text: '신고가 누적된 글입니다.',
                icon: 'warning',
            });
            return;
        }
        if (post.isSecret) {
            const result = await showAlert({
                title: '🔒 비밀글입니다',
                text: '비밀번호를 입력해주세요',
                icon: 'question',
                input: 'password',
                inputPlaceholder: '비밀번호',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            });
            if (!result || result.isDismissed || result.isDenied || !result.isConfirmed) return;
            const password = result.value;
            if (!password) {
                await showAlert && showAlert({
                    title: '⚠️ 비밀번호 입력 필요',
                    text: '비밀번호를 입력해주세요.',
                    icon: 'warning',
                });
                return;
            }
            if (password !== post.password) {
                await showAlert && showAlert({
                    title: '❌ 비밀번호 오류',
                    text: '비밀번호가 틀렸습니다.',
                    icon: 'warning',
                });
                return;
            }
            // sessionStorage 저장
            window.sessionStorage.setItem(`qna_access_${post.id}`, 'true');
            // **여기서 navigate 할 때 state로 password 반드시 전달**
            navigate(`/customer/qna/${post.id}`, { state: { password } });
        } else {
            navigate(`/customer/qna/${post.id}`);
        }
    };

    // 버튼 핸들러
    const handleEdit = () => {
        if (!(isOwner || isAdmin)) {
            showAlert && showAlert({
                title: '권한이 없습니다.',
                text: '작성자 또는 관리자만 수정 가능합니다.',
                icon: 'error'
            });
            return;
        }
        // 수정 페이지 이동
        navigate(`/customer/qna/${qna.id}/edit`, { state: qna });
    };

    // 삭제 핸들러
    const handleDelete = async () => {
        if (!(isOwner || isAdmin)) {
            await error('작성자 또는 관리자만 삭제 가능합니다.');
            return;
        }

        const result = await confirm({
            title: '삭제하시겠습니까?',
            text: '정말로 이 글을 삭제하시겠습니까?',
            confirmButtonText: '네, 삭제합니다'
        });

        if (!result || !result.isConfirmed) return;

        try {
            await deleteQna(qna.id); // ✅ 실제 삭제 요청
            await showAlert({
                title: '삭제 완료',
                text: '게시글이 삭제되었습니다.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            navigate('/customer/qna');
        } catch (e) {
            await error(e?.response?.data?.message || '삭제 중 오류가 발생했습니다.');
        }
    };

    if (!qna) return <p>게시글을 찾을 수 없습니다.</p>;

    // 관리자 답변 수정(수정 모드로 전환)
    const handleEditAnswer = () => {
        setAnswerEditMode(true);
        setAnswerInput(qna?.answer || "");
    };

    // 답변 저장(수정) 함수
    const handleSaveAnswer = async () => {
        console.log("답변 저장 시점 qna.id:", qna.id, "qna.qnaNo:", qna.qnaNo);
        if (!answerInput.trim()) {
            showAlert && showAlert({
                title: '답변 내용을 입력해주세요!',
                imageUrl: process.env.PUBLIC_URL + '/img/what.jpg',
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: '에?',
                icon: 'warning',
                timer: 1300,
                showConfirmButton: false,
            });
            return;
        }

        const result = await showAlert({
            title: '답변을 저장하시겠습니까?',
            imageUrl: process.env.PUBLIC_URL + '/img/code.jpg',
            imageWidth: 300,
            imageHeight: 250,
            imageAlt: '코딩',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네, 저장합니다',
            cancelButtonText: '아니오',
        });
        if (!result || !result.isConfirmed) return;

        try {
            await updateQnaAnswer(qna.id, answerInput, user.nickname);

            // 서버 저장 후, 상세를 다시 받아서 상태 갱신
            const updated = await fetchQnaDetail(qna.id);
            setQna(MapQnaRaw(updated));
            setAnswerEditMode(false);

            showAlert && showAlert({
                title: '저장되었습니다!',
                imageUrl: process.env.PUBLIC_URL + '/img/helmetGood.png',
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: '좋았쓰(헬멧)',
                icon: 'success',
                timer: 1300,
                showConfirmButton: false,
            });
        } catch (e) {
            showAlert && showAlert({
                title: '답변 저장 실패',
                text: e?.message || '서버 오류',
                icon: 'error'
            });
        }
    };

    // 관리자 답변 삭제
    const handleDeleteAnswer = async () => {
        const result = await showAlert({
            title: '정말 답변을 삭제하시겠습니까?',
            imageUrl: process.env.PUBLIC_URL + '/img/what.jpg',
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: '에?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '네, 삭제합니다',
            cancelButtonText: '아니오',
        });
        if (!result || !result.isConfirmed) return;

        try {
            // ★ 서버에 PATCH로 빈값(삭제)
            await updateQnaAnswer(qna.id, '', '');

            // 서버 반영 후, 상세를 다시 받아와서 상태 갱신
            const updated = await fetchQnaDetail(qna.id);
            setQna(MapQnaRaw(updated));
            setAnswerEditMode(false);

            showAlert && showAlert({
                title: '삭제되었습니다!',
                imageUrl: process.env.PUBLIC_URL + '/img/helmetGood.png',
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: '좋았쓰(헬멧)',
                icon: 'success',
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (e) {
            showAlert && showAlert({
                title: '답변 삭제 실패',
                text: e?.message || '서버 오류',
                icon: 'error'
            });
        }
    };
    if (!qna) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <div className="qna-detail-wrapper">
            {/* 1. 제목 */}
            <div className="qna-detail-title-row"
                style={{
                    minWidth: '800px',
                    height: '50px',
                    alignItems: "flex-end",
                    border: '1px solid #ededed',
                    // borderRadius: 7,
                    background: '#f8f6ff',
                }}>
                <span className="qna-detail-title">{qna.title}</span>
                <div style={{ marginLeft: 15, fontSize: 18, fontWeight: 600 }}>
                    {qna.isReported && <span className="qna-detail-reported" style={{ color: "#ff7676", marginRight: 10 }}>[신고됨]</span>}
                    {qna.isSecret && <span className="qna-detail-secret" style={{ color: "#b19cd9" }}>🔒 비밀글</span>}
                </div>
            </div>
            {/* 2. 정보: 표 */}
            <table style={{
                minWidth: '800px',
                background: '#fafbfc',
                border: '1px solid #ededed',
                borderRadius: 7,
                marginBottom: 10,
                fontSize: 15,
                color: '#444',
                borderCollapse: 'collapse'
            }}>
                <tbody>
                    <tr>
                        <td style={{ background: '#f8f6ff', width: '15%', padding: 9, fontWeight: 700 }}>등록자명</td>
                        <td style={{ background: '#fff', width: '18%', padding: 9 }}>{qna.author}</td>
                        <td style={{ background: '#f8f6ff', width: '15%', padding: 9, fontWeight: 700 }}>등록일</td>
                        <td style={{ background: '#fff', width: '20%', padding: 9 }}>{formatDate(qna.createdAt)}</td>
                        <td style={{ background: '#f8f6ff', width: '13%', padding: 9, fontWeight: 700 }}>조회수</td>
                        <td style={{ background: '#fff', width: '8%', padding: 9 }}>{qna.views ?? 0}</td>
                        <td style={{ background: '#f8f6ff', width: '10%', padding: 9, fontWeight: 700 }}>추천수</td>
                        <td style={{ background: '#fff', width: '8%', padding: 9 }}>{qna.likes ?? 0}</td>
                    </tr>
                </tbody>
            </table>
            {/* 3. 본문 */}
            <div
                className="qna-detail-content"
                style={{
                    fontSize: 17,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: 'inherit',
                    background: 'none',
                    border: 0,
                }}
                dangerouslySetInnerHTML={{ __html: qna.content }}
            />
            {/* 4. 관리자 답변 */}
            {(qna.isAnswered || answerEditMode) && (
                <div className="qna-detail-answer">
                    <div>
                        <h3 style={{
                            display: 'inline',
                            marginRight: 10,
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#222"
                        }}>💬 관리자 답변</h3>
                        {answerEditMode ? (
                            <textarea
                                value={answerInput}
                                onChange={e => setAnswerInput(e.target.value)}
                                placeholder="답변을 입력하세요"
                                style={{
                                    width: '100%',
                                    minHeight: 80,
                                    margin: "12px 0 0 0",
                                    fontSize: 15,
                                    borderRadius: 5,
                                    border: "1px solid #bfbfbf",
                                    padding: 10
                                }}
                            />
                        ) : (
                            <span style={{ fontWeight: 500, fontSize: 16 }}>{qna.answer}</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
                        {isAdmin && !answerEditMode && qna.isAnswered && (
                            <>

                                <button className="qna-action-btn" onClick={handleEditAnswer}>수정</button>
                                <button className="qna-action-btn" onClick={handleDeleteAnswer}>삭제</button>
                            </>
                        )}
                        {isAdmin && answerEditMode && (
                            <>
                                <button className="qna-action-btn" onClick={handleSaveAnswer}>저장</button>
                                <button className="qna-action-btn" onClick={() => setAnswerEditMode(false)}>취소</button>
                            </>
                        )}
                    </div>
                    <div style={{ color: "#aaa", fontSize: 13 }}>
                        {!answerEditMode && qna.answerDate && (
                            <div style={{ color: "#aaa", fontSize: 13 }}>
                                답변일: {qna.answerDate}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* 답변이 없고, 어드민이고, 수정모드 아니면 “답변 작성” 버튼 */}
            {isAdmin && !qna.isAnswered && !answerEditMode && (
                <div style={{ margin: "20px 0" }}>
                    <button className="qna-action-btn" onClick={() => setAnswerEditMode(true)}>
                        답변 작성
                    </button>
                </div>
            )}


            {/* 5. 추천/신고 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '26px 0', gap: 10 }}>
                <button
                    className="qna-detail-recommend-btn"
                    onClick={handleLike}
                    style={{
                        background: isLiked ? "#00aaff" : "",
                        color: isLiked ? "#fff" : "black",
                        cursor: isLiked ? "pointer" : "pointer"
                    }}
                >
                    👍추천
                </button>
                <span style={{ color: '#bbb', fontWeight: 700 }}>|</span>
                <button className="qna-detail-report-btn"
                    style={{
                        background: isReported ? "red" : "",
                        color: isReported ? "#fff" : "black",
                        cursor: isReported ? "not-allowed" : "pointer"
                    }}

                    disabled={isReported}
                    onClick={handleReport}>🚨신고</button>
            </div>


            {/* 6. 수정/삭제/목록 (맨 하단) */}
            <div className="qna-detail-actions" style={{ marginTop: 34 }}>
                {isAdmin && qna.isReported && (
                    <button onClick={handleRestore} className="qna-action-btn">복원</button>
                )}
                <button className="qna-action-btn" onClick={handleEdit}>✏️ 수정</button>
                <button className="qna-action-btn" onClick={handleDelete}>🗑 삭제</button>
                <button className="qna-action-btn" onClick={() => navigate('/customer/qna')}>← 목록</button>
            </div>

            {/* 7. 댓글: 분리된 QnAComment 컴포넌트 사용 (fetchData 넘기기!) */}
            <QnAComment
                comments={qna.comments}
                user={user}
                isAdmin={isAdmin}
                onRegister={async (input, resetInput) => {
                    await handleCommentSubmit({
                        e: { preventDefault: () => { } }, // 이미 QnAComment에서 처리했다고 가정
                        qna,
                        commentInput: input,
                        user,
                        isAdmin,
                        setQna,
                        setCommentInput: resetInput,
                        showAlert,
                        MapQnaRaw,
                    });
                    await fetchData(); // 댓글 등록 후 전체 새로고침
                }}
                handleEditSave={async (commentId, newContent) => {
                    await handleEditSave(commentId, newContent, fetchData, () => { });
                }}
                handleDeleteComment={async (commentId) => {
                    await handleDeleteComment(commentId, fetchData, showAlert);
                }}
            />


            {/* 8. 이전/다음글 네비 */}
            <div className="qna-navigation" style={{ marginTop: 36 }}>
                {prev && (
                    <div className="qna-nav-item" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, background: '#1976d2', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                            ◀
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 700 }}>이전글</span>
                            {/* 신고글, 비밀글, 구분자 */}
                            {prev.isReported && (
                                <span
                                    className="nav-reported"
                                    style={{
                                        color: "#ff7676",
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        marginLeft: 4
                                    }}
                                    onClick={() => {
                                        if (isAdmin) {
                                            navigate(`/customer/qna/${prev.id}`);
                                        } else {
                                            showAlert && showAlert({
                                                title: '🚫 관리자 검토중',
                                                text: '신고가 누적된 글입니다.',
                                                icon: 'warning',
                                            });
                                        }
                                    }}
                                >신고글</span>
                            )}
                            {prev.isReported && prev.isSecret && <span style={{ color: '#bbb' }}> | </span>}
                            {prev.isSecret && (
                                <span
                                    className="nav-secret"
                                    style={{ color: "#b19cd9", fontWeight: 600, cursor: prev.isReported ? 'default' : 'pointer', marginLeft: 4 }}
                                    onClick={prev.isReported ? undefined : () => handleSecretNavigate(prev)}
                                >비밀글</span>
                            )}
                            {!prev.isReported && !prev.isSecret && (
                                <span className="qna-nav-title" style={{ color: "#333", cursor: "pointer", marginLeft: 4 }} onClick={() => handleSecretNavigate(prev)}>
                                    {prev.title}
                                </span>
                            )}
                        </div>
                    </div>
                )}
                {next && (
                    <div className="qna-nav-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: '#1976d2', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                            ▶
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 700 }}>다음글</span>
                            {next.isReported && (
                                <span
                                    className="nav-reported"
                                    style={{
                                        color: "#ff7676",
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        marginLeft: 4
                                    }}
                                    onClick={() => {
                                        if (isAdmin) {
                                            // 👇 어드민은 이동
                                            navigate(`/customer/qna/${next.id}`);
                                        } else {
                                            // 👇 일반 유저는 경고
                                            showAlert && showAlert({
                                                title: '🚫 관리자 검토중',
                                                text: '신고가 누적된 글입니다.',
                                                icon: 'warning',
                                            });
                                        }
                                    }}
                                >신고글</span>
                            )}
                            {next.isReported && next.isSecret && <span style={{ color: '#bbb' }}> | </span>}
                            {next.isSecret && (
                                <span
                                    className="nav-secret"
                                    style={{ color: "#b19cd9", fontWeight: 600, cursor: next.isReported ? 'default' : 'pointer', marginLeft: 4 }}
                                    onClick={next.isReported ? undefined : () => handleSecretNavigate(next)}
                                >비밀글</span>
                            )}
                            {!next.isReported && !next.isSecret && (
                                <span className="qna-nav-title" style={{ color: "#333", cursor: "pointer", marginLeft: 4 }} onClick={() => handleSecretNavigate(next)}>
                                    {next.title}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QnADetail;