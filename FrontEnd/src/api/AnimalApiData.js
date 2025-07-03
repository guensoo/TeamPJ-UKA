const API_URL = process.env.REACT_APP_ALL_ANIMAL_API_URL;
const API_KEY = process.env.REACT_APP_ALL_ANIMAL_API_KEY;

// const BASE_URL = "http://localhost:8888";
const BASE_URL = "http://192.168.3.24:8888";
const PAGE_SIZE = 1000;

/*
    공공데이터 포털 () 사용
    한번에 가져올 수 있는 갯수가 1000개라 1000개씩 가져온 후
    배열에 담고 다음 1000개 가져와서 배열에 붙이는 방식으로 진행
*/
export const fetchRegionData = async () => {
    let pageIndex = 1;
    let allData = [];

    while (true) {
        try {
            const params = {
                serviceKey: API_KEY,
                pageNo: pageIndex,
                numOfRows: PAGE_SIZE,
            };
            const response = await fetch (
                `${API_URL}?serviceKey=${params.serviceKey}&pageNo=${params.pageNo}&numOfRows=${params.numOfRows}&_type=json`
            );

            const json = await response.json();
            const AnimalProtect = json?.response?.body?.items.item;

            // 배열이 아니면 즉 데이터가 없으면 빈 배열로 처리
            const data = Array.isArray(AnimalProtect) &&
                AnimalProtect.length > 1 &&
                AnimalProtect ? AnimalProtect : [];

            if (!data.length) break;

            allData = allData.concat(data);
            pageIndex++;
            
        } catch (error) {
            console.error("API 요청 실패:", error);
            break;
        }
    }
    // JSON 으로 가져온 데이터 확인용
    console.log("JSON ALL DATA 확인 : ", allData);

    return allData;
};

// react 에서 DB에 전체 동물 데이터 넣을때 이거 사용
export const fetchAndSendAnimals = async () => {
    // fetchRegionData 여기서 전체 동물 데이터를 가져옴
    const allData = await fetchRegionData();
    // 가져온 데이터를 백엔드로 전송
    await sendDataToBackend(allData);
};

// 데이터 전체를 백엔드(Spring)로 전송
export const sendDataToBackend = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/api/animals/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        console.log("서버 응답:", result);
        return result;
    } catch (error) {
        console.error("백엔드 전송 실패:", error);
        throw error;
    }
};

// DB에 저장한 동물 전체 데이터 불러오기
export const fetchSavedAnimals = async () => {
//   const token = localStorage.getItem('token');  // 1) 로그인 시 저장한 토큰 꺼내기
//   if (!token) {
//     throw new Error('로그인 토큰이 없습니다.'); 
//   }

    const res = await fetch(`${BASE_URL}/api/animals/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`      // 2) 헤더에 붙여 주기
        }
    });

    if (!res.ok) {
        // 3) 401, 403 같은 에러 처리
        const err = await res.json();
        throw new Error(err.message || '동물 데이터 조회 실패');
    }

    const data = await res.json();
    console.log(data);
    return data;
};
