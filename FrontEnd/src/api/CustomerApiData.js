import axios from 'axios';

// const API_BASE_URL = "http://localhost:8888";
const API_BASE_URL = "http://192.168.3.24:8888";

// FAQ get, post, put, delete 순서
export const fetchFaqs = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/customer/faq`);
        return res.data;
    } catch (error) {
        console.error('fetchFaqs API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createFaq = async (faq) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/customer/faq`, faq);
        return res.data;
    } catch (error) {
        console.error('createFaq API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const editFaq = async (faqId, data) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/customer/faq/${faqId}`, data);
        return res.data;
    } catch (error) {
        console.error('editFaq API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteFaq = async (faqId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/customer/faq/${faqId}`);
        return res.data;
    } catch (error) {
        console.error('deleteFaq API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 전체 리스트 조회
export const fetchQnaList = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/customer/qna`);
        return res.data;
    } catch (error) {
        console.error('fetchQnaList API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const fetchQnaDetail = async (qnaId, password = null, userId = null) => {
    const token = localStorage.getItem('token');

    let url = `${API_BASE_URL}/customer/qna/${qnaId}`;
    const params = new URLSearchParams();

    if (password) params.append("password", password);
    if (userId) params.append("userId", userId);

    if (params.toString()) url += `?${params.toString()}`;

    const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    try {
        const res = await axios.get(url, config);
        return res.data;
    } catch (error) {
        console.error('fetchQnaDetail API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 등록
export const createQna = async (qna) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/customer/qna`, qna);
        return res.data;
    } catch (error) {
        console.error('createQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 수정
export const editQna = async (qnaId, data) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/customer/qna/${qnaId}`, data);
        return res.data;
    } catch (error) {
        console.error('editQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 삭제
export const deleteQna = async (qnaId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/customer/qna/${qnaId}`);
        return res.data;
    } catch (error) {
        console.error('deleteQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 복원
export const restoreQna = async (qnaId) => {
    try {
        const res = await axios.patch(`${API_BASE_URL}/customer/qna/${qnaId}/restore`);
        return res.data;
    } catch (error) {
        console.error('restoreQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 답변 작성/수정 (PUT or PATCH)
export const updateQnaAnswer = async (qnaId, answer, answerWriter) => {
    const token = localStorage.getItem('token');
    const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
    try {
        const res = await axios.patch(
            `${API_BASE_URL}/customer/qna/${qnaId}/answer`,
            { qnaAnswer: answer, qnaAnswerWriter: answerWriter }, // ← DTO 이름 맞춰서!
            config // ← 반드시 헤더 포함!
        );
        return res.data;
    } catch (error) {
        console.error('updateQnaAnswer API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 답변 삭제 (실제로는 빈 문자열로 PATCH)

export const deleteQnaAnswer = async (qnaId) => {
    const token = localStorage.getItem('token');
    const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
    try {
        const res = await axios.patch(
            `${API_BASE_URL}/customer/qna/${qnaId}/answer`,
            { qnaAnswer: '', qnaAnswerWriter: '' },
            config
        );
        return res.data;
    } catch (error) {
        console.error('deleteQnaAnswer API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 댓글 등록
export const createQnaComment = async (qnaId, data) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/customer/qna/${qnaId}/comments`, data);
        return res.data;
    } catch (error) {
        console.error('createQnaComment API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 댓글 수정
export const editQnaComment = async (commentId, newContent) => {
    try {
        const res = await axios.put(
            `${API_BASE_URL}/customer/qna/comments/${commentId}`,
            { qnaCommentContent: newContent }
        );
        return res.data;
    } catch (error) {
        // 에러 로깅 (서버 응답 있으면 메시지, 없으면 그냥 메시지)
        console.error('editQnaComment API 에러:', error.response ? error.response.data : error.message);
        // 필요시 에러 메시지 가공해서 throw 가능
        throw error;
    }
};

// QnA 댓글 삭제
export const deleteQnaComment = async (commentId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/customer/qna/comments/${commentId}`);
        return res.data;
    } catch (error) {
        console.error('deleteQnaComment API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// QnA 조회수 증가
export const increaseViewCount = async (qnaNo) => {
    try {
        const res = await axios.patch(`${API_BASE_URL}/customer/qna/${qnaNo}/increase-view`);
        return res.data;
    } catch (error) {
        console.error('increaseViewCount API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// 추천 기능
export const likeQna = async (qnaId, userId) => {
    console.log('likeQna 호출:', qnaId, userId); // 디버깅용 로그
    try {
        const res = await axios.post(
            `${API_BASE_URL}/customer/qna/${qnaId}/like`,
            { userId } // ← 여기에 같이 담아서 보냄
        );
        return res.data;
    } catch (error) {
        console.error('likeQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// 추천 취소 API 호출 (DELETE 메서드, userId는 요청 본문에 포함)
export const unlikeQna = async (qnaId, userId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/customer/qna/${qnaId}/like`, {
            data: { userId }  // DELETE 요청 시 axios는 data를 이렇게 넘김
        });
        return res.data;
    } catch (error) {
        console.error('unlikeQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// 신고 기능
export const reportQna = async (qnaId, userId) => {
    try {
        const res = await axios.post(
            `${API_BASE_URL}/customer/qna/${qnaId}/report`,
            { userId } // ← 마찬가지로 userId 담아서
        );
        return res.data;
    } catch (error) {
        console.error('reportQna API 에러:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Adoption 이미지 전체 조회
export const fetchAdoptionImages = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/customer/adoption`);
        return res.data; // [{id, type, seq, src}, ...]
    } catch (error) {
        console.error('fetchAdoptionImages 에러:', error.response?.data || error.message);
        throw error;
    }
};

// Adoption 이미지 추가
export const createAdoptionImage = async (image) => {
    console.log('📡 createAdoptionImage 호출됨:', image); // ✅ 여기에 콘솔 찍기
    try {
        const res = await axios.post(`${API_BASE_URL}/customer/adoption`, image);
        console.log('✅ createAdoptionImage 성공:', res.data);
        return res.data;
    } catch (error) {
        console.error('❌ createAdoptionImage 에러:', error.response?.data || error.message);
        throw error;
    }
};

// Adoption 이미지 삭제
export const deleteAdoptionImage = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/customer/adoption/${id}`);
    } catch (error) {
        console.error('deleteAdoptionImage 에러:', error.response?.data || error.message);
        throw error;
    }
};

// Adoption 이미지 수정
export const updateAdoptionImage = async (id, image) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/customer/adoption/${id}`, image);
        return res.data;
    } catch (error) {
        console.error('updateAdoptionImage 에러:', error.response?.data || error.message);
        throw error;
    }
};

// 프론트: 파일 업로드 함수
export const uploadImageFile = async (formData) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/customer/adoption/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    } catch (error) {
        console.error('uploadImageFile 에러:', error.response?.data || error.message);
        throw error; // 상위에서 핸들링 가능하도록 예외 다시 던짐
    }
};
