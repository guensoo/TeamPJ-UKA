const CommentItem = ({
    comment,
    level,
    currentUser,
    post,
    isAdmin,
    editCommentId,
    editCommentText,
    setEditCommentText,
    saveEditComment,
    editReplyId,
    editReplyText,
    setEditCommentId,
    setEditReplyId,
    setEditReplyText,
    saveEditReply,
    handleDeleteComment,
    handleDeleteReply,
    EditComment,
    EditReply,
    replyTargetId,
    setReplyTargetId,
    replyInput,
    setReplyInput,
    handleReplySubmit,
    renderCommentTree,
}) => {
    // console.log("author: ",comment.author)
    // console.log("currentUser: ",currentUser)
    // console.log("post.author:", post.author)
    return (
        <div style={{ marginLeft: level > 0 ? 20 : 0, marginBottom: 12 }}>
        <div style={{ fontSize: 15 }}>
            <b>
            {comment.author}
            {comment.author === post.author && ' (작성자)'}
            {comment.author.includes('admin') && ' (관리자)'}
            </b>
            <span style={{ marginLeft: 6, color: '#bbb', fontSize: 13 }}>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt ? `수정됨 ${new Date(comment.updatedAt).toLocaleString()}` : new Date(comment.createdAt).toLocaleString()}
            </span>
        </div>
        {/* 수정 */}
        <div>
            {editCommentId === comment.id || editReplyId === comment.id ? (
            <>
                <input
                type="text"
                value={editCommentId === comment.id ? editCommentText : editReplyText}
                onChange={e => {
                    if (editCommentId === comment.id) setEditCommentText(e.target.value);
                    else setEditReplyText(e.target.value);
                }}
                style={{
                    fontSize: 14,
                    padding: '6px 12px',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    width: '60%',
                    marginTop: 6,
                }}
                />
                <button className="board-detail-comment-button"
                    onClick={() => {
                        if (editCommentId === comment.id) saveEditComment(editCommentId,editCommentText);
                        else saveEditReply();
                    }}
                    style={{ cursor: 'pointer' }}
                >
                등록
                </button>
                <button className="board-detail-comment-button"
                    onClick={() => {
                        setEditCommentId(null);
                        setEditReplyId(null);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                취소
                </button>
            </>
            ) : (
            <>
                <div style={{ fontSize: 14, marginTop: 4 }}>{comment.content}</div>
                {(isAdmin || comment.author === currentUser) && (
                <>
                    <button
                    onClick={() =>{
                        if (comment.parentCommentId) {
                            EditReply(comment);
                        } else {
                            EditComment(comment);
                        }
                    }}
                    style={{
                        fontSize: 13,
                        marginLeft: 4,
                        background: 'none',
                        border: 'none',
                        color: '#0984e3',
                        cursor: 'pointer',
                    }}
                    >
                    ✏️ 수정
                    </button>
                    <button
                    onClick={() =>
                        comment.parentCommentId
                        ? handleDeleteReply(comment.id)
                        : handleDeleteComment(comment.id)
                    }
                    style={{
                        fontSize: 13,
                        marginLeft: 6,
                        background: 'none',
                        border: 'none',
                        color: '#e17055',
                        cursor: 'pointer',
                    }}
                    >
                    🗑 삭제
                    </button>
                </>
                )}
            </>
            )}
        </div>

        {/* ↪ 답글 버튼 */}
        <button
            onClick={() => setReplyTargetId(prev => (prev === comment.id ? null : comment.id))}
            style={{
            fontSize: 13,
            marginTop: 6,
            background: 'none',
            border: 'none',
            color: '#6c5ce7',
            cursor: 'pointer',
            }}
        >
            ↪ 답글
        </button>

        {/* 답글 입력창 */}
        {replyTargetId === comment.id && (
            <form
                onSubmit={e => handleReplySubmit(e, comment.id)}
                style={{ display: 'flex', gap: 8, marginTop: 6 }}
            >
            <input
                type="text"
                placeholder="답글을 입력하세요"
                value={replyInput[comment.id] || ''}
                onChange={e =>{
                    setReplyInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                }
                style={{
                // flex: 1,
                width: '50%',
                border: '1px solid #ccc',
                borderRadius: 7,
                fontSize: 14,
                padding: '6px 12px',
                }}
            />
            <button type="submit" className="board-detail-submit-button">
                등록
            </button>
            </form>
        )}

        {/* 🔁 재귀 호출 */}
        {renderCommentTree(comment.id, level + 1)}
        </div>
    );
};

export default CommentItem;