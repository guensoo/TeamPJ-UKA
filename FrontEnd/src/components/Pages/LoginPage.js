import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { AuthContext } from '../../AuthContext';

import MainLogo from '../../assets/MainLogo.png';
import CatRun from '../../assets/CatRun.gif';

import './Auth.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ userId: '', password: '' });
    const [error, setError] = useState(null);
    const { setUser } = useContext(AuthContext);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { token, user } = await login(form);
            setUser(user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || '로그인 실패');
        }
    };
    return (
        <>
            <div className="auth-container">
                <img
                    src={MainLogo}
                    alt="로그인"
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
                            type="userId"
                            name="userId"
                            value={form.userId}
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
                    <button type="submit">로그인</button>
                    <div style={{fontSize: "12px", color: "#0077b6", textAlign: "center" }}>
                        <Link to="/find-id" style={{ color: "#0077b6", textDecoration: "underline", fontWeight: 500 }}>
                            아이디 찾기
                        </Link>
                        <span style={{ color: "#bbb", margin: "0 8px" }}>|</span>
                        <Link to="/find-password" style={{ color: "#0077b6", textDecoration: "underline", fontWeight: 500 }}>
                            비밀번호 찾기
                        </Link>
                        <span style={{ color: "#bbb", margin: "0 8px" }}>|</span>
                        <Link to="/signup" style={{ color: "#666", textDecoration: "underline"}}>
                            회원가입
                        </Link>
                    </div>
                </form>
            </div>
            <div className="left-ad-bar">
                <img src={CatRun} alt="광고 배너" className="left-ad-img" />
            </div>
        </>
    );
}
