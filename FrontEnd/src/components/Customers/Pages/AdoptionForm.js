import { useState, useRef, useEffect } from 'react';
import { X, Download, Printer, FileText, User, Heart, CheckCircle } from 'lucide-react';
import './AdoptionForm.css'; // Assuming you have a CSS file for styles
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAlert } from '../Context/AlertContext';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// const API_BASE_URL = "http://localhost:8888";
const API_BASE_URL = "http://192.168.3.24:8888";
const initialForm = {
    applicantName: '',
    address: '',
    phone: '',
    age: '',
    animalInfo: '',
    familyAgreement: '',
    hasPetExperience: '',
    pastPetDetails: '',
    pastPetFate: '',
    hasCurrentPet: '',
    currentPetDetails: '',
    houseType: '',
    houseTypeEtc: '',
    movingPlan: '',
    futurePlan: '',
    signature: '',
};

function AdoptionApplicationForm({ animalInfo, animalImgUrl, onClose }) {
    const pdfRef = useRef();
    const { showAlert } = useAlert();

    const [form, setForm] = useState({
        ...initialForm,
        animalRescueNo: animalInfo?.desertionNo || '',
        animalBreed: animalInfo?.kindFullNm || '',
        animalAge: animalInfo?.age || '',
        animalWeight: animalInfo?.weight || '',
        animalGender: animalInfo?.sexCd || '',
        animalImgUrl: animalImgUrl || '',
    });
    useEffect(() => {
        if (!animalImgUrl) return;

        // 1. base64라면 프록시 fetch 절대 안 탐 (431 차단)
        if (animalImgUrl.startsWith('data:')) {
            setForm(f => ({ ...f, animalImgUrl }));
            return;
        }

        // 2. 외부 url이면 프록시 경유 fetch 후 base64 변환
        const proxied = `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(animalImgUrl)}`;
        fetch(proxied)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setForm(f => ({ ...f, animalImgUrl: reader.result }));
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                setForm(f => ({ ...f, animalImgUrl: '' }));
            });
    }, [animalImgUrl]);

    console.log(form.animalRescueNo);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onRadio = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSavePDF = async () => {
        setShowAll(true);
        setTimeout(async () => {
            const input = pdfRef.current;
            if (!input) return;
            setIsSubmitting(true);

            // 이미지 모두 로드 대기
            const images = input.querySelectorAll("img");
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(res => { img.onload = img.onerror = res; });
            }));

            try {
                const canvas = await html2canvas(input, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;

                while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    position -= pageHeight;
                }

                pdf.save('adoption-form.pdf');
                await showAlert({ title: "PDF가 저장되었습니다!", icon: "success" });
            } catch {
                await showAlert({ title: "PDF 저장에 실패했습니다.", icon: "error" });
            }
            setIsSubmitting(false);
            setShowAll(false);
        }, 0);
    };


    const handleDownloadEmpty = async () => {
        const original = { ...form };
        setForm(initialForm);
        setTimeout(() => {
            handleSavePDF();
            setForm(original);
        }, 350);
    };

    console.log('animalImgUrl:', animalImgUrl);

    const handlePrint = () => {
        window.print();
    };

    const steps = [
        { id: 1, title: <>인적<br />사항</>, icon: User },
        { id: 2, title: <>동물<br />정보</>, icon: Heart },
        { id: 3, title: <>체크<br />리스트</>, icon: CheckCircle },
        // { id: 4, title: <>체크<br />리스트</>, icon: CheckCircle },
        { id: 4, title: '완료', icon: FileText }
    ];

    return (
        <div className="adoption-form-modal">
            <div className="adoption-form-container">
                {/* 모달 헤더 */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '24px',
                    position: 'relative',
                    borderRadius: '12px 12px 0 0'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <X size={20} />
                    </button>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>입양 신청서</h2>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>사랑스러운 반려동물과의 새로운 시작을 위해 정성껏 작성해주세요.</p>
                </div>

                {/* 진행 단계 */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '20px 20px',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        textAlign: 'center',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        border: '2px solid',
                                        borderColor: isActive ? '#007bff' : isCompleted ? '#28a745' : '#dee2e6',
                                        background: isActive ? '#007bff' : isCompleted ? '#28a745' : 'white',
                                        color: isActive || isCompleted ? 'white' : '#6c757d',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <Icon size={18} />
                                    </div>
                                    <span style={{
                                        marginLeft: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        // minWidth: '10px',
                                        color: isActive ? '#007bff' : isCompleted ? '#28a745' : '#6c757d'
                                    }}>
                                        {step.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div style={{
                                            width: '60px',
                                            height: '2px',
                                            margin: '0 16px',
                                            background: isCompleted ? '#28a745' : '#dee2e6',
                                            transition: 'background 0.3s ease'
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 스크롤 가능한 콘텐츠 영역 */}
                <div className="adoption-form-content" ref={pdfRef}>
                    {showAll ? (
                        <>
                            {/* 1단계: 인적사항 */}
                            <div>
                                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={20} /> 인적사항
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <input type="text" name="applicantName" value={form.applicantName} onChange={onChange} placeholder="이름" />
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="연락처 (010-0000-0000)" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <input type="text" name="address" value={form.address} onChange={onChange} placeholder="주소" />
                                </div>
                            </div>

                            {/* 2단계: 동물정보 */}
                            <div>
                                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Heart size={20} /> 동물정보
                                </div>
                                <div className="section-content section-animal">
                                    {form.animalRescueNo && form.animalBreed ? (
                                        <div className="animal-info-card">
                                            <img
                                                src={
                                                    !form.animalImgUrl
                                                        ? `${API_BASE_URL}/api/placeholder/80/100`
                                                        : form.animalImgUrl.startsWith('http')
                                                            ? `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(form.animalImgUrl)}`
                                                            : form.animalImgUrl
                                                }
                                                crossOrigin="anonymous"
                                                alt="입양 동물"
                                                className="animal-image"
                                            />
                                            <div className="animal-details">
                                                <div><strong>보호번호:</strong> {form.animalRescueNo || '미지정'}</div>
                                                <div><strong>품종:</strong> {form.animalBreed || '품종 정보 없음'}</div>
                                                <div><strong>나이:</strong> {form.animalAge || '품종 정보 없음'}</div>
                                                <div><strong>체중:</strong> {form.animalWeight || '품종 정보 없음'}</div>
                                                <div><strong>성별:</strong> {form.animalGender || '품종 정보 없음'}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                            <div style={{ marginBottom: 16, color: '#888', fontSize: 17 }}>선택한 동물 정보가 없습니다.</div>
                                            <button
                                                className="form-button primary"
                                                style={{ padding: '10px 22px', fontWeight: 600, fontSize: 15 }}
                                                onClick={() => {
                                                    if (onClose) onClose();
                                                    window.location.href = '/about';
                                                }}
                                            >
                                                동물 찾으러 가기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3단계: 체크리스트 */}
                            <div>
                                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={20} /> 체크리스트
                                </div>
                                <div className="section-content section-checklist">
                                    {/* 가족 동의 */}
                                    <div className="checklist-item">
                                        <div className="checklist-question">입양 결정에 가족 모두 동의하십니까?</div>
                                        <div className="checklist-options">
                                            <label>
                                                <input type="radio" name="familyAgreement" value="예" checked={form.familyAgreement === '예'} onChange={onRadio} /> 예
                                            </label>
                                            <label>
                                                <input type="radio" name="familyAgreement" value="아니오" checked={form.familyAgreement === '아니오'} onChange={onRadio} /> 아니오
                                            </label>
                                        </div>
                                    </div>
                                    {/* 반려동물 경험 */}
                                    <div className="checklist-item">
                                        <div className="checklist-question">반려동물을 키워 보신 적이 있습니까?</div>
                                        <div className="checklist-options">
                                            <label>
                                                <input type="radio" name="hasPetExperience" value="예" checked={form.hasPetExperience === '예'} onChange={onRadio} /> 예
                                            </label>
                                            <label>
                                                <input type="radio" name="hasPetExperience" value="아니오" checked={form.hasPetExperience === '아니오'} onChange={onRadio} /> 아니오
                                            </label>
                                        </div>
                                    </div>
                                    {form.hasPetExperience === '예' && (
                                        <div className="conditional-section">
                                            <div className="form-group">
                                                <div className="checklist-question">과거에 키운 반려동물의 종류와 수는?</div>
                                                <input type="text" name="pastPetDetails" value={form.pastPetDetails} onChange={onChange} placeholder="예: 강아지 2마리, 고양이 1마리" />
                                            </div>
                                            <div className="form-group">
                                                <div className="checklist-question">과거에 키운 반려동물은 어떻게 되었나요?</div>
                                                <input type="text" name="pastPetFate" value={form.pastPetFate} onChange={onChange} placeholder="자세히 설명해주세요" />
                                            </div>
                                        </div>
                                    )}
                                    {/* 현재 반려동물 */}
                                    <div className="checklist-item">
                                        <div className="checklist-question">현재 반려동물을 키우고 계십니까?</div>
                                        <div className="checklist-options">
                                            <label>
                                                <input type="radio" name="hasCurrentPet" value="예" checked={form.hasCurrentPet === '예'} onChange={onRadio} /> 예
                                            </label>
                                            <label>
                                                <input type="radio" name="hasCurrentPet" value="아니오" checked={form.hasCurrentPet === '아니오'} onChange={onRadio} /> 아니오
                                            </label>
                                        </div>
                                    </div>
                                    {form.hasCurrentPet === '예' && (
                                        <div className="checklist-form">
                                            <div className="conditional-section">
                                                <div className="form-group">
                                                    <div className="checklist-question">현재 키우는 반려동물 종류와 수는?</div>
                                                    <input type="text" name="currentPetDetails" value={form.currentPetDetails} onChange={onChange} placeholder="현재 키우는 반려동물 정보를 입력해주세요" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4단계: 완료 */}
                            <div>
                                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={20} /> 서명 및 완료
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <div className="signature-section">
                                        <span style={{ fontWeight: '500' }}>신청인(서명):</span>
                                        <input type="text" name="signature" value={form.signature || ''} onChange={onChange} className="signature-input" placeholder="본인 이름" />
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        padding: '16px',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #007bff',
                                        marginTop: '16px'
                                    }}>
                                        <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.5', margin: 0 }}>
                                            위 내용이 사실임을 확인하며, 입양 후 반려동물을 책임감 있게 돌보겠습니다.<br />
                                            입양 과정에서 허위 정보 제공 시 입양이 취소될 수 있음을 동의합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* 1단계: 인적사항 */}
                            {currentStep === 1 && (
                                <div>
                                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={20} /> 인적사항
                                    </div>
                                    <div className="section-content section-personal">
                                        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    name="applicantName"
                                                    value={form.applicantName}
                                                    onChange={onChange}
                                                    placeholder="이름"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={onChange}
                                                    placeholder="연락처 (010-0000-0000)"
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 12 }}>
                                            <input
                                                type="text"
                                                name="address"
                                                value={form.address}
                                                onChange={onChange}
                                                placeholder="주소"
                                                style={{ width: '700px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2단계: 동물정보 */}
                            {currentStep === 2 && (
                                <div>
                                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Heart size={20} />
                                        동물정보
                                    </div>
                                    <div className="section-content section-animal">
                                        {form.animalRescueNo && form.animalBreed ? (
                                            <div className="animal-info-card">
                                                <img
                                                    src={
                                                        form.animalImgUrl.startsWith('http')
                                                            ? `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(form.animalImgUrl)}`
                                                            : form.animalImgUrl // 이미 base64면 바로 출력
                                                    }
                                                    alt="입양 동물"
                                                    className="animal-image"
                                                />
                                                <div className="animal-details">
                                                    <div><strong>보호번호:</strong> {form.animalRescueNo || '미지정'}</div>
                                                    <div><strong>품종:</strong> {form.animalBreed || '품종 정보 없음'}</div>
                                                    <div><strong>나이:</strong> {form.animalAge || '나이 정보 없음'}</div>
                                                    <div><strong>체중:</strong> {form.animalWeight || '체중 정보 없음'}</div>
                                                    <div><strong>성별:</strong> {form.animalGender || '성별 정보 없음'}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            // 동물 정보 없을 때
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <div style={{ marginBottom: 16, color: '#888', fontSize: 17 }}>선택한 동물 정보가 없습니다.</div>
                                                <button
                                                    className="form-button primary"
                                                    style={{ padding: '10px 22px', fontWeight: 600, fontSize: 15 }}
                                                    onClick={() => {
                                                        // 원하는 경로로 이동하거나 콜백 실행
                                                        // 예시: window.location.href = '/adopt/list'
                                                        if (onClose) onClose();
                                                        window.location.href = '/about';
                                                    }}
                                                >
                                                    동물 찾으러 가기
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 3단계: 체크리스트 */}
                            {currentStep === 3 && (
                                <div>
                                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={20} />
                                        체크리스트
                                    </div>
                                    <div className="section-content section-checklist">

                                        {/* 가족 동의 */}
                                        <div className="checklist-item">
                                            <div className="checklist-question">
                                                입양 결정에 가족 모두 동의하십니까?
                                            </div>
                                            <div className="checklist-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="familyAgreement"
                                                        value="예"
                                                        checked={form.familyAgreement === '예'}
                                                        onChange={onRadio}
                                                    />
                                                    예
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="familyAgreement"
                                                        value="아니오"
                                                        checked={form.familyAgreement === '아니오'}
                                                        onChange={onRadio}
                                                    />
                                                    아니오
                                                </label>
                                            </div>
                                        </div>

                                        {/* 반려동물 경험 */}
                                        <div className="checklist-item">
                                            <div className="checklist-question">
                                                반려동물을 키워 보신 적이 있습니까?
                                            </div>
                                            <div className="checklist-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="hasPetExperience"
                                                        value="예"
                                                        checked={form.hasPetExperience === '예'}
                                                        onChange={onRadio}
                                                    />
                                                    예
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="hasPetExperience"
                                                        value="아니오"
                                                        checked={form.hasPetExperience === '아니오'}
                                                        onChange={onRadio}
                                                    />
                                                    아니오
                                                </label>
                                            </div>
                                        </div>
                                        {form.hasPetExperience === '예' && (
                                            <div className="conditional-section">
                                                <div className="form-group">
                                                    <div className="checklist-question">
                                                        과거에 키운 반려동물의 종류와 수는?
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="pastPetDetails"
                                                        value={form.pastPetDetails}
                                                        onChange={onChange}
                                                        placeholder="예: 강아지 2마리, 고양이 1마리"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <div className="checklist-question">
                                                        과거에 키운 반려동물은 어떻게 되었나요?
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="pastPetFate"
                                                        value={form.pastPetFate}
                                                        onChange={onChange}
                                                        placeholder="자세히 설명해주세요"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {/* 현재 반려동물 */}
                                        <div className="checklist-item">
                                            <div className="checklist-question">
                                                현재 반려동물을 키우고 계십니까?
                                            </div>
                                            <div className="checklist-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="hasCurrentPet"
                                                        value="예"
                                                        checked={form.hasCurrentPet === '예'}
                                                        onChange={onRadio}
                                                    />
                                                    예
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="hasCurrentPet"
                                                        value="아니오"
                                                        checked={form.hasCurrentPet === '아니오'}
                                                        onChange={onRadio}
                                                    />
                                                    아니오
                                                </label>
                                            </div>
                                        </div>
                                        {form.hasCurrentPet === '예' && (
                                            <div className="checklist-form">

                                                <div className="conditional-section">
                                                    <div className="form-group">
                                                        <div className="checklist-question">
                                                            현재 키우는 반려동물 종류와 수는?
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="currentPetDetails"
                                                            value={form.currentPetDetails}
                                                            onChange={onChange}
                                                            placeholder="현재 키우는 반려동물 정보를 입력해주세요"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* 4단계: 완료 */}
                            {currentStep === 4 && (
                                <div>
                                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={20} />
                                        서명 및 완료
                                    </div>
                                    <div style={{
                                        background: '#f8f9fa',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        marginBottom: '20px'
                                    }}>
                                        <div className="signature-section">
                                            <span style={{ fontWeight: '500' }}>신청인(서명):</span>
                                            <input
                                                type="text"
                                                name="signature"
                                                value={form.signature || ''}
                                                onChange={onChange}
                                                className="signature-input"
                                                placeholder="본인 이름"
                                            />
                                        </div>

                                        <div style={{
                                            background: 'white',
                                            padding: '16px',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #007bff',
                                            marginTop: '16px'
                                        }}>
                                            <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.5', margin: 0 }}>
                                                위 내용이 사실임을 확인하며, 입양 후 반려동물을 책임감 있게 돌보겠습니다.
                                                입양 과정에서 허위 정보 제공 시 입양이 취소될 수 있음을 동의합니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>



                {/* 모달 푸터 */}
                <div className="adoption-form-buttons">
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {currentStep > 1 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="form-button secondary"
                                >
                                    이전
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {currentStep < 4 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="form-button primary"
                                >
                                    다음
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSavePDF}
                                        className="form-button success"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <Download size={16} />
                                        {isSubmitting ? '저장 중...' : 'PDF 저장'}
                                    </button>
                                    {!isMobile && (
                                        <button
                                            onClick={handlePrint}
                                            className="form-button secondary"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            <Printer size={16} />
                                            인쇄
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default AdoptionApplicationForm;