import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../Context/ChatContext';
import './AllBoard.css';
import Swal from 'sweetalert2';

const ChatList = () => {
	const { chats } = useChat();
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const [sortOption, setSortOption] = useState('latest');
	const [sortAsc, setSortAsc] = useState(false); // 오름차순/내림차순

	const itemsPerPage = 10;

	//속닥속닥 게시글 매핑
	const chatsPosts = [
		...chats.map(post => ({ ...post, type: 'chat' })),
	].sort((a, b) => {
		const order = sortAsc ? -1 : 1; // 정렬 방향 설정

		if(sortOption === 'latest'){
			return order * (new Date(b.createdAt) - new Date(a.createdAt));
		} else if(sortOption === 'comment'){
			return order * (b.comment - a.comment);
		} else if(sortOption === 'views'){
			return order * (b.views - a.views);
		} else if(sortOption === 'likes'){
			return order * (b.likes - a.likes);
		}
	});

	const totalPages = Math.ceil(chatsPosts.length / itemsPerPage);

	// 현재 페이지의 게시글만 추출
	const currentPosts = chatsPosts.slice(
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
		if (post.isSecret) {
			Swal.fire({
				title: '🔒 비밀글입니다',
				text: '비밀번호를 입력해주세요',
				input: 'password',
				inputPlaceholder: '비밀번호',
				showCancelButton: true,
				confirmButtonColor: '#6c5ce7',  // 보라색 확인 버튼
				cancelButtonColor: '#636e72',   // 회색 취소 버튼
				confirmButtonText: '확인',
				cancelButtonText: '취소',
				inputAttributes: {
				autocapitalize: 'off',
				autocorrect: 'off'
			},
			preConfirm: (password) => {
				if (!password) {
					Swal.showValidationMessage('비밀번호를 입력해주세요!');
				}
				return password;
			}
			}).then((result) => {
				if (result.isConfirmed) {
					const inputPassword = result.value;
						if (handlePasswordConfirm(inputPassword, post)) {
							navigate(`/board/chat/${post.id}`, { state: { postType: post.type } });
						} else {
							Swal.fire({
								icon: 'error',
								title: '비밀번호가 틀렸습니다',
								confirmButtonColor: '#d63031',
							});
						}
				}
			});
		} else {
			navigate(`/board/chat/${post.id}`, { state: { postType: post.type } });
		}
	};

	//비밀번호 확인
	const handlePasswordConfirm = (inputPassword, post) => {
		if (inputPassword.trim() === post.password) {
			window.sessionStorage.setItem(`chat_access_${post.id}`, 'true');
			return true;
		}
		return false;
	};

	//글쓰기 버튼
	const handleWrite = () => {
		navigate('/board/chat/new');
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
			{/* 일반게시글 매핑 */}
			{currentPosts.map((post) => (
			<tr key={`${post.type}-${post.id}`}>
				<td>속닥속닥</td>
				<td className="title-cell" onClick={() => handleTitleClick(post)}>
				{post.isSecret ? '🔒 ' : ''}{post.title}
				</td>
				<td>{post.author}</td>
				<td>{post.comment}</td>
				<td>{post.views}</td>
				<td>{post.likes}</td>
				<td>{formatDate(post.createdAt)}</td>
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

export default ChatList;