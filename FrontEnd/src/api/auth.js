export async function signup({ userId, nickname, password, email }) {
    const res = await fetch("http://localhost:8888/api/auth/signup", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            userId,
            nickname,
            email,
            password,
        })
    });

    const data = await res.json(); // 한 번만 읽기
    
    if (!res.ok) {
        // 백엔드가 내려준 에러 메시지를 포함한 ErrorResponse 객체에서 message 꺼내 던지기
        throw new Error(data.message || `Signup failed: ${res.status}`);
    }
    return data;
}

export async function login({ userId, password }) {
    const res = await fetch("http://localhost:8888/api/auth/login", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            userId, 
            password 
        })
    });

    const body = await res.json();
    if (!res.ok) {
        throw new Error(body.message || '로그인 실패');
    }

    localStorage.setItem('token', body.token);
    localStorage.setItem('user', JSON.stringify(body.user));
    // console.log(JSON.stringify(body.user))
    
    return body;  // 토큰과 유저를 함께 반환
}

export async function getMe() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
    }

    const res = await fetch('http://localhost:8888/api/auth/me', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    });

    const body = await res.json();
    if (!res.ok) {
        throw new Error(body.message || `회원 정보 조회 실패: ${res.status}`);
    }

    return body;
}

// 예시: 이미 만들어둔 api/auth.js 파일에 추가
export async function checkUserId(userId) {
    const res = await fetch(`http://localhost:8888/api/auth/check-userid?userId=${encodeURIComponent(userId)}`);
    const body = await res.json();
    // 서버에서 { exists: true/false } 또는 { available: true/false }로 응답한다고 가정
    return body;
}

export async function checkEmail(email) {
    const res = await fetch(`http://localhost:8888/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const body = await res.json();
    return body;
}