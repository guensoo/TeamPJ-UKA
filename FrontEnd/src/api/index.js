import axios from 'axios';

const api = axios.create({
    baseURL: '/api',           // package.json proxy 옵션이 있다면
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 로그인 시 토큰을 로컬스토리지에서 꺼내 Authorization 헤더에 자동 붙이기
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
