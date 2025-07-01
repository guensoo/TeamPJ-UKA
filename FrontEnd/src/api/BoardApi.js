import axios from "axios";

const API_BASE_URL = 'http://localhost:8888';

// 전체 게시글 조회
export const fetchAllPosts = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/board`);
        return res.data;
    } catch (error) {
        console.error('전체 게시글 조회 실패:', error);
        throw error;
    }
    
};

// 게시글 상세 조회
export const fetchPostById = async (id) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/board/${id}`);
        return res.data;
    } catch (error) {
        console.error(`상세 조회 실패(id: ${id}):`, error);
        throw error;
    }
};

export const toggleLikes  = async (id, increment) => {
    const res = await axios.post(`${API_BASE_URL}/board/${id}/likes`, {}, {params : {increment}});
    return res.data;
};

export const toggleReport  = async (id, increment) => {
    const res = await axios.post(`${API_BASE_URL}/board/${id}/report`, {}, {params : {increment}});
    return res.data;
};

// 게시글 등록
export const createPost = async (newPost) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/board`, newPost);
        return res.data;
    } catch (error) {
        console.error('게시글 등록 실패:', error);
        throw error;
    }
};

// 게시글 수정
export const updatePost = async (id, updatedPost) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/board/${id}`, updatedPost);
        return res.data;
    } catch (error) {
        console.error(`게시글 수정 실패(id: ${id}):`, error);
        throw error;
    }
};

// 게시글 삭제
export const deletePost = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/board/${id}`);
        return res.data;
    } catch (error) {
        console.error(`게시글 삭제 실패(id: ${id}):`, error);
        throw error;
    }
};