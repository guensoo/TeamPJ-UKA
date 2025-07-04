import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BoardDetail.css';
import Swal from 'sweetalert2';
import { fetchPostById, deletePost, toggleLikes, toggleReport, restorePost } from '../../../api/BoardApi';
import { createComment, createReply, fetchCommentsByBoard, fetchRepliesByComment, updateComment, deleteComment } from '../../../api/BoardCommentApi';
import CommentList from '../Comment/CommentList';
import { ViewCount } from '../utils/ViewCount';

const AllBoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const loginData = JSON.parse(localStorage.getItem("user"));
    const isAdmin = loginData?.userId?.includes("admin") ? true : false;
    // const currentUser = isAdmin ? "admin" : loginData?.nickname;
    const currentUser = loginData?.nickname;

    const [post, setPost] = useState(null);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);

    const categoryLabels = {
        NOTICE: '공지사항',
        CHAT: '속닥속닥',
        REVIEW: '입양후기'
    };

    //댓글
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    // 댓글 수정 상태 관리: 수정 중인 댓글 id, 수정할 텍스트
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    //대댓글
    const [replyTargetId, setReplyTargetId] = useState(null); // 댓글에 대한 답글 
    const [replyInput, setReplyInput] = useState({});

    // 대댓글 수정 상태 관리: 수정 중인 대댓글 id, 수정할 텍스트
    const [editReplyId, setEditReplyId] = useState(null);
    const [editReplyText, setEditReplyText] = useState('');

    //추천, 신고 상태
    const [isLiked, setIsLiked] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    //검색 필터링 리스트(useLocation)
    const filteredList = location.state?.filteredList || [];
    const noticedPosts = location.state?.noticedPosts || [];

    //게시글 ID 조회
    useEffect(() => {
        const getPostsById = async () => {
            try {
                await ViewCount(id); //조회수 증가
                const data = await fetchPostById(id,currentUser);
                setPost(data);
                setIsLiked(data.likedByCurrentUser);
                setIsReported(data.reportedByCurrentUser);
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
        getPostsById();
    },[id, navigate,currentUser])

    // 신고수 검사 및 일반유저 차단 처리
    useEffect(() => {
        if (post && post.report >= 5 && !isAdmin) {
        Swal.fire({
            icon: 'warning',
            title: '열람 불가',
            text: '신고가 5회 이상 접수되어 열람할 수 없습니다.',
            confirmButtonText: '목록으로 이동',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(() => {
            navigate('/board/all');
        });
        setBlocked(true);
        }
    }, [post, isAdmin, navigate]);

    //삭제 버튼
    const handleDelete = async () => {     
        const confirm = await Swal.fire({
            title: '삭제하시겠습니까?',
            html: `삭제된 게시글은 복구할 수 없습니다.<br>댓글을 모두 삭제하셔야 삭제가 완료됩니다.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            cancelButtonColor: '#636e72',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        });

        if (confirm.isConfirmed) {
            try {
                await deletePost(id);
                Swal.fire('삭제 완료', '게시글이 삭제되었습니다.', 'success');
                navigate('/board/all');
            } catch (error) {
                console.error(`게시글 삭제 실패(id: ${post.id}):`, error);
                Swal.fire('삭제 실패', '댓글을 모두 삭제해주세요.', 'error');
            }
        }
    }

    //이전글, 다음글
    const handleNavigate = (post) => {
        navigate(`/board/all/detail/${post.id}`, {
            state: {
                filteredList: filteredList,
                noticedPosts: noticedPosts
            }
        });
    }

    // 검색결과 이전글/다음글 세팅
    useEffect(() => {
        if(!post) return;

        const isNotice = post.category === "NOTICE";
        const targetList = isNotice ? noticedPosts : filteredList;

        if(!filteredList || filteredList.length === 0){
            setPrev(null);
            setNext(null);
            return;
        }

        const sortedList = [...targetList].sort((a,b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
            return dateB - dateA;
        });
        const idx = sortedList.findIndex(p => p.id === post.id);

        setPrev(sortedList[idx - 1] || null);
        setNext(sortedList[idx + 1] || null);

    },[post, filteredList, noticedPosts])

    //답글 조회(재귀)
    const fetchAllReplies = async (parentId) => {
        const replies = await fetchRepliesByComment(parentId);
        let allReplies = [...replies];

        for (const reply of replies) {
            const childReplies = await fetchAllReplies(reply.id);
            allReplies = allReplies.concat(childReplies);
        }

        return allReplies;
    };

    // 전체 댓글 조회
    const getAllComments = async () => {
        try {
            // 댓글 목록
            const commentsData = await fetchCommentsByBoard(id); //최상위 댓글들
            const allCommentsWithReplies = [...commentsData];

            for (const comment of commentsData) {
                // 대댓글 가져오기
                const replies = await fetchAllReplies(comment.id);
                allCommentsWithReplies.push(...replies);
            }

            setComments(allCommentsWithReplies);
        } catch (error) {
            console.error('댓글 및 대댓글 조회 실패', error);
        }
    };

    useEffect(() => {
        getAllComments();
    }, [id]);

    // 댓글 작성
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if(currentUser === undefined) return Swal.fire("로그인 필요","로그인 후 이용해주세요.","error");

        if (!commentInput.trim()) return;

        try {
            await createComment(id, {
                author: currentUser,
                content: commentInput.trim(),
            });
            setCommentInput('');
            // 작성 후 댓글 목록 재조회
            await getAllComments();
        } catch (error) {
            console.error('댓글 작성 실패', error);
            Swal.fire('오류', '댓글 작성에 실패했습니다.', 'error');
    }
    };

    //대댓글 작성
    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();

        // const input = replyInput[parentId]?.trim();
        const input = e.target.elements[0].value.trim();

        if (!input) return;

        try {
            await createReply(parentId, {
                author: currentUser,
                content: input,
            });
            setReplyInput((prev) => {
                const newInputs = { ...prev };
                delete newInputs[parentId];
                return newInputs;
            });
            setReplyTargetId(null);
            await getAllComments();
        } catch (error) {
            console.error('대댓글 작성 실패', error);
            Swal.fire('오류', '대댓글 작성에 실패했습니다.', 'error');
        }
    }

    // 댓글 수정
    const saveEditComment = async (editCommentId,editCommentText) => {
        if(!editCommentText || editCommentText.trim() === '') return;

        try {
            await updateComment(editCommentId, editCommentText.trim());
            await getAllComments(); // 수정 후 전체 댓글 목록 조회
            setEditCommentId(null);
            setEditCommentText('');    
        } catch (error) {
            console.error("댓글 수정 실패",error);
            Swal.fire('오류', '댓글 수정에 실패했습니다.', 'error');
        }
    };

    // 대댓글 수정 저장
    const saveEditReply = async () => {
        if (!editReplyText || editReplyText.trim() === '') return;
        try {
            await updateComment(editReplyId, editReplyText.trim());
            await getAllComments(); // 수정 후 목록 재조회
            setEditReplyId(null);
            setEditReplyText('');
        } catch (error) {
            console.error('답글 수정 실패', error);
            Swal.fire('오류', '답글 수정에 실패했습니다.', 'error');
        }  
    };

    const EditComment = (comment) => {
        setEditCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const EditReply = (comment) => {
        setEditReplyId(comment.id);
        setEditReplyText(comment.content);
    };

    //댓글 삭제
    const handleDeleteComment = async (id) => {
        const confirm = await Swal.fire({
            title: '댓글 삭제',
            text: '해당 댓글 및 대댓글이 삭제됩니다. 계속할까요?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e17055',
            cancelButtonColor: '#636e72',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        });

        if(confirm.isConfirmed){
            try {
                await deleteComment(id);
                await getAllComments();
                Swal.fire('삭제 완료', '댓글이 삭제되었습니다.', 'success');
            } catch (error) {
                console.error('댓글 삭제 실패', error);
                Swal.fire('오류', '댓글 삭제에 실패했습니다.', 'error');
            }
        }
        
    };

    //대댓글 삭제
    const handleDeleteReply = async (id) => {
        const confirm = await Swal.fire({
            title: '답글 삭제',
            text: '정말 삭제하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#e17055',
            cancelButtonColor: '#636e72',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        });

        if (confirm.isConfirmed) {
            try {
                await deleteComment(id);
                await getAllComments();
                Swal.fire('삭제 완료', '답글이 삭제되었습니다.', 'success');
            } catch (error) {
                console.error('답글 삭제 실패', error);
                Swal.fire('오류', '답글 삭제에 실패했습니다.', 'error');
            }
    }
    };

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    // 신고 5회 이상이고 일반유저라면 게시글 내용 렌더링 차단
    if (blocked) {
        return null;
    }

    //추천 버튼
    const handleLikesButton = async () => {
        if(currentUser === undefined) return Swal.fire("로그인 필요","로그인 후 이용해주세요.","error");
        try {
            const updatedPost = await toggleLikes(post.id, currentUser);
            setPost(updatedPost);
            setIsLiked(updatedPost.likedByCurrentUser);
        } catch (error) {
            console.error('추천 처리 실패:', error);
        }
    };

    //신고 버튼
    const handleReportButton = async () => {
        if(currentUser === undefined) return Swal.fire("로그인 필요","로그인 후 이용해주세요.","error");
        try {
            const updatedPost = await toggleReport(post.id, currentUser);
            setPost(updatedPost);
            setIsReported(updatedPost.reportedByCurrentUser);
        } catch (error) {
            console.error('신고 처리 실패:', error);
        }
    };

    //복원 버튼
    const handleRestore = async () => {
        const confirm = await Swal.fire({
            title: '신고 해제',
            text: '복원하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '해제',
            cancelButtonText: '취소',
        });

        if (confirm.isConfirmed) {
            try {
                await restorePost(post.id);
                Swal.fire('해제 완료', '신고 누적 상태가 해제되었습니다.', 'success');
                // 게시글 정보 새로고침
                const data = await fetchPostById(post.id, currentUser);
                setPost(data);
                setBlocked(false);
            } catch (error) {
                console.error('신고 해제 실패:', error);
                Swal.fire('오류', '신고 해제에 실패했습니다.', 'error');
            }
        }
    }

    return (
        <div style={{ minWidth:'1075px' }}>
            {/* 헤더 */}
            <div className='board-detail-title-container'>
                <p style={{marginTop: 20}}>[ {categoryLabels[post.category]} ]</p>  
                <div style={{textAlign: 'right', marginTop:15}}>
                    <span style={{color: '#ccc'}}>
                        조회수 {post.view} | 추천수 {post.likes} | 신고수 {post.report}
                    </span><br/>
                </div>         
            </div>
            <div className='board-detail-title-container'>
                <p style={{fontSize: 30}}>{post.title}</p>
                <div style={{textAlign: 'right', marginTop: 15}}>
                    <span style={{color: '#ccc'}}>작성자 : {post.author}</span><br/>
                    <span style={{color: '#ccc'}}>
                        {post.updatedAt && post.updatedAt !== post.createdAt ? `수정됨 ${new Date(post.updatedAt).toLocaleString()}` : new Date(post.createdAt).toLocaleString()}
                    </span>
                </div>  
            </div>
            <hr/>

            {/* 본문 */}
            <div className="board-detail-content" dangerouslySetInnerHTML={{ __html: post.content }}>
                {/* <p style={{minHeight: 250, fontSize:18}}>{post.content}</p> */}
            </div>

            {/* 버튼 */}
            <div className="board-detail-button-group">
                <button className="board-detail-button"
                    onClick={handleLikesButton}
                    style={{
                        backgroundColor: isLiked ? '#4895ff' : '#fff',
                        color: isLiked ? '#fff' : '#000'
                    }}
                > 👍추천
                </button>
                {post.category !== "NOTICE" &&
                    <button className="board-detail-report-button"
                        onClick={handleReportButton}
                        style={{
                            backgroundColor: isReported ? 'red' : '#fff',
                            color: isReported ? '#fff' : '#000',
                        }}
                    > 🚨신고
                    </button>
                }
                {isAdmin && 
                    <button className='board-detail-report-button' onClick={handleRestore}>
                        복원
                    </button>
                }
                {(isAdmin || (post.author === currentUser)) && (
                    <>
                        <button className="board-detail-button"
                            onClick={() => navigate(`/board/all/edit/${post.id}`, { state: post })}
                        > ✏️ 수정
                        </button>
                        <button className="board-detail-button"
                            onClick={handleDelete}
                        > 🗑 삭제
                        </button>
                    </>
                )}              
                <button className="board-detail-button"
                    onClick={() => navigate('/board/all')}       
                > ← 목록으로
                </button>
            </div>
                
            {/* 댓글 */}
            <strong>댓글({comments.length})</strong>
            <div style={{ marginTop: 12 }}>
                <CommentList
                    comments={comments}
                    currentUser={currentUser}
                    post={post}
                    isAdmin={isAdmin}
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteReply={handleDeleteReply}
                    saveEditComment={saveEditComment}
                    saveEditReply={saveEditReply}
                    replyTargetId={replyTargetId}
                    setReplyTargetId={setReplyTargetId}
                    replyInput={replyInput}
                    setReplyInput={setReplyInput}
                    handleReplySubmit={handleReplySubmit}
                    EditComment={EditComment}
                    EditReply={EditReply}
                    editCommentId={editCommentId}
                    editCommentText={editCommentText}
                    setEditCommentId={setEditCommentId}
                    setEditCommentText={setEditCommentText}
                    editReplyId={editReplyId}
                    editReplyText={editReplyText}
                    setEditReplyId={setEditReplyId}
                    setEditReplyText={setEditReplyText}
                />
            </div>
            {/* 최상위 댓글 입력폼 추가 */}
            <div style={{ marginTop: 12 }}>
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    style={{
                        flex: 1,
                        border: '1px solid #ccc',
                        borderRadius: 7,
                        fontSize: 14,
                        padding: '6px 12px',
                    }}
                    />
                    <button type="submit" className="board-detail-submit-button">
                    등록
                    </button>
                </form>
            </div>

            {/* 이전/다음글 */}
            <div className="board-post-navigation">
                {prev && (
                    <div 
                        className="board-post-nav-item" 
                        onClick={() => handleNavigate(prev)}
                    >
                        <span className="board-post-nav-label">◀️ 이전글</span>
                        <span className="board-post-nav-title">{prev.title}</span>
                    </div>
                )}
                {next && (
                    <div className="board-post-nav-item" onClick={() => handleNavigate(next)}>
                        <span className="board-post-nav-label">▶️ 다음글</span>
                        <span className="board-post-nav-title">{next.title}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBoardDetail;
