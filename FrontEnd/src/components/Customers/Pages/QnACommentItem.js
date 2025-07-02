import { useState } from 'react';

const QnACommentItem = ({
    comment,
    user,
    isAdmin,
    handleEditSave,
    handleDeleteComment
}) => {
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState(comment.qnaCommentContent);

    const isMine = isAdmin || comment.qnaCommentWriter === user?.nickname;

    return (
        <div
            style={{
                marginBottom: 10,
                fontSize: 15,
                padding: '12px 0',
                borderBottom: '1px solid #f1f1f1',
            }}
        >
            {/* 작성자 + 날짜 + (수정/삭제) 버튼 한 줄 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <b>{comment.qnaCommentWriter}</b>
                <span style={{ color: "#bbb", fontSize: 13, marginLeft: 8 }}>
                    {comment.qnaCommentCreatedAt?.slice(0, 10)}
                </span>
                {isMine && !editMode && comment.deleted !== "Y" && (
                    <>
                        <button className='customer-comment-action-btn' style={{ marginLeft: 16 }} onClick={() => setEditMode(true)}>
                            수정
                        </button>
                        <button className='customer-comment-action-btn' style={{ marginLeft: 4 }} onClick={() => handleDeleteComment(comment.qnaCommentId)}>
                            삭제
                        </button>
                    </>
                )}
            </div>

            {/* 댓글 내용 or 수정모드 입력창 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode ? (
                    <>
                        <input
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            style={{ marginRight: 8, fontSize: 15, flex: 1 }}
                        />
                        <button onClick={async () => {
                            await handleEditSave(comment.qnaCommentId, editContent);
                            setEditMode(false);
                        }}>저장</button>
                        <button style={{ marginLeft: 4 }} onClick={() => setEditMode(false)}>
                            취소
                        </button>
                    </>
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