import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../Context/AlertContext';
import { fetchQnaDetail, editQna } from '../../../api/CustomerApiData';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import color from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import SecretToggle from './SecretToggle';
import './WriteButton.css';
import './Form.css';

const QnAEdit = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const editorRef = useRef();
    const [title, setTitle] = useState(state?.title || '');
    const [content, setContent] = useState(state?.content || '');
    const [isSecret, setIsSecret] = useState(state?.isSecret ?? false);
    const [password, setPassword] = useState(state?.password || '');
    const [loading, setLoading] = useState(!state); // state 없으면 fetch 필요
    const user = JSON.parse(localStorage.getItem('user'));

    // 최초 진입: 서버에서 기존 QnA 데이터 fetch
    useEffect(() => {
        if (!state) {
            fetchQnaDetail(id).then(data => {
                setTitle(data.qnaTitle);
                setContent(data.qnaContent);
                setIsSecret(data.qnaIsSecret === 'Y');
                setPassword(data.qnaPassword || '');
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [id, state]);

    // 제출(수정완료)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const editorHtml = editorRef.current?.getInstance().getHTML();

        // 유효성 검사
        if (!title.trim()) {
            await showAlert({ title: '제목을 입력해주세요.', icon: 'warning' });
            return;
        }
        if (!editorHtml || editorHtml.trim() === '') {
            await showAlert({ title: '내용을 입력해주세요.', icon: 'warning' });
            return;
        }

        const result = await showAlert({
            title: 'QnA를 수정하시겠습니까?',
            text: '수정한 내용을 저장할까요?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
        });
        if (!result || !result.isConfirmed) return;

        try {
            await editQna(id, {
                qnaNo: Number(id),
                qnaTitle: title,
                qnaContent: editorHtml,
                qnaWriter: user?.nickname || '익명',
                qnaIsSecret: isSecret ? 'Y' : 'N',
                qnaPassword: isSecret ? password : '',
                qnaIsReported: 'N',
                qnaAnswer: '',
                qnaAnswerWriter: '',
                qnaReportCount: 0
            });

            await showAlert({
                title: '수정완료',
                text: '수정이 완료되었습니다.',
                icon: "success",
            });
            navigate(`/customer/qna/${id}`);
        } catch (err) {
            await showAlert({
                title: '수정 실패',
                text: '서버 오류가 발생했습니다.',
                icon: 'error',
            });
            console.error(err);
        }
    };

    // 취소 버튼
    const handleCancel = async () => {
        const result = await showAlert({
            title: '수정 취소',
            text: '수정을 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c5ce7',
            cancelButtonColor: '#636e72',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        });
        if (result.isConfirmed) {
            navigate(`/customer/qna/${id}`);
        }
    };

    return (
        <div className="customer-qna-form">
            <h2>QnA 수정하기</h2>
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
                    {!loading ? (
                        <Editor
                            ref={editorRef}
                            previewStyle="vertical"
                            height="500px"
                            initialEditType="wysiwyg"
                            initialValue={content || ''}
                            useCommandShortcut={true}
                            hideModeSwitch={true}
                            placeholder="내용을 입력하세요"
                            plugins={[color]}
                        />
                    ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            로딩 중...
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '16px' }}>
                    <SecretToggle
                        isSecret={isSecret}
                        setIsSecret={setIsSecret}
                        password={password}
                        setPassword={setPassword}
                    />
                </div>
                <div className='customer-qna-write-button-container'>
                    <button type="submit" className="qna-action-btn">수정 완료</button>
                    <button type="button" className="qna-action-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default QnAEdit;
