import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

// 닉네임 중복 체크 API
async function checkNicknameDup(nickname) {
    if (!nickname) return false;
    const res = await axios.get(`/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
    return res.data === true;
}

const NicknameEditModal = ({
    currentNickname,
    userId,
    onSave,
    onClose,
}) => {
    const [inputValue, setInputValue] = useState(currentNickname);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);

    const debounceRef = useRef(null);

    // 닉네임 중복 체크
    useEffect(() => {
        if (!inputValue.trim() || inputValue === currentNickname) {
            setIsDuplicate(false);
            setError('');
            return;
        }

        setChecking(true);
        setError('');

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            checkNicknameDup(inputValue.trim())
                .then((duplicated) => {
                    setIsDuplicate(duplicated);
                    setError(duplicated ? '이미 사용 중인 닉네임입니다.' : '');
                })
                .catch(() => {
                    setIsDuplicate(false);
                    setError('중복 확인 중 오류가 발생했습니다.');
                })
                .finally(() => {
                    setChecking(false);
                });
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [inputValue, currentNickname]);

    // 닉네임 저장 (PUT 메서드 + 백엔드 포맷 일치)
    const handleSave = async () => {
        if (
            !inputValue.trim() ||
            inputValue === currentNickname ||
            isDuplicate ||
            loading ||
            checking
        ) return;

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // PUT /api/users/{userId}/nickname, body: { nickname }
            const res = await axios.put(
                `/api/users/${userId}/nickname`,
                { nickname: inputValue.trim() },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            // 성공 시 onSave 콜백 (닉네임 전달)
            if (onSave) onSave(res.data.nickname);
            onClose();
        } catch (err) {
            // 백엔드 응답 message 있으면 노출
            const msg = err?.response?.data?.message || '닉네임 변경에 실패했습니다.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const isDisabled =
        !inputValue.trim() ||
        inputValue === currentNickname ||
        isDuplicate ||
        loading ||
        checking;

    return (
        <Modal onClose={onClose} title="닉네임 수정">
            <div className="modal-content">
                <div className="input-group">
                    <label className="label">새 닉네임</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        maxLength={20}
                        className="input"
                        placeholder="닉네임을 입력하세요"
                        disabled={loading}
                        autoFocus
                    />
                    <div className="input-helper">
                        {inputValue.length}/20
                        {checking && <span className="dup-checking">중복 확인 중...</span>}
                    </div>
                    {error && <div className="error-text">{error}</div>}
                </div>
                <div className="modal-buttons">
                    <button
                        onClick={onClose}
                        className="modal-btn cancel"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isDisabled}
                        className={`modal-btn save${isDisabled ? ' disabled' : ''}`}
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default NicknameEditModal;
