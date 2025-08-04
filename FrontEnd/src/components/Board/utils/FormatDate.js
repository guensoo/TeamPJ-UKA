// 날짜 포맷 함수
export const formatDate = (date) => {
    const d = new Date(date);

    // 한국 시간 (UTC+9)로 보정
    const koreaTime = new Date(d.getTime() + 9 * 60 * 60 * 1000);

    const year = String(koreaTime.getFullYear()).slice(2);
    const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
}

// 날짜 + 시간 포맷 함수 (toLocaleString과 유사한 출력)
export const formatDateTime = (date) => {
    const d = new Date(date);

    // 한국 시간 (UTC+9)로 보정
    const koreaTime = new Date(d.getTime() + 9 * 60 * 60 * 1000);

    // 한국어 로케일 적용하여 날짜 및 시간 포맷
    return koreaTime.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // 오전/오후 표시
    });
};