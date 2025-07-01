import { fetchAndSendAnimals } from '../../../../../api/AnimalApiData';
import { useAlert } from '../../../Context/AlertContext'; // AlertContext 위치에 맞게 import
import './AdminDetail.css';

const DataReset = () => {
    const { showAlert } = useAlert();

    const handleReset = async () => {
        const result = await showAlert({
            title: ` 데이터를 새로 불러오시겠습니까?`,
            text: '진행하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
            imageUrl: process.env.PUBLIC_URL + '/img/code.jpg',
            imageWidth: 300,
            imageHeight: 250,
            imageAlt: '코딩',
        });
        if (!result || !result.isConfirmed) return;

        try {
            // DB에 저장 함수
            await fetchAndSendAnimals();
            await showAlert({
                title: `전체 데이터 불러오기 완료!`,
                imageUrl: process.env.PUBLIC_URL + '/img/goodCat.jpg',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: '좋았쓰',
                icon: 'success'
            });
        } catch (error) {
            await showAlert({
                title: `전체 데이터 불러오기 실패!`,
                text: '데이터 불러오기에 실패했습니다.',
                imageUrl: process.env.PUBLIC_URL + '/img/badCat.jpg',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: '조졌쓰',
                icon: 'error'
            });
        }
    };

    return (
        <div>
            <h2>🔄 데이터 새로고침</h2>
            <p>최신 데이터를 다시 불러오려면 아래 버튼을 클릭하세요.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                    onClick={handleReset}
                    className="data-write-btn"
                    style={{
                        minWidth: 95,
                        padding: '8px 12px',
                        fontSize: '15px',
                        fontWeight: 700,
                        borderRadius: 7,
                        marginBottom: 8,
                        cursor: 'pointer'
                    }}
                >
                    전체
                </button>
            </div>
        </div>
    );
  };

export default DataReset;
