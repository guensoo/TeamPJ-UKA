import { useState, useEffect } from 'react';
import NicknameEditModal from './NicknameEditModal';
import PasswordChangeModal from './PasswordChangeModal';
import WithdrawModal from './WithdrawModal';
import './MyInfo.css';
import './DarkMode.css'; // 제거 - 통합 darkmode.css 사용

const MyInfo = ({ user, setUser, daysActive }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '사용자');
    
    // 다크모드 상태 관리
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // 다크모드 변경 시 localStorage에 저장 및 body 클래스 적용
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    // 다크모드 토글 함수
    const handleDarkModeToggle = () => {
        setIsDarkMode(prev => !prev);
    };

    // 닉네임 저장
    const handleNicknameSave = (newNickname) => {
        setUser((prev) => {
            const updated = { ...prev, nickname: newNickname };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    // 비밀번호 변경(예시)
    const handlePasswordSave = () => {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setPasswordOpen(false);
    };

    // 탈퇴 성공 시 로그아웃 및 리다이렉트
    const handleWithdrawSuccess = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="myinfo-container">
            <div className="myinfo-section-header">
                <h2 className="myinfo-title">내 정보</h2>
                <p className="myinfo-subtitle">계정 정보를 확인하고 수정할 수 있습니다</p>
            </div>
            
            <div className="myinfo-info-cards">
                <div className="myinfo-info-card">
                    <div className="myinfo-card-header">
                        <div className="myinfo-card-icon">📧</div>
                        <h3 className="myinfo-card-title">이메일</h3>
                    </div>
                    <div className="myinfo-card-content">
                        <p className="myinfo-card-value">{user?.email || 'user@example.com'}</p>
                        <p className="myinfo-card-status verified">✓ 인증됨</p>
                    </div>
                </div>
                
                <div className="myinfo-info-card">
                    <div className="myinfo-card-header">
                        <div className="myinfo-card-icon">🆔</div>
                        <h3 className="myinfo-card-title">사용자 ID</h3>
                    </div>
                    <div className="myinfo-card-content">
                        <p className="myinfo-card-value">{user?.userId || 'user123'}</p>
                        <p className="myinfo-card-status">변경 불가</p>
                    </div>
                </div>
                
                <div className="myinfo-info-card">
                    <div className="myinfo-card-header">
                        <div className="myinfo-card-icon">📅</div>
                        <h3 className="myinfo-card-title">가입일</h3>
                    </div>
                    <div className="myinfo-card-content">
                        <p className="myinfo-card-status">함께한 지 {daysActive || 30}일</p>
                    </div>
                </div>
            </div>

            {/* 설정 섹션 */}
            <div className="myinfo-settings-section">
                <div className="myinfo-section-header">
                    <h3 className="myinfo-settings-title">개인화 설정</h3>
                    <p className="myinfo-settings-subtitle">앱 사용 환경을 설정하세요</p>
                </div>
                
                <div className="myinfo-settings-group">
                    <div className="myinfo-setting-item">
                        <div className="myinfo-setting-info">
                            <div className="myinfo-setting-header">
                                <span className="myinfo-setting-icon">{isDarkMode ? '🌙' : '☀️'}</span>
                            </div>
                            <div className="myinfo-setting-content">
                                <span className="myinfo-setting-name">다크 모드</span>
                                <span className="myinfo-setting-desc">
                                    {isDarkMode ? '어두운 테마를 사용 중입니다' : '밝은 테마를 사용 중입니다'}
                                </span>
                                <div className="myinfo-setting-status">
                                    <span>현재 테마: {isDarkMode ? '다크 모드' : '라이트 모드'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="myinfo-toggle-wrapper">
                            <span className="myinfo-toggle-label">Toggle</span>
                            <label className="myinfo-toggle">
                                <input 
                                    type="checkbox" 
                                    checked={isDarkMode}
                                    onChange={handleDarkModeToggle}
                                />
                                <span className="myinfo-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="myinfo-action-buttons">
                <button
                    className="myinfo-action-btn primary"
                    onClick={() => setEditOpen(true)}
                >
                    <span className="myinfo-btn-icon">✏️</span>정보 수정
                </button>
                <button
                    className="myinfo-action-btn secondary"
                    onClick={() => setPasswordOpen(true)}
                >
                    <span className="myinfo-btn-icon">🔐</span>비밀번호 변경
                </button>
                <button
                    className="myinfo-action-btn danger"
                    onClick={() => setWithdrawOpen(true)}
                >
                    <span className="myinfo-btn-icon">🗑️</span>회원 탈퇴
                </button>
            </div>

            {editOpen && (
                <NicknameEditModal
                    currentNickname={user.nickname}
                    userId={user.userId}
                    onSave={handleNicknameSave}
                    onClose={() => setEditOpen(false)}
                />
            )}
            {passwordOpen && (
                <PasswordChangeModal
                    onSave={handlePasswordSave}
                    onClose={() => setPasswordOpen(false)}
                />
            )}
            {withdrawOpen && (
                <WithdrawModal
                    onClose={() => setWithdrawOpen(false)}
                    onWithdrawSuccess={handleWithdrawSuccess}
                />
            )}
        </div>
    );
};

export default MyInfo;