import { useState } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

import { BASE_URL } from '../../api/BaseUrl';

const changePassword = async ({ currentPassword, newPassword }) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${BASE_URL}/api/users/password`,
        { currentPassword, newPassword },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
    );
    return res.data;
};

const PasswordChangeModal = ({ onClose }) => {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
        if (field === 'confirmPassword' || field === 'newPassword') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: ''
            }));
        }
    };

    const handleSubmit = async () => {
        const errors = {};
        if (!form.currentPassword) {
            errors.currentPassword = '현재 비밀번호를 입력해주세요.';
        }
        if (!form.newPassword) {
            errors.newPassword = '새 비밀번호를 입력해주세요.';
        } else if (form.newPassword.length < 8) {
            errors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
        }
        if (!form.confirmPassword) {
            errors.confirmPassword = '새 비밀번호를 다시 입력해주세요.';
        } else if (form.newPassword !== form.confirmPassword) {
            errors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
        }
        if (form.currentPassword === form.newPassword) {
            errors.newPassword = '현재 비밀번호와 동일합니다.';
        }
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                await changePassword({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                });
                alert('비밀번호가 변경되었습니다.');
                setForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                onClose();
            } catch (err) {
                const msg = err?.response?.data?.message || '비밀번호 변경에 실패했습니다.';
                setErrors({ currentPassword: msg });
            } finally {
                setLoading(false);
            }
        }
    };

    const closeAndReset = () => {
        setForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal onClose={closeAndReset} title="비밀번호 변경">
            <div className="modal-content">
                <div className="input-group">
                    <label className="label">현재 비밀번호</label>
                    <input
                        type="password"
                        value={form.currentPassword}
                        onChange={e => handleChange('currentPassword', e.target.value)}
                        className={`input ${errors.currentPassword ? 'error' : ''}`}
                        placeholder="현재 비밀번호를 입력하세요"
                        disabled={loading}
                    />
                    {errors.currentPassword && (
                        <div className="error-text">{errors.currentPassword}</div>
                    )}
                </div>
                <div className="input-group">
                    <label className="label">새 비밀번호</label>
                    <input
                        type="password"
                        value={form.newPassword}
                        onChange={e => handleChange('newPassword', e.target.value)}
                        className={`input ${errors.newPassword ? 'error' : ''}`}
                        placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                        disabled={loading}
                    />
                    {errors.newPassword && (
                        <div className="error-text">{errors.newPassword}</div>
                    )}
                </div>
                <div className="input-group">
                    <label className="label">새 비밀번호 확인</label>
                    <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={e => handleChange('confirmPassword', e.target.value)}
                        className={`input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="새 비밀번호를 다시 입력하세요"
                        disabled={loading}
                    />
                    {errors.confirmPassword && (
                        <div className="error-text">{errors.confirmPassword}</div>
                    )}
                </div>
                <div className="password-helper">
                    <div className="helper-item">
                        <span className={form.newPassword.length >= 8 ? 'check-icon' : 'uncheck-icon'}>
                            {form.newPassword.length >= 8 ? '✓' : '○'}
                        </span>
                        8자 이상
                    </div>
                    <div className="helper-item">
                        <span className={form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword ? 'check-icon' : 'uncheck-icon'}>
                            {form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword ? '✓' : '○'}
                        </span>
                        비밀번호 일치
                    </div>
                </div>
                <div className="modal-buttons">
                    <button 
                        onClick={closeAndReset}
                        className="modal-btn cancel"
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="modal-btn save"
                        disabled={loading}
                    >
                        {loading ? '변경 중...' : '변경'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PasswordChangeModal;
