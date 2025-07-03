import { useState } from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
    comments,
    currentUser,
    isAdmin,
    post,
    handleDeleteComment,
    handleDeleteReply,
    saveEditComment,
    saveEditReply,
    replyTargetId,
    setReplyTargetId,
    replyInput,
    setReplyInput,
    handleReplySubmit,
    EditComment,
    EditReply,
    editCommentId,
    editCommentText,
    setEditCommentId,
    setEditCommentText,
    editReplyId,
    editReplyText,
    setEditReplyId,
    setEditReplyText,
}) => {
    // 재귀 렌더링 함수
    const renderCommentTree = (parentId = null, level = 0) => {
        const filtered = comments.filter(c => c.parentCommentId === parentId);
        return filtered.map(comment => (
        <CommentItem
            key={comment.id}
            comment={comment}
            level={level}
            currentUser={currentUser}
            isAdmin={isAdmin}
            post={post}
            editCommentId={editCommentId}
            editCommentText={editCommentText}
            setEditCommentId={setEditCommentId}
            setEditCommentText={setEditCommentText}
            saveEditComment={saveEditComment}
            editReplyId={editReplyId}
            editReplyText={editReplyText}
            setEditReplyId={setEditReplyId}
            setEditReplyText={setEditReplyText}
            saveEditReply={saveEditReply}
            handleDeleteComment={handleDeleteComment}
            handleDeleteReply={handleDeleteReply}
            EditComment={EditComment}
            EditReply={EditReply}
            replyTargetId={replyTargetId}
            setReplyTargetId={setReplyTargetId}
            replyInput={replyInput}
            setReplyInput={setReplyInput}
            handleReplySubmit={handleReplySubmit}
            renderCommentTree={renderCommentTree}
        />
        ));
    };

    return <div>{renderCommentTree()}</div>;
};

export default CommentList;