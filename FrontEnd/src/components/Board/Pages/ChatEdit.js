import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './FormButton.css';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css'
import color from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { useAdmin } from '../../../api/AdminContext';
import { fetchPostById, updatePost } from '../../../api/BoardApi';

const ChatEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAdmin = useAdmin();

    const titleInputRef = useRef(null);
    const editorRef = useRef(null);

    const [post, setPost] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');

    const categoryLabels = {
        NOTICE: '공지사항',
        CHAT: '속닥속닥',
        REVIEW: '입양후기'
    };

    useEffect(() => {
        const loadPost = async () => {
            try {
                const fetchedPost = await fetchPostById(id);
                setPost(fetchedPost);
                setTitle(fetchedPost.title);
                setCategory(fetchedPost.category);
                editorRef.current?.getInstance().setMarkdown(fetchedPost.content);
                titleInputRef.current?.focus();
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
                Swal.fire('오류', '게시글을 불러오는 데 실패했습니다.', 'error');
            }
        };
        loadPost();
    }, [id]);

    if(!post){
        return <div>게시글이 없습니다.</div>
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const updatedContent = editorRef.current.getInstance().getHTML();

        const updatedPost = {
            ...post,
            title,
            category,
            content: updatedContent,
            updatedAt: new Date(),
        }

        Swal.fire({
            title: '게시글 수정',
            text: '수정하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',  // 보라색 확인 버튼
            cancelButtonColor: '#636e72',   // 회색 취소 버튼
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if(result.isConfirmed){
                try {
                    await updatePost(id, updatedPost);
                    Swal.fire({
                        title: '수정 완료',
                        text: '게시글이 수정되었습니다.',
                        icon: 'success',
                        confirmButtonColor: '#6c5ce7',
                        confirmButtonText: '확인'
                    }).then(() => {
                        navigate(`/board/chat/detail/${id}`);
                    });
                } catch (error) {
                    console.error('게시글 수정 실패:', error);
                    Swal.fire('오류', '게시글 수정에 실패했습니다.', 'error');
                }
            };
        })
    }

    //취소 버튼
    const handleCancel = () => {
        Swal.fire({
            title: '작성 취소',
            text: '작성을 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',  // 보라색 확인 버튼
            cancelButtonColor: '#636e72',   // 회색 취소 버튼
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then((result) => {
            if(result.isConfirmed){
                navigate(`/board/chat/detail/${id}`)
            }
        })
    }

    return (
        <div>
            <h2>게시글 수정하기</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{marginRight:10, fontWeight: 'bold'}}>카테고리</label>
                    <select 
                        style={{marginBottom: 16, padding: 5}} 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        >
                        {isAdmin && <option value='NOTICE'>{categoryLabels['NOTICE']}</option>} {/* 관리자만 공지사항 글쓰기 가능 */}
                        <option value='CHAT'>{categoryLabels['CHAT']}</option>
                        <option value='REVIEW'>{categoryLabels['REVIEW']}</option>                  
                    </select>
                </div>
                <div>
                    <label>제목</label><br />
                    <input
                        ref={titleInputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
                    />
                </div>
                <div>
                    <label>내용</label><br />
                    <Editor 
                        ref={editorRef}
                        previewStyle="vertical"
                        height="500px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        hideModeSwitch={true}
                        placeholder="내용을 입력하세요."
                        plugins={[color]}
                        initialValue={post?.content||''}
                    />
                </div>
                <div className='board-write-button-container'>
                    <button type="submit" className="board-write-button">완료</button>
                    <button type="button" className="board-write-button" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default ChatEdit;
