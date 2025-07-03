import axios from "axios";

// const API_BASE_URL = "http://localhost:8888";
const API_BASE_URL = "http://192.168.3.24:8888";

// 댓글 작성
export const createComment = async (boardId, comment) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/comment/${boardId}`, comment);
        return res.data;
    } catch (error) {
        console.error(`댓글 등록 실패(boardId: ${boardId}):`, error);
        throw error;
    }
};

// 대댓글 작성
export const createReply = async (parentCommentId, comment) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/comment/reply/${parentCommentId}`, comment);
        return res.data;
    } catch (error) {
        console.error(`대댓글 등록 실패(parentCommentId: ${parentCommentId}):`, error);
        throw error;
    }
};

// 게시글별 댓글 조회
export const fetchCommentsByBoard = async (boardId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/comment/${boardId}`);
        return res.data;
    } catch (error) {
        console.error(`게시글 댓글 조회 실패(boardId: ${boardId}):`, error);
        throw error;
    }
};

// 특정 댓글의 대댓글 조회
export const fetchRepliesByComment = async (parentCommentId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/comment/reply/${parentCommentId}`);
        return res.data;
    } catch (error) {
        console.error(`대댓글 조회 실패(parentCommentId: ${parentCommentId}):`, error);
        throw error;
    }
};

//댓글, 답글 수정
export const updateComment = async (commentId, content) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/comment/${commentId}`, {content});
        return res.data;
    } catch (error) {
        console.error(`댓글/답글 수정 실패(commentId: ${commentId}):`, error);
        throw error;
    }
}

//댓글, 답글 삭제
export const deleteComment = async (commentId) => {
    try {
        await axios.delete(`${API_BASE_URL}/comment/${commentId}`);
    } catch (error) {
        console.error(`댓글/답글 삭제 실패(commentId: ${commentId}):`, error);
        throw error;
    }
}