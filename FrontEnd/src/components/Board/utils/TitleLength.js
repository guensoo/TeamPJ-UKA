//문자열 포인트 기준으로 잘라주는 함수 (한글 = 2, 영어 = 1) 한글 20자리까지, 영어 40자리까지
const TitleLength = (str, maxLength = 40) => {
    let displayLength = 0; //누적된 문자열의 총 포인트
    let result = ''; //잘라서 만들 최종 문자열

    for(const char of str){
        const code = char.charCodeAt(0); //유니코드로 변환
        const isKorean = (code >= 0xac00 && code <= 0xd7a3) || (code >= 0x3131 && code <= 0x318E); //완성형 || 자음
        const charLength = isKorean ? 2 : 1; //한글 유니코드 범위는 0xAC00 ~ 0xD7A3

        if(displayLength + charLength > maxLength){
            result += '...';
            break;
        }

        result += char;
        displayLength += charLength;
    }

    return result;
}

export default TitleLength;