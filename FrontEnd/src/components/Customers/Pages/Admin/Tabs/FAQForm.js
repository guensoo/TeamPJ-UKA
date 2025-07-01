import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../Context/AlertContext';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import color from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '../../WriteButton.css';
import '../../Form.css';
import './AdminDetail.css';
import { createFaq } from '../../../../../api/CustomerApiData';

const FAQForm = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        // 제목 포커싱
        document.querySelector('.customer-faq-form-title input')?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const content = editorRef.current?.getInstance().getHTML();

        if (!title.trim()) {
            await showAlert({ title: '제목을 입력해주세요.', icon: 'warning' });
            return;
        }
        if (!content || content.trim() === '') {
            await showAlert({ title: '내용을 입력해주세요.', icon: 'warning' });
            return;
        }

        const result = await showAlert({
            title: 'FAQ를 등록하시겠습니까?',
            text: '작성한 내용을 등록할까요?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
        });
        if (!result || !result.isConfirmed) return;

        try {
            await createFaq({
                faqQuestion: title,
                faqAnswer: content,
                // faqCategory: '', // 옵션 있으면 여기에 추가
            });

            await showAlert({
                title: 'FAQ 등록 완료!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            navigate('/customer/faq');
        } catch (err) {
            await showAlert({
                title: '등록 실패',
                text: '서버 오류가 발생했습니다.',
                icon: 'error'
            });
        }
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
        }

    return (
        <div className="customer-faq-form">
            <h2>FAQ 글쓰기</h2>
            <form onSubmit={handleSubmit}>
                <div className="customer-faq-form-title">
                    <label style={{marginRight:10, fontWeight: 'bold'}}>제목</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ width: '683px', padding: '10px', marginBottom: '16px' }}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className='customer-write-container'>
                    <label style={{fontWeight: 'bold'}}>내용</label><br />
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
                <div className='customer-write-button-container'>
                    <button type="submit" className="qna-action-btn">등록</button>
                    <button type="button" className="qna-action-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default FAQForm;
