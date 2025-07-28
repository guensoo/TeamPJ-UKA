import { useState } from 'react';

const QnACommentItem = ({
    comment,
    user,
    isAdmin,
    handleEditSave,
    handleDeleteComment,
    handleHideComment, // 관리자만 전달
}) => {
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState(comment.qnaCommentContent);

    // 본인 여부
    const isOwner = user?.nickname === comment.qnaCommentWriter;

    return (
        <div
            style={{
                marginBottom: 10,
                fontSize: 15,
                padding: '12px 0',
                borderBottom: '1px solid #f1f1f1',
            }}
        >
            {/* 작성자 + 날짜 + (수정/삭제/숨김) 버튼 한 줄 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <b>{comment.qnaCommentWriter}</b>
                <span style={{ color: "#bbb", fontSize: 13, marginLeft: 8 }}>
                    {comment.qnaCommentCreatedAt?.slice(0, 10)}
                </span>
                {/* 관리자 */}
                {isAdmin && !editMode && comment.deleted !== "Y" && (
                    <>
                        <button className='customer-comment-action-btn' style={{ marginLeft: 16 }} onClick={() => handleHideComment(comment.qnaCommentId)}>
                            숨김
                        </button>
                        <button className='customer-comment-action-btn' style={{ marginLeft: 4 }} onClick={() => handleDeleteComment(comment.qnaCommentId)}>
                            삭제
                        </button>
                    </>
                )}
                {/* 일반 사용자 본인 */}
                {!isAdmin && isOwner && !editMode && comment.deleted !== "Y" && (
                    <>
                        <button
                            className='customer-comment-action-btn'
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                setEditContent(comment.qnaCommentContent); // ← 매번 원본으로 초기화!
                                setEditMode(true);
                            }}
                        >
                            수정
                        </button>
                        <button className='customer-comment-action-btn' style={{ marginLeft: 4 }} onClick={() => handleDeleteComment(comment.qnaCommentId)}>
                            삭제
                        </button>
                    </>
                )}
                {/* 아무 조건도 아니면 버튼 없음 */}
            </div>

            {/* 댓글 내용 or 수정모드 입력창 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode ? (
                    <form
                        style={{
                            display: "flex",
                            gap: 8,
                            margin: "6px 0 12px 0",
                            width: "100%",
                        }}
                        onSubmit={async e => {
                            e.preventDefault();
                            await handleEditSave(comment.qnaCommentId, editContent);
                            setEditMode(false);
                        }}
                    >
                        <input
                            type="text"
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            style={{
                                flex: 1,
                                border: "1px solid #b19cd9",
                                borderRadius: 7,
                                fontSize: 16,
                                padding: "8px 14px",
                                width: "30px",
                            }}
                            autoFocus
                        />
                        <button type="submit" className="qna-action-btn">저장</button>
                        <button
                            type="button"
                            className="qna-action-btn cancel"
                            onClick={() => setEditMode(false)}
                        >취소</button>
                    </form>
                ) : (
                    comment.deleted === "Y"
                        ? <span style={{ color: "#888" }}><del>관리자에 의해 삭제된 댓글입니다.</del></span>
                        : <span style={{ marginRight: 10 }}>{comment.qnaCommentContent}</span>
                )}
            </div>
        </div>
    );
};

export default QnACommentItem;
