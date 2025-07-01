import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import DropDownMenu from './DropDownMenu';
import MainLogo from '../../assets/MainLogo.png';

import { AuthContext } from '../../AuthContext';

import './MainHeader.css';

const MainHeaders = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        alert("추후 개발 예정!");
        return;
    }

    function isAdminUser(user) {
        if (!user) return false;
        // userId 또는 username에 "admin" 또는 "관리자"가 포함된 경우
        return (
            (user.userId && user.userId.toLowerCase().includes('admin'))
        );
    }

    return (
        <header className="main-header">
            <div className="header-left-section">
                <Link to="/">
                    <img src={MainLogo} alt="Logo" className="logo" />
                </Link>
            </div>

            <div className="header-right-section">
                <div className="header-auth-buttons">
                    {user ? (
                        isAdminUser(user)
                            ? <p><strong style={{color: "red"}}>관리자</strong> 계정으로 접속하였습니다.</p>
                            : <p>{user.userId} 회원님 반갑습니다.</p>
                    ) : (
                        <p>로그인 해주세요.</p>
                    )}
                {/* 여기 위 까지 관리자 테스트 */}
                    {user ? (
                        <>
                            {/* /profile */}
                            <Link to="/" onClick={handleProfile} className="profile-button">
                                마이페이지
                            </Link>
                            <button onClick={handleLogout} className="logout-button">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="signup-button">
                                회원가입
                            </Link>
                            <Link to="/login" className="login-button">
                                로그인
                            </Link>
                        </>
                    )}
                </div>
                
                <nav className="header-nav-links">
                    <Link to="/about" style={{marginRight : 25}}>입양하고싶어요</Link>
                    <Link to="/request" style={{marginRight : 10}}>찾고있어요</Link>
                    <DropDownMenu
                        title="게시판"
                        to="/board"
                        items={[
                            { label: '전체', to: '/board/all' },
                            { label: '공지사항', to: '/board/notice' },
                            { label: '속닥속닥', to: '/board/chat' },
                            { label: '입양후기', to: '/board/adoptionReview' },
                        ]}
                    />
                    <DropDownMenu
                        title="고객센터"
                        to="/customer/faq"
                        items={[
                            { label: 'FAQ', to: '/customer/faq' },
                            { label: 'Q&A', to: '/customer/qna' },
                            { label: '입양문의', to: '/customer/adoption' },
                            ...(user && isAdminUser(user) ? [{ label: '관리자 페이지', to: '/admin/reported' }] : []),
                        ]}
                    />
                </nav>
            </div>
        </header>
    );
};

export default MainHeaders;
