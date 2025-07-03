import axios from "axios";

const API_BASE_URL = 'http://localhost:8888';
// const API_BASE_URL = 'http://192.168.3.24:8888';

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
export const fetchPostById = async (id, userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/board/${id}`, {params: {userId}});
        return res.data;
    } catch (error) {
        console.error(`상세 조회 실패(id: ${id}):`, error);
        throw error;
    }
};

// 게시글 조회수 증가
export const incrementViewCount = async (id) => {
    try {
        await axios.post(`${API_BASE_URL}/board/${id}/view`);
    } catch (error) {
        console.error(`조회수 증가 실패(id: ${id}):`, error);
        throw error;
    }
};

//추천 토글
export const toggleLikes  = async (postId, userId) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/board/${postId}/likes`, {userId});
        return res.data;    
    } catch (error) {
        console.error("추천 처리 실패",error);
        throw error;
    }
};

//신고 토글
export const toggleReport  = async (postId, userId) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/board/${postId}/report`, {userId});    
        return res.data;
    } catch (error) {
        console.error("신고 처리 실패",error);
        throw error;
    }
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
        await axios.delete(`${API_BASE_URL}/board/${id}`);
    } catch (error) {
        console.error(`게시글 삭제 실패(id: ${id}):`, error);
        throw error;
    }
};

// 이미지 업로드 (Toast UI Editor 용)
export const uploadImage = async (imageBlob) => {
    try {
        const formData = new FormData();
        formData.append('image', imageBlob);

        const res = await axios.post(`${API_BASE_URL}/board/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        // return res.data.url; 
        // 서버가 돌려주는 이미지 URL
        return `${API_BASE_URL}${res.data.url}`;
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw error;
    }
};

//복원 
export const restorePost = async (id) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/board/${id}/restore`);
        return res.data;
    } catch (error) {
        console.error("복원 실패", error);
        throw error;
    }
}