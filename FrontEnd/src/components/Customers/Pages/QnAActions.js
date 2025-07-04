import { reportQna, likeQna, unlikeQna, fetchQnaDetail, deleteQnaComment, editQnaComment, createQnaComment } from '../../../api/CustomerApiData'; // 실제 API 함수 import
import { MapQnaRaw } from '../Mappers/QnaMapper'; // MapQnaRaw 함수 import
import { useAlert } from '../Context/AlertContext'; // showAlert 함수 import (만약 context 등에서 사용한다면)

// 좋아요 처리 핸들러
export const handleLikeAction = async ({
    qna,
    user,
    isLiked,
    setQna,
    setLikes,
    setIsLiked,
    showAlert,
    setLikeLoading,
}) => {
    if (!user || !user.userId) {
        await showAlert({ title: '로그인이 필요합니다.', icon: 'warning' });
        return;
    }

    const storageKey = `qna_liked_${user.userId}_${qna.id}`;
    let optimisticLiked = !isLiked;

    // 1. **Optimistic update**
    setIsLiked(optimisticLiked);
    setLikes(prev => optimisticLiked ? prev + 1 : Math.max(prev - 1, 0));

    try {
        setLikeLoading?.(true);

        if (isLiked) {
            await unlikeQna(qna.id, user.userId);
            localStorage.removeItem(storageKey);
        } else {
            await likeQna(qna.id, user.userId);
            localStorage.setItem(storageKey, 'true');
        }

        // 2. **서버 동기화 (에러 없으면 skip 가능, 정말 필요할 때만 fetchQnaDetail)**
        // const updated = await fetchQnaDetail(qna.id);
        // const mapped = MapQnaRaw(updated);
        // setQna(mapped);
        // setLikes(mapped.likes || 0);
        // setIsLiked(mapped.isLikedByMe);

    } catch (e) {
        // **에러나면 optimistic rollback**
        setIsLiked(isLiked);
        setLikes(prev => isLiked ? prev + 1 : Math.max(prev - 1, 0));

        if (e.response?.status === 409) {
            await showAlert({ title: '이미 추천하셨습니다.', icon: 'info' });
            setIsLiked(true);
        } else if (e.response?.status === 404) {
            await showAlert({ title: '추천 기록이 없습니다.', icon: 'info' });
            setIsLiked(false);
        } else {
            await showAlert({
                title: '⚠️ 추천 오류',
                text: e.response?.data?.message || '추천 처리 중 오류가 발생했습니다.',
                icon: 'warning',
            });
        }
    } finally {
        setLikeLoading?.(false);
    }
};

// 신고 처리 핸들러
export const handleReportAction = async ({
    qna,
    user,
    isReported,
    setQna,
    setIsReported,
    showAlert,
    setReportLoading,
}) => {
    if (!user || !user.userId) {
        await showAlert({ title: '로그인이 필요합니다.', icon: 'warning' });
        return;
    }

    const storageKey = `qna_reported_${user.userId}_${qna.id}`;
    let optimisticReported = !isReported;

    // 1. Optimistic update
    setIsReported(optimisticReported);

    try {
        setReportLoading?.(true);

        if (isReported) {
            // 보통 신고는 "취소" 기능 없음! (필요시 구현)
            await showAlert({ title: '이미 신고하셨습니다.', icon: 'info' });
        } else {
            await reportQna(qna.id, user.userId);
            localStorage.setItem(storageKey, 'true');
            await showAlert({ title: '신고하였습니다.', icon: 'success', timer: 1200 });
        }

        // 2. 필요하면 서버에서 최신 상태 받아오기
        // const updated = await fetchQnaDetail(qna.id);
        // setQna(MapQnaRaw(updated));

    } catch (e) {
        // 롤백 (Optimistic UI)
        setIsReported(isReported);

        if (e.response?.status === 409) {
            setIsReported(true);
            await showAlert({ title: '이미 신고한 게시글입니다.', icon: 'info' });
        } else {
            await showAlert({
                title: '⚠️ 신고 오류',
                text: e.response?.data?.message || '신고 처리 중 오류가 발생했습니다.',
                icon: 'warning',
            });
        }
    } finally {
        setReportLoading?.(false);
    }
};


// 댓글 등록 핸들러
export async function handleCommentSubmit({
    e,
    qna,
    commentInput,
    user,
    isAdmin,
    setQna,
    setCommentInput,
    showAlert,
    MapQnaRaw
}) {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
        await createQnaComment(qna.qnaNo, {
            qnaId: qna.qnaId,
            qnaCommentWriter: isAdmin ? '관리자' : user.nickname,
            qnaCommentContent: commentInput
        });

        const updated = await fetchQnaDetail(qna.qnaNo);
        setQna(MapQnaRaw(updated));
        setCommentInput('');
    } catch (error) {
        showAlert && showAlert({
            title: '댓글 등록 실패',
            text: '댓글 등록에 실패했습니다.',
            icon: 'error'
        });
    }
}

// 댓글 수정 핸들러
export async function handleEditSave(commentId, newContent, fetchData, setEditingCommentId) {
    await editQnaComment(commentId, newContent);
    await fetchData();
    setEditingCommentId(null);
}

// 댓글 삭제 핸들러
export async function handleDeleteComment(commentId, fetchData, showAlert) {
    const ok = await showAlert({
        title: '댓글 삭제',
        text: '정말 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true, // SweetAlert2, Swal 등에서 확인/취소
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
    });
    if (ok) {
        await deleteQnaComment(commentId);
        await fetchData();
    }
}