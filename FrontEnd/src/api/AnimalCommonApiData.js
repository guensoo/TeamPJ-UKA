const API_KEY = process.env.REACT_APP_ALL_ANIMAL_API_KEY;
const PAGE_SIZE = 50;
const pageIndex = 1;

// 	시도 API 호출
// 시도 API를 통해 전체 시도 목록을 가져옵니다.
export const SidoApiData = async () => {
    const API_URL = process.env.REACT_APP_ALL_SIDO_API_URL;
    
    try {
        const params = {
            serviceKey: API_KEY,
            numOfRows: PAGE_SIZE,
            pageNo: pageIndex,
        };

        console.log("API_URL : ", API_URL);
        console.log("params.serviceKey : ", params.serviceKey);
        const response = await fetch (
            `${API_URL}?serviceKey=${params.serviceKey}&pageNo=${params.pageNo}&numOfRows=${params.numOfRows}&_type=json`
        );

        const json = await response.json();
        const SidoData = json?.response?.body?.items.item;

        return SidoData;
    } catch (error) {
        return console.error("API 요청 실패:", error);
    }
};

// 시군구 API 호출
// orgCd를 통해 해당 시군구의 동물 보호소 정보를 가져옵니다.
export const siGunGu = async (orgCd) => {
    const API_URL = process.env.REACT_APP_ALL_SIGUNGU_API_URL;

    try {
        const params = {
            serviceKey: API_KEY,
            numOfRows: PAGE_SIZE,
            pageNo: 1,
            orgCd: orgCd,
        };
        const response = await fetch (
            `${API_URL}?serviceKey=${params.serviceKey}&pageNo=${params.pageNo}&numOfRows=${params.numOfRows}&orgCd=${params.orgCd}&_type=json`
        );

        const json = await response.json();
        return json?.response?.body?.items.item || [];
    } catch (error) {
        console.error("API 요청 실패:", error);
        return [];
    }
}