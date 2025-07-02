import { useState, useEffect } from 'react';
import { useAlert } from '../Context/AlertContext';
import isAdminCheck from '../../Common/isAdminCheck';
import './AdoptionInquiry.css';
import { saveThumbnails, savePopups } from './AdoptionImageActive';

// const DEFAULT_SLIDE_IMAGES = [
//   '/AdoptionImage/photo1.jpg',
//   '/AdoptionImage/photo2.jpg',
//   '/AdoptionImage/photo3.jpg',
//   '/AdoptionImage/photo4.jpg',
//   '/AdoptionImage/photo5.jpg',
//   '/AdoptionImage/photo6.jpg',
// ];
// const DEFAULT_THUMBNAILS = [
//   '/AdoptionImage/image.png',
//   '/AdoptionImage/image2.gif',
// ];

const AdoptionInquiry = () => {
    const [open, setOpen] = useState(false);
    const [slide, setSlide] = useState(0);
    const [checked, setChecked] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const { showAlert } = useAlert();
    const [slideImages, setSlideImages] = useState([]);

    // 썸네일
    const [thumbnails, setThumbnails] = useState([]);
    const [thumbnailDraft, setThumbnailDraft] = useState([]);
    const [thumbnailManageOpen, setThumbnailManageOpen] = useState(false);
    const [thumbnailFileMap, setThumbnailFileMap] = useState({});

    // 팝업 이미지 관리
    const [photoManageOpen, setPhotoManageOpen] = useState(false);
    const [photoDraft, setPhotoDraft] = useState([]);
    const [popupFileMap, setPopupFileMap] = useState({});

    // 관리자 체크
    const isAdmin = isAdminCheck();

    useEffect(() => {
        setOpen(true);
        // TODO: 서버에서 이미지 fetch 예시
        const fetchImages = async () => {
            try {
                const res1 = await fetch('http://localhost:8888/customer/adoption/POPUP');
                const slideData = await res1.json();
                console.log('슬라이드 이미지 데이터:', slideData); // 디버깅용
                setSlideImages(slideData);
                setPhotoDraft(slideData);
                const res2 = await fetch('http://localhost:8888/customer/adoption/THUMBNAIL');
                const thumbData = await res2.json();
                setThumbnails(thumbData);
                setThumbnailDraft(thumbData);
            } catch (e) {
                console.error('이미지 로딩 실패', e);
            }
        };

        fetchImages();
    }, []);

    // 팝업 사진 관리 모달 열기
    const openPhotoManage = () => {
        setPhotoDraft([...slideImages]);
        setPhotoManageOpen(true);
    };

    // 썸네일 관리 모달 열기
    const openThumbnailManage = () => {
        setThumbnailDraft([...thumbnails]);
        setThumbnailManageOpen(true);
    };

    // 썸네일 저장
    const handleThumbnailSave = async () => {
        await saveThumbnails(
            thumbnailDraft,
            thumbnails,
            showAlert,
            setThumbnails,
            () => setThumbnailManageOpen(false),
            thumbnailFileMap
        );
    };

    // 썸네일 관리 닫기
    const handleThumbnailClose = async () => {
        if (JSON.stringify(thumbnailDraft) === JSON.stringify(thumbnails)) {
            setThumbnailManageOpen(false);
            return;
        }
        const result = await showAlert({
            title: '수정사항이 저장되지 않았습니다. 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오'
        });
        if (result && result.isConfirmed) {
            setThumbnailManageOpen(false);
        }
    };

    // 팝업 사진 저장
    const handlePopupSave = async () => {
        await savePopups(
            photoDraft,
            slideImages,
            showAlert,
            setSlideImages,
            () => setPhotoManageOpen(false),
            popupFileMap  // ← 반드시 이거 추가해야 함
        );
    };

    // 팝업 사진 닫기
    const handleClose = async () => {
        if (JSON.stringify(photoDraft) === JSON.stringify(slideImages)) {
            setPhotoManageOpen(false);
            return;
        }
        const result = await showAlert({
            title: '수정사항이 저장되지 않았습니다. 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오'
        });
        if (result && result.isConfirmed) {
            setPhotoManageOpen(false);
        }
    };

    // 썸네일 클릭X

    const openModal = (idx) => {
        setSlide(idx);
        setOpen(true);
        setChecked(false);
    };

    const next = () => setSlide((prev) => Math.min(prev + 1, slideImages.length - 1));
    const prev = () => setSlide((prev) => Math.max(prev - 1, 0));
    const closeModal = () => setOpen(false);

    // 체크박스
    const handleCheckbox = (e) => {
        setChecked(e.target.checked);
    };

    // "확인" 버튼 눌렀을 때 showAlert
    const handleConfirm = async () => {
        await showAlert({
            title: "모든 안내를 확인하셨습니다.",
            icon: "success",
        });
        setConfirmed(true);
        closeModal();
    };

    return (
        <div className="customer-adoption-inquiry">

            {/* 썸네일 리스트 (클릭X) */}
            {thumbnails && thumbnails.length > 0 && (
                <div className="customer-slide-thumbnails">
                    {thumbnails.map((item, idx) => (
                        <img
                            key={item.id}
                            src={item.src.startsWith("blob:")
                                ? item.src
                                : `http://localhost:8888${item.src}`}
                            alt={`썸네일${idx + 1}`}
                            style={{ marginRight: 12, verticalAlign: 'middle' }}
                        />
                    ))}
                </div>
            )}
            {/* 관리자만 썸네일/팝업 사진 관리 버튼 */}
            {isAdmin && (
                <div style={{ textAlign: "center", margin: "16px 0", display: "flex", justifyContent: "center", gap: 8 }}>
                    <button
                        className="customer-adopt-button"
                        onClick={openThumbnailManage}
                    >
                        썸네일 관리
                    </button>
                    <button
                        className="customer-adopt-button"
                        onClick={openPhotoManage}
                    >
                        팝업 사진 관리
                    </button>
                </div>
            )}
            {/* 썸네일 관리 모달 */}
            {thumbnailManageOpen && (
                <div className="customer-slide-modal">
                    <div className="customer-slide-modal-content">
                        <h3>썸네일 관리</h3>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {thumbnailDraft.map((img, idx) => (
                                <div key={img + idx} style={{ textAlign: 'center', width: 120 }}>
                                    <img
                                        src={img.src.startsWith("blob:")
                                            ? img.src
                                            : `http://localhost:8888${img.src}`}
                                        alt={`썸네일${idx + 1}`}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 8,
                                            objectFit: 'cover',
                                            border: '1px solid #ddd',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                                        {/* 파일 교체 */}
                                        <label style={{ fontWeight: 600, cursor: "pointer", color: "#5548c8" }}>
                                            수정
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={async e => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    // ✅ 썸네일도 10MB 제한
                                                    const maxSizeMB = 10;
                                                    if (file.size > maxSizeMB * 1024 * 1024) {
                                                        await showAlert({
                                                            title: "썸네일 업로드 실패",
                                                            text: `이미지 용량이 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)\n${maxSizeMB}MB 이하만 업로드할 수 있어요.`,
                                                            icon: "warning",
                                                        });
                                                        return;
                                                    }

                                                    const url = URL.createObjectURL(file);
                                                    setThumbnailDraft(arr => arr.map((v, i) =>
                                                        i === idx ? { src: url, file } : v
                                                    ));
                                                    setThumbnailFileMap((map) => ({ ...map, [idx]: file }));
                                                }}
                                            />
                                        </label>
                                        {/* 삭제 */}
                                        <button
                                            style={{
                                                fontWeight: 600,
                                                color: "#fff",
                                                background: "#ff7676",
                                                border: "none",
                                                borderRadius: 5,
                                                padding: "2px 10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={async () => {
                                                if (thumbnailDraft.length <= 1) {
                                                    await showAlert({
                                                        title: "사진은 최소 1장 이상 필요합니다.",
                                                        icon: "warning",
                                                        imageUrl: process.env.PUBLIC_URL + '/img/noo.jpg', // 사진도 넣고 싶으면 추가
                                                        imageWidth: 300,
                                                        imageHeight: 250,
                                                        imageAlt: '꺄아악',
                                                    });
                                                    return;
                                                }
                                                setThumbnailDraft(arr => arr.filter((_, i) => i !== idx));
                                            }}
                                            title={thumbnailDraft.length <= 1 ? "사진 1장은 남겨야 함" : "삭제"}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* 추가 */}
                            <label
                                style={{
                                    width: 100,
                                    height: 100,
                                    border: '2px dashed #bbb',
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 36,
                                    color: '#bbb',
                                    cursor: 'pointer',
                                }}
                            >
                                +
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async e => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        // ✅ 용량 체크 (기준: 10MB)
                                        const maxSizeMB = 10;
                                        if (file.size > maxSizeMB * 1024 * 1024) {
                                            await showAlert({
                                                title: "썸네일 업로드 실패",
                                                text: `이미지 용량이 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)\n${maxSizeMB}MB 이하만 업로드할 수 있어요.`,
                                                icon: "warning",
                                            });
                                            return;
                                        }

                                        const url = URL.createObjectURL(file);
                                        setThumbnailDraft(prev => {
                                            const newDraft = [...prev, { src: url, file }];
                                            setThumbnailFileMap(map => ({ ...map, [newDraft.length - 1]: file }));
                                            return newDraft;
                                        });
                                    }}
                                />
                            </label>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 18 }}>
                            <button className="customer-adopt-button" onClick={handleThumbnailSave}>저장</button>
                            <button className="customer-adopt-button" style={{ marginLeft: 8 }} onClick={handleThumbnailClose}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 다시 보기 버튼: confirmed면 노출 */}
            <div style={{ textAlign: 'center', margin: '18px 0 0 0' }}>
                <button className="customer-adopt-button" onClick={() => openModal(0)}>
                    다시 보기
                </button>
            </div>

            {/*  */}
            {photoManageOpen && (
                <div className="customer-slide-modal">
                    <div className="customer-slide-modal-content">
                        <h3 style={{ marginBottom: 16, textAlign: "center" }}>팝업 사진 관리</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                            {photoDraft.map((img, idx) => {
                                return (
                                    <div key={idx} style={{ textAlign: "center" }}>
                                        <img
                                            src={img.src.startsWith("blob:")
                                                ? img.src
                                                : `http://localhost:8888${img.src}`}
                                            alt={`팝업${idx + 1}`}
                                            style={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #ddd",
                                                marginBottom: 8,
                                            }}
                                        />
                                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                            {/* 파일 교체 */}
                                            <label style={{ fontWeight: 600, cursor: "pointer", color: "#5548c8" }}>
                                                수정
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={async e => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        // ✅ 용량 제한 체크 (10MB 이하만 허용)
                                                        const maxSizeMB = 10;
                                                        if (file.size > maxSizeMB * 1024 * 1024) {
                                                            await showAlert({
                                                                title: "파일 업로드 실패",
                                                                text: `이미지 용량이 너무 큽니다.\n(${(file.size / 1024 / 1024).toFixed(2)}MB)\n${maxSizeMB}MB 이하만 업로드할 수 있어요.`,
                                                                icon: "warning",
                                                            });
                                                            return;
                                                        }

                                                        const url = URL.createObjectURL(file);
                                                        setPhotoDraft(prev => {
                                                            const newDraft = prev.map((v, i) =>
                                                                i === idx ? { src: url, file } : v
                                                            );
                                                            setPopupFileMap(map => ({ ...map, [idx]: file }));
                                                            return newDraft;
                                                        });
                                                    }}
                                                />
                                            </label>
                                            {/* 삭제 */}
                                            <button
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#fff",
                                                    background: "#ff7676",
                                                    border: "none",
                                                    borderRadius: 5,
                                                    padding: "2px 10px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={async () => {
                                                    if (photoDraft.length <= 1) {
                                                        await showAlert({
                                                            title: "사진은 최소 1장 이상 필요합니다.",
                                                            icon: "warning",
                                                            imageUrl: process.env.PUBLIC_URL + '/img/noo.jpg', // 사진도 넣고 싶으면 추가
                                                            imageWidth: 300,
                                                            imageHeight: 250,
                                                            imageAlt: '꺄아악',
                                                        });
                                                        return;
                                                    }
                                                    setPhotoDraft(arr => arr.filter((_, i) => i !== idx));
                                                }}
                                                title={photoDraft.length <= 1 ? "사진 1장은 남겨야 함" : "삭제"}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>

                                )
                            })}
                            {/* 사진 추가 */}
                            <div style={{ textAlign: "center", width: 120 }}>
                                <label
                                    style={{
                                        display: "inline-block",
                                        width: 120,
                                        height: 120,
                                        border: "2px dashed #bbb",
                                        borderRadius: 8,
                                        lineHeight: "120px",
                                        fontSize: 32,
                                        color: "#bbb",
                                        cursor: "pointer",
                                    }}
                                >
                                    +
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={async e => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            // ✅ 파일 용량 제한: 10MB
                                            const maxSizeMB = 10;
                                            if (file.size > maxSizeMB * 1024 * 1024) {
                                                await showAlert({
                                                    title: "업로드 실패",
                                                    text: `이미지 용량이 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)\n${maxSizeMB}MB 이하만 업로드할 수 있어요.`,
                                                    icon: "warning",
                                                });
                                                return;
                                            }

                                            const url = URL.createObjectURL(file);

                                            setPhotoDraft(prev => {
                                                const newDraft = [...prev, { src: url, file }];
                                                setPopupFileMap(map => ({ ...map, [newDraft.length - 1]: file }));
                                                return newDraft;
                                            });
                                        }}
                                    />
                                </label>
                                <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>사진 추가</div>
                            </div>
                        </div>
                        {/* 저장, 닫기 버튼 */}
                        <div style={{ textAlign: "center", marginTop: 24 }}>
                            <button
                                className="customer-adopt-button"
                                style={{ marginRight: 16 }}
                                onClick={handlePopupSave}
                            >
                                저장
                            </button>
                            <button
                                className="customer-adopt-button"
                                onClick={handleClose}
                            >
                                닫기
                            </button>
                        </div>
                        {/* 오버레이 클릭 시 닫기 */}
                        <div
                            className="customer-modal-overlay"
                            onClick={() => setPhotoManageOpen(false)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </div>

            )}
            {/* 슬라이드 팝업 모달 */}
            {open && (
                <div className="customer-slide-modal">
                    <div className="customer-slide-modal-content">
                        {/* (X 버튼: 관리자는 항상 보임, 일반은 confirmed일 때만 보임) */}
                        {(isAdmin || confirmed) && (
                            <button className="customer-close-btn" onClick={closeModal}>×</button>
                        )}
                        {/* 슬라이드: 버튼-이미지-버튼 */}
                        <div
                            className="customer-slider-container"
                            style={{
                                width: 700,
                                height: 700,
                                margin: "0 auto",
                                position: "relative",
                                borderRadius: 16,
                                background: "#fafcff",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.13)"
                            }}
                        >
                            {/* 메인 이미지 (조건 분기) */}
                            {slideImages.length === 0 ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#888",
                                        fontSize: 18
                                    }}
                                >
                                    팝업 이미지가 없습니다.
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={
                                            slideImages[slide]?.src?.startsWith("blob:")
                                                ? slideImages[slide].src
                                                : `http://localhost:8888${slideImages[slide]?.src}`
                                        }
                                        alt={`사진${slide + 1}`}
                                        className="customer-slide"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 16,
                                            display: "block"
                                        }}
                                    />
                                    {/* 왼쪽 버튼 */}
                                    <button
                                        onClick={prev}
                                        disabled={slide === 0}
                                        className="customer-slider-arrow-btn"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 16,
                                            transform: "translateY(-50%)",
                                            fontSize: 44,
                                            background: "rgba(0,0,0,0.17)",
                                            color: slide === 0 ? "#ccc" : "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 52,
                                            height: 52,
                                            zIndex: 2,
                                            cursor: slide === 0 ? "default" : "pointer",
                                            transition: "color 0.18s, background 0.18s"
                                        }}
                                    >
                                        &lt;
                                    </button>
                                    {/* 오른쪽 버튼 */}
                                    <button
                                        onClick={next}
                                        disabled={slide === slideImages.length - 1}
                                        className="customer-slider-arrow-btn"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 16,
                                            transform: "translateY(-50%)",
                                            fontSize: 44,
                                            background: "rgba(0,0,0,0.17)",
                                            color: slide === slideImages.length - 1 ? "#ccc" : "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 52,
                                            height: 52,
                                            zIndex: 2,
                                            cursor: slide === slideImages.length - 1 ? "default" : "pointer",
                                            transition: "color 0.18s, background 0.18s"
                                        }}
                                    >
                                        &gt;
                                    </button>
                                </>
                            )}
                        </div>
                        {/* 이미지 아래 슬라이드 번호 */}
                        <div style={{
                            textAlign: "center",
                            marginTop: 12,
                            fontWeight: 700,
                            fontSize: 20,
                        }}>
                            {slide + 1} / {slideImages.length}
                        </div>
                        {/* 마지막 사진에만 체크박스/확인버튼 */}
                        {slide === slideImages.length - 1 && !confirmed && (
                            <div style={{ marginTop: 24, textAlign: "center" }}>
                                <label style={{ fontWeight: "bold" }}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={handleCheckbox}
                                    /> 모두 확인하셨나요?
                                </label>
                                <br />
                                <button
                                    className="customer-adopt-button"
                                    style={{
                                        marginTop: 8,
                                        opacity: checked ? 1 : 0.5,
                                        pointerEvents: checked ? 'auto' : 'none'
                                    }}
                                    disabled={!checked}
                                    onClick={handleConfirm}
                                >확인</button>
                            </div>
                        )}
                        {/* 오버레이 클릭: confirmed면 닫힘, 아니면 무시 */}
                        <div
                            className="customer-modal-overlay"
                            onClick={() => {
                                if (confirmed) closeModal();
                            }}
                            style={{ cursor: confirmed ? "pointer" : "not-allowed" }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="customer-adoption-buttons">
                <a
                    href="/Files/동물입양신청서.pdf"
                    className="customer-adopt-button"
                    download="동물입양신청서.pdf"
                >
                    📄 입양 서류 다운로드
                </a>
                <button
                    className="customer-adopt-button"
                    onClick={async () => {
                        await showAlert({
                            title: '입양 상담 신청',
                            text: '입양 상담 신청 준비 중입니다.',
                            icon: 'info'
                        });
                    }}
                >
                    📝 입양 상담 신청
                </button>
            </div>
        </div>
    );
};

export default AdoptionInquiry;
