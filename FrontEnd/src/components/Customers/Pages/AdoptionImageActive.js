import {
    createAdoptionImage,
    updateAdoptionImage,
    deleteAdoptionImage,
    fetchAdoptionImages,
    uploadImageFile
} from '../../../api/CustomerApiData';

// 최대 허용 이미지 용량 (MB)
const MAX_SIZE_MB = 10;

// src가 blob URL이면 서버에 업로드 후 실제 URL 받는 함수
const getRealImageUrl = async (src, index, fileMap, draft = [], showAlert) => {
    if (!src || typeof src !== "string") return "";

    if (!src.startsWith("blob:")) return src;

    const file = fileMap?.[index] || draft?.[index]?.file;
    if (!file) {
        console.warn("파일 없음 - index:", index, draft?.[index]);
        throw new Error("파일을 찾을 수 없습니다: index " + index);
    }

    // ✅ 용량 초과 검사
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        await showAlert({
            title: `이미지 용량 초과`,
            text: `파일 ${index + 1}번이 ${MAX_SIZE_MB}MB를 초과합니다.\n(${(file.size / 1024 / 1024).toFixed(2)}MB)`,
            icon: "error",
        });
        throw new Error("용량 초과 이미지");
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = await uploadImageFile(formData);
    return url;
};

// 썸네일 저장 함수
export const saveThumbnails = async (
    draft, before, showAlert, setThumbnails, closeModal, fileMap
) => {
    try {
        for (let i = 0; i < draft.length; i++) {
            const item = draft[i];
            let realSrc = item.src || item;
            realSrc = await getRealImageUrl(realSrc, i, fileMap, draft, showAlert);
            if (!item.id) {
                await createAdoptionImage({ type: "THUMBNAIL", seq: i, src: realSrc });
            }
        }

        for (let i = 0; i < draft.length; i++) {
            const item = draft[i];
            let realSrc = item.src || item;
            realSrc = await getRealImageUrl(realSrc, i, fileMap, draft, showAlert);
            if (item.id) {
                const old = before.find((b) => b.id === item.id);
                if (old && (old.seq !== i || old.src !== realSrc)) {
                    await updateAdoptionImage(item.id, { ...item, seq: i, src: realSrc });
                }
            }
        }

        for (const old of before) {
            if (!draft.some((d) => d.id === old.id)) {
                await deleteAdoptionImage(old.id);
            }
        }

        const latest = await fetchAdoptionImages();
        setThumbnails(
            latest.filter((img) => img.type === "THUMBNAIL").sort((a, b) => a.seq - b.seq)
        );

        closeModal && closeModal();
        await showAlert({
            title: "썸네일이 저장되었습니다.",
            icon: "success",
            timer: 1200,
            showConfirmButton: false,
        });

    } catch (err) {
        console.error("썸네일 저장 중 에러:", err);

        // ✅ 중복 방지하고, 사용자에게 안내
        if (err?.response?.status === 413) {
            await showAlert?.({
                title: "이미지 크기 초과",
                text: "업로드 가능한 이미지 최대 용량을 초과했습니다.",
                icon: "error"
            })
        } else {
            await showAlert({
                title: "저장 실패",
                text: "오류가 발생했습니다.",
                icon: "error",
            });
        }
    }
};

// 팝업 사진 저장 함수
export const savePopups = async (
    draft, before, showAlert, setPopups, closeModal, fileMap
) => {
    try {
        for (let i = 0; i < draft.length; i++) {
            const item = draft[i];
            let realSrc = item.src || item;
            realSrc = await getRealImageUrl(realSrc, i, fileMap, draft, showAlert);

            if (!item.id) {
                await createAdoptionImage({ type: "POPUP", seq: i, src: realSrc });
            }
        }

        for (let i = 0; i < draft.length; i++) {
            const item = draft[i];
            let realSrc = item.src || item;
            realSrc = await getRealImageUrl(realSrc, i, fileMap, draft, showAlert);

            if (item.id) {
                const old = before.find((b) => b.id === item.id);
                if (old && (old.seq !== i || old.src !== realSrc)) {
                    await updateAdoptionImage(item.id, { ...item, seq: i, src: realSrc });
                }
            }
        }

        for (const old of before) {
            if (!draft.some((d) => d.id === old.id)) {
                await deleteAdoptionImage(old.id);
            }
        }

        const latest = await fetchAdoptionImages();
        setPopups(
            latest.filter((img) => img.type === "POPUP").sort((a, b) => a.seq - b.seq)
        );

        closeModal && closeModal();
        await showAlert({
            title: "팝업사진이 저장되었습니다.",
            icon: "success",
            timer: 1200,
            showConfirmButton: false,
        });
    } catch (err) {
        console.error("팝업사진 저장 중 에러:", err);
        // ✅ 중복 방지하고, 사용자에게 안내
        if (err?.response?.status === 413) {
            await showAlert?.({
                title: "이미지 크기 초과",
                text: "업로드 가능한 이미지 최대 용량을 초과했습니다.",
                icon: "error"
            })
        } else {
            await showAlert({
                title: "저장 실패",
                text: "오류가 발생했습니다.",
                icon: "error",
            });
        }
    }
};
