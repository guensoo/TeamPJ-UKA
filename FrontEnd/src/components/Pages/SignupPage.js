import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { signup } from '../../api/auth';

import MainLogo from '../../assets/MainLogo.png';

import './Auth.css';

export default function SignupPage() {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDomainChange = (e) => {
        setForm({ ...form, emailDomain: e.target.value, customDomain: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
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
                <form onSubmit={handleSubmit} className="auth-form">
                    <label>
                        아이디
                        <input
                            type="text"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        닉네임
                        <input
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            required
                        />
                    </label>
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
                    <button type="submit">회원가입</button>
                </form>
            </div>
        <p style={{textAlign : 'center'}}>ⓒ 2025 멍냥입양소. All rights reserved.</p>
        </>

    );
}
