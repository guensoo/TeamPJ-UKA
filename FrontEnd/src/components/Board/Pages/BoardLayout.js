import { Outlet, NavLink, useLocation} from 'react-router-dom';
import './BoardLayout.css';

const BoardLayout = () => {

    const location = useLocation();
    const path = location.pathname;
    const currentCategory = location.state?.category || null;

    return (
        <div>
            {/* 헤더 */}
            <div className="boardLayout-header-container">
                <div className="boardLayout-header-left">
                    <h1 className="boardLayout-title">게시판</h1>
                </div>
            <div className="boardLayout-header-right">
                
            </div>       
        </div>

        {/* 탭 메뉴 */}
        <nav className="boardLayout-tab-bar">
            <NavLink
                to="/board/all"
                // className={({ isActive }) => isActive ? 'active' : ''}
                className={() =>
                    path.startsWith('/board/all') ? 'active' : ''
                }
            >
            전체게시판
            </NavLink>
            <NavLink
                to="/board/notice"
                // className={({ isActive }) => isActive ? 'active' : ''}
                className={() =>
                    path.startsWith('/board/notice') ? 'active' : ''
                }
            >
            공지사항
            </NavLink>
            <NavLink
                to="/board/chat"
                // className={({ isActive }) => isActive ? 'active' : ''}
                className={() =>
                    path.startsWith('/board/chat') ? 'active' : ''
                }
            >
            속닥속닥
            </NavLink>
            <NavLink
                to="/board/review"
                // className={({ isActive }) => isActive ? 'active' : ''}
                className={() =>
                    path.startsWith('/board/review') ? 'active' : ''
                }
            >
            입양후기
            </NavLink>
        </nav>

        {/* 라우트 출력 영역 */}
        <main className="boardLayout-content">
            <Outlet />
        </main>
        </div>
    );
}

export default BoardLayout;