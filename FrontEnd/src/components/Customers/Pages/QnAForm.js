import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Context/AlertContext';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import color from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import './WriteButton.css';
import './Form.css';
import { createQna } from '../../../api/CustomerApiData';
import SecretToggle from './SecretToggle';

const QnAForm = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const { showAlert } = useAlert();
    const [isSecret, setIsSecret] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    //     if (!token) {
    //         showAlert({
    //             title: '로그인이 필요합니다.',
    //             icon: 'warning'
    //         }).then(() => {
    //             navigate('/login');
    //         });
    //         return;
    //     }
    // }, [navigate, showAlert]);


    useEffect(() => {
        // 제목 포커싱
        document.querySelector('.customer-qna-form-title input')?.focus();
    }, []);

    // 이후 user가 없으면 return null로 렌더링 막기
    // if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const content = editorRef.current?.getInstance().getHTML();

        // 제목/내용 비어있으면 경고
        if (!title.trim()) {
            await showAlert({
                title: '제목을 입력해주세요.',
                icon: 'warning',
            });
            return;
        }
        if (!content || content.trim() === '') {
            await showAlert({
                title: '내용을 입력해주세요.',
                icon: 'warning',
            });
            return;
        }

        const result = await showAlert({
            title: 'QnA를 등록하시겠습니까?',
            text: '작성한 내용을 등록할까요?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
        });

        if (!result || !result.isConfirmed) return;

        await createQna({
            qnaTitle: title,
            qnaContent: content,
            qnaIsSecret: isSecret ? 'Y' : 'N',
            qnaPassword: password,
            qnaWriter: user?.nickname // 또는 user.name 등 로그인 정보 기반
        });

        await showAlert({
            title: 'QnA 등록 완료!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
        });

        navigate('/customer/qna');
    };

    //취소 버튼
    const handleCancel = async () => {
        const result = await showAlert({
            title: '작성 취소',
            text: '작성을 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#636e72',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        });
        if (result.isConfirmed) {
            navigate('/customer/qna')
        }
    }

    return (
        <div className="customer-qna-form">
            <h2>QnA 글쓰기</h2>
            <form onSubmit={handleSubmit}>
                <div className="customer-qna-form-title">
                    <label style={{ marginRight: 10, fontWeight: 'bold' }}>제목</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ width: '98%', padding: '10px', marginBottom: '16px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div>
                    <label style={{ fontWeight: 'bold' }}>내용</label><br />
                    <Editor
                        ref={editorRef}
                        previewStyle="vertical"
                        height="500px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        hideModeSwitch={true}
                        placeholder="내용을 입력하세요"
                        plugins={[color]}
                    />
                </div>
                <div style={{ marginTop: '16px' }}>
                    <SecretToggle
                        isSecret={isSecret}
                        setIsSecret={setIsSecret}
                        password={password}
                        setPassword={setPassword}
                    />
                </div>
                <div className='customer-write-button-container'>
                    <button type="submit" className="qna-action-btn">등록</button>
                    <button type="button" className="qna-action-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default QnAForm;