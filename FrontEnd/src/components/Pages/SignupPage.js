import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';

import MainLogo from '../../assets/MainLogo.png';

import './Auth.css';

import {
    checkUserIdDuplicate,
    checkNicknameDuplicate,
    getEmail,
    sendVerificationCodeApi,
    verifyEmailCode,
} from './SignupActive';
import { useAlert } from '../Customers/Context/AlertContext';


function validate(form) {
    // 금지 아이디/닉네임 리스트
    const bannedUserIds = ["admin"];
    const bannedNicknames = ["관리자"];

    // 아이디: 6~16글자, 영문/숫자만(특수문자 불가)
    const userId = form.userId?.trim() || "";
    if (!userId) return "아이디를 입력하세요.";
    if (userId.length < 6 || userId.length > 16) return "아이디는 6~16자여야 합니다.";
    if (!/^[a-zA-Z0-9]+$/.test(userId)) return "아이디는 영문과 숫자만 가능합니다.";
    if (bannedUserIds.includes(userId.toLowerCase())) return "사용할 수 없는 아이디입니다.";

    // 닉네임: 2~16글자, 한글/영문/숫자만(특수문자 불가)
    const nickname = form.nickname?.trim() || "";
    if (!nickname) return "닉네임을 입력하세요.";
    if (nickname.length < 6 || nickname.length > 16) return "닉네임은 6~16자여야 합니다.";
    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) return "닉네임은 한글, 영문, 숫자만 가능합니다.";
    if (bannedNicknames.includes(nickname)) return "사용할 수 없는 닉네임입니다.";

    // 비밀번호: 8자리 이상, 영문/숫자/특수문자 모두 포함, 공백 금지
    const password = form.password || "";
    if (!password) return "비밀번호를 입력하세요.";
    if (password.length < 8) return "비밀번호는 8자리 이상이어야 합니다.";
    if (!/[A-Za-z]/.test(password)) return "비밀번호에 영문이 포함되어야 합니다.";
    if (!/\d/.test(password)) return "비밀번호에 숫자가 포함되어야 합니다.";
    if (!/[^A-Za-z0-9]/.test(password)) return "비밀번호에 특수문자가 포함되어야 합니다.";
    if (/\s/.test(password)) return "비밀번호에 공백은 사용할 수 없습니다.";
    if (userId && password === userId) return "아이디와 비밀번호가 같을 수 없습니다.";

    // 비밀번호 확인
    if (password !== form.passwordCheck) return "비밀번호가 일치하지 않습니다.";

    // 이메일: 입력 및 길이(최대 50자 제한)
    const emailId = form.emailId?.trim() || "";
    if (!emailId) return "이메일을 입력하세요.";
    if (emailId.length > 30) return "이메일 아이디는 30자 이하로 입력하세요.";

    let emailDomain = form.emailDomain;
    let customDomain = form.customDomain?.trim() || "";
    if (emailDomain === "custom") {
        if (!customDomain) return "이메일 도메인을 입력하세요.";
        emailDomain = customDomain;
    }
    const email = `${emailId}@${emailDomain}`;
    if (email.length > 50) return "이메일은 50자 이하로 입력하세요.";
    // 이메일 정규식: 일반적 사용 범위에 맞춤
    if (!/^[\w.\-+]+@[\w.\-]+\.\w+$/.test(email)) return "유효한 이메일 주소를 입력하세요.";

    // 통과!
    return null;
}

export default function SignupPage() {
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [form, setForm] = useState({
        userId: '',
        nickname: '',
        password: '',
        passwordCheck: '',
        emailId: '',
        emailDomain: 'naver.com',
        customDomain: ''
    });
    const [error, setError] = useState(null);
    const [verifyError, setVerifyError] = useState('');
    const isPasswordMatch = form.password && form.passwordCheck && form.password === form.passwordCheck;

    const [resendCooldown, setResendCooldown] = useState(0);
    // 쿨타임 카운트다운
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // 1. 유효성 검사 실행!
        const errorMsg = validate(form);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        // 필드 값 바뀌면 체크/인증상태 무효화 (이전 인증/중복확인 무효처리)
        if (e.target.name === 'userId') setIsUserIdChecked(false);
        if (e.target.name === 'nickname') setIsNicknameChecked(false);
        if (
            e.target.name === 'emailId' ||
            e.target.name === 'emailDomain' ||
            e.target.name === 'customDomain'
        ) {
            setIsEmailVerified(false);
            setCodeSent(false);
        }
    };

    const handleDomainChange = (e) => {
        setForm({ ...form, emailDomain: e.target.value, customDomain: '' });
    };

    const sendVerificationCode = async () => {
        const email =
            form.emailDomain === 'custom'
                ? `${form.emailId}@${form.customDomain}`
                : `${form.emailId}@${form.emailDomain}`;

        // 이메일 포맷 검증
        if (!/^[\w.+-]+@([\w-]+\.)+[a-zA-Z]{2,10}$/.test(email)) {
            await showAlert({
                title: '유효한 이메일 주소를 입력하세요.',
                icon: 'warning',
            });
            return;
        }

        try {
            await sendVerificationCodeApi(email);
            setCodeSent(true);
            setResendCooldown(60); // 60초 쿨타임
            setForm(f => ({ ...f, duplicateCode: '' })); // 발송 후 인증코드 입력값 초기화

            await showAlert({
                title: '인증번호를 전송했습니다.',
                icon: 'success',
            });
        } catch (err) {
            await showAlert({
                title: '이메일 전송 실패',
                icon: 'error',
            });
        }
    };

    const handleVerifyEmailCode = async () => {
        try {
            await verifyEmailCode(form, showAlert, setIsEmailVerified);
            setVerifyError('');
        } catch (err) {
            setVerifyError('인증번호가 올바르지 않거나 만료되었습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isUserIdChecked) {
            await showAlert({
                title: '아이디 중복 확인을 해주세요.',
                icon: 'warning',
            });
            return;
        }

        if (!isNicknameChecked) {
            await showAlert({
                title: '닉네임 중복 확인을 해주세요.',
                icon: 'warning',
            });
            return;
        }

        if (!isEmailVerified) {
            await showAlert({
                title: '이메일 인증을 완료해주세요.',
                icon: 'warning',
            });
            return;
        }

        const email = form.emailDomain === 'custom'
            ? `${form.emailId}@${form.customDomain}`
            : `${form.emailId}@${form.emailDomain}`;

        try {
            await signup({ ...form, email });
            navigate('/login');
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || '회원가입 실패');
        }
    };

    // 인증 입력창/버튼 부분 분리
    const renderVerificationArea = () => {
        // 인증 성공시 입력 불가
        if (isEmailVerified) {
            return (
                <div style={{ color: '#22c55e', fontSize: '0.98rem', marginTop: 4 }}>
                    인증 성공!
                </div>
            );
        }
        // 인증번호 입력창 + 버튼
        return (
            <div className="inline-duplicate-wrapper">
                <input
                    type="text"
                    name="duplicateCode"
                    placeholder="인증번호 입력"
                    value={form.duplicateCode || ''}
                    onChange={handleChange}
                    required
                    disabled={!codeSent}
                    style={{ flex: 1 }}
                />
                {/* 인증번호 입력값이 있으면 "인증 확인" 버튼으로 전환 */}
                {(form.duplicateCode && codeSent) ? (
                    <button
                        type="button"
                        className="duplicate-check-button"
                        onClick={handleVerifyEmailCode}
                    >
                        인증 확인
                    </button>
                ) : (
                    <button
                        type="button"
                        className="duplicate-send-button"
                        onClick={sendVerificationCode}
                        disabled={resendCooldown > 0}
                        style={resendCooldown > 0 ? { background: "#eee", color: "#888", cursor: "not-allowed" } : {}}
                    >
                        {codeSent
                            ? (resendCooldown > 0
                                ? `재발송 (${resendCooldown}s)`
                                : '재발송'
                            )
                            : '번호 발송'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="auth-container">
                <img
                    src={MainLogo}
                    alt="회원가입"
                    className="main-logo"
                    style={{
                        display: "block",
                        margin: "0 auto 1.5rem auto",
                        maxWidth: "300px",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate('/')}
                />
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className="inline-field">
                        <label>아이디</label>
                        <div className="inline-wrapper">
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="duplicate-button"
                                onClick={() => checkUserIdDuplicate(form.userId, showAlert, setIsUserIdChecked)}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>
                    <div className="inline-field">
                        <label>닉네임</label>
                        <div className="inline-wrapper">
                            <input
                                type="text"
                                name="nickname"
                                value={form.nickname}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="duplicate-button"
                                onClick={() => checkNicknameDuplicate(form.nickname, showAlert, setIsNicknameChecked)}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>
                    <label>
                        비밀번호
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        비밀번호 확인
                        <input
                            type="password"
                            name="passwordCheck"
                            value={form.passwordCheck}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {form.passwordCheck && !isPasswordMatch && (
                        <div style={{ color: '#e53e3e', fontSize: '0.97rem', marginTop: 4 }}>
                            비밀번호가 일치하지 않습니다.
                        </div>
                    )}
                    <label>
                        이메일
                        <div className="email-group">
                            <input
                                type="text"
                                name="emailId"
                                placeholder="이메일"
                                value={form.emailId}
                                onChange={handleChange}
                                required
                                className="email-id"
                            />
                            <span className="email-at">@</span>
                            {form.emailDomain === 'custom' ? (
                                <input
                                    type="text"
                                    name="customDomain"
                                    placeholder="직접입력"
                                    value={form.customDomain}
                                    onChange={handleChange}
                                    required
                                    className="email-domain"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form.emailDomain}
                                    disabled
                                    className="email-domain"
                                />
                            )}
                            <select name="emailDomain" value={form.emailDomain} onChange={handleDomainChange} className="email-select">
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="custom">직접입력</option>
                            </select>
                        </div>
                    </label>
                    {/* 인증번호 영역 */}
                    <div className="inline-field">
                        <label>인증번호</label>
                        {renderVerificationArea()}
                        {verifyError && (
                            <div style={{ color: '#e53e3e', fontSize: '0.97rem', marginTop: 4 }}>
                                {verifyError}
                            </div>
                        )}
                    </div>
                    <div className="auth-form">
                        <button
                            type="submit"
                            className="signup-btn"
                            disabled={
                                !isUserIdChecked ||
                                !isNicknameChecked ||
                                !isEmailVerified ||
                                !isPasswordMatch
                            }
                        >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
            <p style={{ textAlign: 'center' }}>ⓒ 2025 멍냥입양소. All rights reserved.</p>
        </>

    );
}
