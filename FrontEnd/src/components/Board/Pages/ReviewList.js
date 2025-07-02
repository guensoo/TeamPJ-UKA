import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardList.css';
import Swal from 'sweetalert2';
import { fetchAllPosts } from '../../../api/BoardApi';

const ReviewList = () => {
    const [posts, setPosts] = useState([]);

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

    const categoryLabels = {
        NOTICE: '공지사항',
        CHAT: '속닥속닥',
        REVIEW: '입양후기'
    };

    //게시글 불러오기
    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const data = await fetchAllPosts();
                setPosts(data);
            } catch (err) {
                console.error('게시글 불러오기 실패', err);
                Swal.fire('오류', '게시글 불러오기 중 오류가 발생했습니다.', 'error');
            }
        };
        getAllPosts();
    }, []);

    // 게시글 정렬
    const sortPosts = (postList) => {
        const order = sortAsc ? -1 : 1;

        return [...postList].sort((a, b) => {
            if (sortOption === 'view') return order * (b.view - a.view);
            if (sortOption === 'likes') return order * (b.likes - a.likes);
            if (sortOption === 'comment') return order * (b.comment - a.comment);
            if (sortOption === 'latest') {
                const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
                const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
                return order * (dateB - dateA);
            }
            return 0;
        });
    };

    const reviewPosts = sortPosts(posts.filter(p => p.category === "REVIEW"));

    //검색 함수
    const handleSearch = () => {
        const keyword = searchKeyword.trim();

        if(keyword.length === 0){
            setIsSearching(false);
            setFilteredPosts([]);
            setCurrentPage(1);
            return;
        }

        if(keyword.length < 2){
            Swal.fire({
                icon: 'warning',
                title: '검색어 오류',
                text: '검색어는 최소 2글자 이상 입력해주세요.'
            });
            return;
        }

        const filtered = reviewPosts.filter(post => {
            if(searchOption === 'title'){
                return post.title.toLowerCase().includes(keyword.toLowerCase())
            }
            else if(searchOption === 'author'){
                return post.author.toLowerCase().includes(keyword.toLowerCase())
            }
            return false;
        });

        setFilteredPosts(filtered);
        setCurrentPage(1); // 검색시 첫 페이지로 이동
        setIsSearching(true);
        setConfirmKeyword(keyword);
        // setSearchKeyword('')
    }

    // 현재 페이지에 보여줄 게시글
    const paginatedPosts = isSearching ? filteredPosts : reviewPosts;
    const displayedPosts = paginatedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    //searching 여부에 따라 페이징
    const totalPages = Math.max(1, Math.ceil(
        (isSearching ? filteredPosts.length : displayedPosts.length) / itemsPerPage));

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
        navigate(`/board/review/detail/${post.id}`, { state: { filteredList: isSearching ? filteredPosts : displayedPosts, } });
    };

	//글쓰기 버튼
    const handleWrite = () => {
        navigate('/board/review/form');
    };

    //검색한 키워드 강조
    const highlightKeyword = (text, keyword) => {
        if(!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? <b key={index}>{part}</b> : <span key={index}>{part}</span>
        );
    }

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
            <div className="board-controls">
                <select className='board-options'
                    value={sortOption} 
                    onChange={(e) => {setSortOption(e.target.value); setSortAsc(false);}}
                >
                <option value='latest' selected>최신순</option>
                <option value='view'>조회순</option>
                <option value='likes'>추천순</option>
                <option value='comment'>댓글순</option>
                </select>
                <button className="board-write-btn" onClick={handleWrite}>글쓰기</button>
            </div>

            <table className="board-table">
                <thead>
                <tr>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th className='comment-header'>
                        <button className="filter-btn" onClick={() => {
                            if(sortOption === 'view'){
                                setSortAsc(!sortAsc);
                            } else{
                                setSortOption('view');
                                setSortAsc(true);
                            }
                        }}> 조회 {sortOption === 'view' ? (!sortAsc ? '∨' : '∧') : '∨'}
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
                        }}> 추천 {sortOption === 'likes' ? (!sortAsc ? '∨' : '∧') : '∨'}
                        </button>
                    </th>
                    <th>
                        <button className="filter-btn" onClick={() => {
                            if(sortOption === 'comment'){
                                setSortAsc(!sortAsc);
                            } else{
                                setSortOption('comment');
                                setSortAsc(true);
                            }
                        }}> 댓글 {sortOption === 'comment' ? (!sortAsc ? '∨' : '∧') : '∨'}
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
                        }}> 작성일 {sortOption === 'latest' ? (!sortAsc ? '∨' : '∧') : '∨'}
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {/* 입양후기 게시글 매핑 */}
                {displayedPosts.length > 0 ? (
                    displayedPosts.map((post) => (
                    <tr key={`${post.category}-${post.id}`}>
                            <td>{categoryLabels[post.category]}</td>
                            <td className="title-cell" onClick={() => handleTitleClick(post)}>
                                <div className='board-cell-text'>
                                    {searchOption === 'title' 
                                        ? highlightKeyword(post.title, isSearching ? confirmKeyword : '')
                                        : post.title
                                    }
                                </div>
                            </td>
                            <td>
                                <div className='board-cell-text'>
                                    {searchOption === 'author' 
                                        ? highlightKeyword(post.author, isSearching ? confirmKeyword : '')
                                        : post.author
                                    }
                                </div>
                            </td>
                            <td>
                                <div className='board-cell-text' style={{marginLeft:15}}>{post.view}</div>
                            </td>
                            <td>
                                <div className='board-cell-text' style={{marginLeft:20}}>{post.likes}</div>
                            </td>
                            <td>
                                <div className='board-cell-text' style={{marginLeft:20}}>{post.comment}</div>
                            </td>
                            <td>
                                <div className='board-cell-text' style={{marginLeft:15}}>
                                    {post.updatedAt ? formatDate(post.updatedAt) : formatDate(post.createdAt)}
                                </div>
                            </td>
                    </tr>           
                    ))
                ) : (
                    <tr>
                        <td colSpan='7' style={{color: '#999'}}> 🔍 해당 게시글이 없습니다.</td>
                    </tr>
                )
            }
                </tbody>
            </table>

            <div className="board-pagination">
                <button
                    onClick={() => {
                        const prevGroupStart = Math.ceil((currentPage) / 5 - 1) * 5;
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
                <select className='board-search-option'
                    value={searchOption}
                    onChange={e => setSearchOption(e.target.value)}
                    >
                    <option value='title' selected>제목</option>
                    <option value='author'>작성자</option>
                </select>
                <input 
                    type="text" 
                    placeholder="검색어를 입력해주세요"
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                />
                <button className="search-btn" onClick={handleSearch}>검색</button>                      
            </div>
        </div>
    );
};

export default ReviewList;