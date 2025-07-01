import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './CustomerLayout.css';
import Chatbot from './Chatbot';
import { useState } from 'react';
import FAQList from './FAQList';
import QnAList from './QnAList';

const CustomerLayout = ({children}) => {
	const location = useLocation();
    const [searchInput, setSearchInput] = useState(""); // FAQ 검색 인풋
    const [appliedKeyword, setAppliedKeyword] = useState(""); // 실제 적용된 검색어
    const [faqResetFlag, setFaqResetFlag] = useState(0);
    const [qnaResetFlag, setQnaResetFlag] = useState(0);

    const handleSearch = (e) => {
        e.preventDefault(); // form submit 막기
        setAppliedKeyword(searchInput);
    };

  return (
    <div className="customer-layout">
      {/* 헤더 */}
      <div className="customer-header-container">
        <div className="customer-header-left">
          <h1 className="customer-title">고객센터</h1>
        </div>
		{location.pathname === '/customer/faq' && (
			<div className="customer-header-center">
				<form onSubmit={handleSearch}>
					<input
						className="customer-search-input"
						type="text"
						placeholder="자주 묻는 질문 검색"
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
					/>
					<button type="submit" className="customer-search-button">🔍</button>
				</form>
			</div>
		)}
        <div className="customer-header-right">
          
        </div>
      </div>

      {/* 탭 메뉴 */}
      <nav className="customer-mini-tab-bar">
        <NavLink
            to="/customer/faq"
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setFaqResetFlag(flag => flag + 1)}
        >
            FAQ
        </NavLink>
        <NavLink
            to="/customer/qna"
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setQnaResetFlag(flag => flag + 1)}
        >
            QnA
        </NavLink>
        <NavLink
            to="/customer/adoption"
            className={({ isActive }) => isActive ? 'active' : ''}
        >
            입양문의
        </NavLink>
      </nav>

      	{/* 라우트 출력 영역 */}
        <main className="customer-content">
            <Outlet />
        </main>

    </div>
  );
};

export default CustomerLayout;