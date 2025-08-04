import { useState } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

const WithdrawModal = ({ onClose, onWithdrawSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleWithdraw = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete('/api/users/me', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            if (onWithdrawSuccess) onWithdrawSuccess();
        } catch (err) {
            setError('탈퇴에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose} title="회원 탈퇴 확인">
            <div className="modal-content">
                <div className="warning-text" style={{ marginBottom: 20 }}>
                    정말로 회원 탈퇴하시겠습니까?<br />
                    <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        이 작업은 되돌릴 수 없으며,<br />
                        작성한 게시글/댓글은 닉네임만 변경된 채로 남게 됩니다.
                    </span>
                </div>
                {error && <div className="error-text">{error}</div>}
                <div className="modal-buttons">
                    <button
                        className="modal-btn cancel"
                        onClick={onClose}
                        disabled={loading}
                    >취소</button>
                    <button
                        className="modal-btn danger"
                        onClick={handleWithdraw}
                        disabled={loading}
                    >{loading ? '탈퇴 중...' : '탈퇴'}</button>
                </div>
            </div>
        </Modal>
    );
};

export default WithdrawModal;
