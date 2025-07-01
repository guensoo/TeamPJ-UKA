import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../Context/BoardContext';
import './AllBoard.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const Notice = () => {
    const { posts } = useBoard();
    const [notice, setNotice] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('latest');
    const [sortAsc, setSortAsc] = useState(false); // 오름차순/내림차순

    const [searchKeyword, setSearchKeyword] = useState(''); //키워드
    const [filteredPosts, setFilteredPosts] = useState([]); //검색된 게시글 배열
    const [isSearching, setIsSearching] = useState(false);
    const [confirmKeyword, setConfirmKeyword] = useState('');
    const [searchOption, setSearchOption] = useState('title');

    const itemsPerPage = 10;

    const API_BASE_URL = 'http://localhost:8888';

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/board`);
                console.log('게시글 데이터:', res.data);
                setNotice(res.data.filter(post => post.category === "NOTICE"));
            } catch (error) {
                console.error('게시글 불러오기 실패', error);
                Swal.fire({
                    icon: 'error',
                    title: '게시글 불러오기 실패',
                    text: '서버에서 게시글을 불러오지 못했습니다.'
                });
                navigate('/board/all');
            }
        }
        fetchBoard();
    },[])

	// 정렬 함수
        const sortPosts = (posts) => {
            const order = sortAsc ? -1 : 1;
    
            return [...posts].sort((a, b) => {
                if (sortOption === 'latest') return order * (new Date(b.createdAt) - new Date(a.createdAt));
                if (sortOption === 'views') return order * (b.views - a.views);
                if (sortOption === 'likes') return order * (b.likes - a.likes);
                if (sortOption === 'comment') return order * (b.comment - a.comment);
                return 0;
            });
        };
    
    //정렬된 공지사항
    const noticedChats = useMemo(() => 
        sortPosts(notice.map(post => ({ ...post, category: 'NOTICE' })))
    ,[notice, sortOption, sortAsc]);

    // 정렬된 검색 결과
    const sortedFilteredPosts = useMemo(() =>
        sortPosts(filteredPosts), [filteredPosts, sortOption, sortAsc]);

    const totalPages = Math.ceil(noticedChats.length / itemsPerPage);

	// 현재 페이지의 게시글만 추출
    const currentPosts = noticedChats.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

	// 페이지 버튼 생성 로직
    const getPageNumbers = () => {
        const maxButtons = 5; //페이지 바에서 최대 보여주는 버튼 개수
		const groupIndex = Math.floor((currentPage - 1) / maxButtons)
		const start = groupIndex * maxButtons + 1;
        const end = Math.min( totalPages, start + maxButtons - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

	//타이틀 클릭시
    const handleTitleClick = (post) => {
        navigate(`/board/notice/detail/${post.category}/${post.id}`, { state: { state: { filteredList: isSearching ? sortedFilteredPosts : noticedChats, } } });  
    };

	//글쓰기 버튼
    const handleWrite = () => {
        navigate('/board/notice/form');
    };

    // 날짜 포맷 함수
    const formatDate = (date) => {
        const d = new Date(date);
        const year = String(d.getFullYear()).slice(2);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}.${month}.${day}`;
    };

    return (
        <div className="board-container">
        {/* <h1 className="board-title">전체 게시판</h1> */}

        <div className="board-controls">
            <select 
                value={sortOption} 
                onChange={(e) => {
                    setSortOption(e.target.value); 
                    setSortAsc(false);
                }}>
            <option value='latest' selected>최신순</option>
            <option value='comment'>댓글순</option>
            <option value='views'>조회순</option>
            <option value='likes'>추천순</option>
            </select>
            <button className="write-btn" onClick={handleWrite}>글쓰기</button>
        </div>

        <table className="board-table">
            <thead>
            <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
				<th className='comment-header'>
					<button className="filter-btn" onClick={() => {
                        if(sortOption === 'comment'){
                            setSortAsc(!sortAsc);
                        } else{
                            setSortOption('comment');
                            setSortAsc(true);
                        }
                        }}>
                        댓글 {sortOption === 'comment' ? (!sortAsc ? '∨' : '∧') : '∨'}
                    </button>
				</th>
				<th>
					<button className="filter-btn" onClick={() => {
                        if(sortOption === 'views'){
                            setSortAsc(!sortAsc);
                        } else{
                            setSortOption('views');
                            setSortAsc(true);
                        }
                        }}>
                        조회 {sortOption === 'views' ? (!sortAsc ? '∨' : '∧') : '∨'}
                    </button>
					</th>
				<th>
					<button className="filter-btn" onClick={() => {
                        if(sortOption === 'likes'){
                            setSortAsc(!sortAsc);
                        } else{
                            setSortOption('likes');
                            setSortAsc(true);
                        }
                        }}>
                        추천 {sortOption === 'likes' ? (!sortAsc ? '∨' : '∧') : '∨'}
                    </button>
				</th>
				<th>
					<button className="filter-btn" onClick={() => {
                        if(sortOption === 'latest'){
                            setSortAsc(!sortAsc);
                        } else{
                            setSortOption('latest');
                            setSortAsc(true);
                        }
                        }}>
                        작성일 {sortOption === 'latest' ? (!sortAsc ? '∨' : '∧') : '∨'}
                    </button>
				</th>
            </tr>
            </thead>
            <tbody>
            {/* 공지사항 매핑 */}
            {currentPosts.map((post) => (
                <tr key={`notice-${post.id}`} className="notice-row">
                    <td className='notice-tab'>공지사항</td>
                    <td className="notice-title" onClick={() => handleTitleClick(post)}>📢 {post.title}</td>
                    <td className='notice-cell'>{post.author}</td>
                    <td className='notice-cell'>{post.comment}</td>
                    <td className='notice-cell'>{post.views}</td>
                    <td className='notice-cell'>{post.likes}</td>
                    <td className='notice-cell'>{formatDate(post.createdAt)}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="pagination">
			<button
				onClick={() => {
					const prevGroupStart = Math.ceil((currentPage - 1) / 5 - 1) * 5;
					//ex) currentPage = 14 -> ceil((14-1)/5-1) = 2 , 2*5 = 10page
					const prevGroupPage = Math.max(prevGroupStart, 1); //둘중에 최댓값의 페이지로 이동
					setCurrentPage(prevGroupPage);
				}}
				disabled={currentPage === 1}
			>
			«
			</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
            {getPageNumbers().map(page => (
            <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
            >
                {page}
            </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
			<button
				onClick={() => {
					const nextGroupStart = Math.floor((currentPage - 1) / 5 + 1) * 5 + 1;
					//ex) currentPage = 14 -> floor((14-1)/5+1) = 3, 3*5+1 = 16page
					const nextGroupPage = Math.min(nextGroupStart, totalPages); //둘중에 최솟값의 페이지의로 이동
					setCurrentPage(nextGroupPage);
				}}
				disabled={currentPage === totalPages}
			>
			»
			</button>
        </div>

        <div className="board-search">   
            <input type="text" placeholder="검색어를 입력해주세요" />
            <button className="search-btn">검색</button>                      
        </div>
    </div>
    );
};

export default Notice;