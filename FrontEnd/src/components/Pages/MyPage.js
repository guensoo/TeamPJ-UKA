import { useState, useEffect } from 'react';
import MyInfo from './MyInfo';
import MyActivity from './MyActivity';

import axios from 'axios';
import { BASE_URL } from '../../api/BaseUrl';

import './MyPage.css';
import '../../App.css';

const MyPage = () => {
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    });
    const [activeTab, setActiveTab] = useState('info');
    const [counts, setCounts] = useState({
        posts: 0,
        comments: 0,
        likes: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // 다크모드 적용
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            const isDarkMode = JSON.parse(savedDarkMode);
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }, []);

    // 활동 통계 조회
    const fetchStats = async () => {
        if (!user) return;
        setLoadingStats(true);
        try {
            const postsRes = await axios.get(`${BASE_URL}/api/users/myPost`, {
                params: { userId: user.seq }
            });
            const commentsRes = await axios.get(`${BASE_URL}/api/users/myComment`, {
                params: { userId: user.seq }
            });
            const likesRes = await axios.get(`${BASE_URL}/api/users/myLikes`, {
                params: { userId: user.userId }
            });

            setCounts({
                posts: postsRes.data.length,
                comments: commentsRes.data.length,
                likes: likesRes.data.length
            });
        } catch (error) {
            setCounts({ posts: 0, comments: 0, likes: 0 });
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line
    }, [user]);

    if (!user) {
        return (
            <div className="mypage-container">
                <div className="login-required">
                    <div className="login-icon">🔒</div>
                    <h2>로그인이 필요합니다</h2>
                    <p>마이페이지를 이용하려면 먼저 로그인해주세요.</p>
                    <button className="login-btn">로그인하기</button>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: 'info', label: '내 정보', icon: '👤' },
        { id: 'activity', label: '활동 내역', icon: '📊' }
    ];

    return (
        <div className="mypage-container">
            <div className="profile-header">
                <div className="profile-background">
                    <div className="profile-content">
                        <div className="profile-avatar">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="프로필" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <span>{user.nickname.charAt(0)}</span>
                                </div>
                            )}
                            <div className="avatar-badge">✨</div>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{user.nickname}</h1>
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loadingStats ? '-' : counts.posts}
                                    </span>
                                    <span className="stat-label">작성글 수</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loadingStats ? '-' : counts.comments}
                                    </span>
                                    <span className="stat-label">작성한 댓글 수</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {loadingStats ? '-' : counts.likes}
                                    </span>
                                    <span className="stat-label">좋아요 한 게시물 수</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mypage-main">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {activeTab === item.id && <div className="nav-indicator"></div>}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="main-content">
                    {activeTab === 'info' &&
                        <MyInfo
                            user={user}
                            setUser={setUser}
                            refetchStats={fetchStats}
                        />}
                    {activeTab === 'activity' &&
                        <MyActivity
                            refetchStats={fetchStats}
                        />}
                </div>
            </div>
        </div>
    );
};

export default MyPage;
