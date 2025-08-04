import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/default.jpg';
import {
  Card, CardContent, CardMedia, Typography,
  Button, TextField, MenuItem, Dialog, DialogTitle, ListItemButton, ListItem
} from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Customers/Context/AlertContext';
import { animal } from "../DetailPage/DetailBodyData.js";
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/BaseUrl.js';

// import './RequestCard.css';   // 👈 아래 CSS 붙여서 이 파일로 사용

export const RequestComponent = ({
  img = `${defimg}`, kind = '', sex = '성별', age = '나이',
  name = '이름', local = '지역', time = '시간', phone,
  detail = '특징', url = '', row = false, no, list, selectedbreed,
}) => {

  const inputTheme = {
    border: '1px solid #cceeff',
    borderRadius: '8px',
    padding: '7px 10px',
    fontSize: '18px'
  };

  // 유저 정보
  const loginData = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loginData?.userId?.includes("admin") ? true : false;
  const currentUser = loginData?.nickname;

  // 사진 예시로 보여주기.
  const [preview, setPreview] = useState(img);
  const [newImg, setNewImg] = useState('');
  const theme = {
    '& .MuiFilledInput-root': {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '60px'
    },
    '& .MuiFilledInput-root:hover': { backgroundColor: '#f5f5f5' },
    '& .MuiFilledInput-root.Mui-focused': { backgroundColor: '#fff' },
    '& .MuiFilledInput-root::before': { borderBottom: 'none' },
  };

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 수정모드 상태관리
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    sex, age, name, local, time, phone, detail, no, img,
    kind: list.kind, selectedbreed: list.selectedbreed
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정모드 시작
  const handleUpdate = () => {
    if (!currentUser) return Swal.fire("로그인 필요", "로그인 후 이용해주세요.", "error");
    if (!isAdmin && loginData.seq !== list.user_no)
      return Swal.fire("수정 실패", "작성자만 수정 할 수 있습니다.", "error");
    setEditedValues(prev => ({
      ...prev, no: no, img: list.img, selectedbreed: list.selectedbreed,
      kind: list.kind === '기타' ? 'etc' : list.kind === '강아지' ? 'dog' : 'cat'
    }));
    setIsEditing(true);
  };

  //이미지 등록
  const handleImgChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setNewImg(file);
      setPreview(URL.createObjectURL(file));
    } catch (error) { }
  };

  // 간접 클릭
  const handleOnClick = () => {
    document.querySelector('.RWimageinput').click();
  };

  // [PUT]
  const handleSave = async () => {
    let imageUrl = null;
    if (newImg) {
      const imageForm = new FormData();
      imageForm.append("file", newImg);
      imageForm.append("userId", loginData.userId);
      try {
        const uploadImg = await fetch(`${BASE_URL}/request/image`, {
          method: "POST",
          body: imageForm
        });
        const result = await uploadImg.json();
        imageUrl = result.imageUrl;
      } catch (error) { }
    }

    setIsEditing(false);
    const newData = {
      ...editedValues,
      kind: editedValues.kind === 'etc' ? '기타' : editedValues.kind === 'cat' ? '고양이' : '강아지',
      img: imageUrl === undefined ? list.img : imageUrl
    };
    setEditedValues(newData);

    try {
      await fetch(`${BASE_URL}/request`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      await showAlert({ title: '수정이 완료 되었습니다.' });
      navigate(0);
    } catch (error) { }
  };

  //[Delete]
  const handleDelete = async () => {
    if (!currentUser) return Swal.fire("로그인 필요", "로그인 후 이용해주세요.", "error");
    if (!isAdmin && loginData.seq !== list.user_no)
      return Swal.fire("삭제 실패", "작성자만 삭제 할 수 있습니다.", "error");

    try {
      const result = await showAlert({
        title: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '네',
        cancelButtonText: '아니요',
        icon: 'warning'
      });

      if (result.isConfirmed) {
        await fetch(`${BASE_URL}/request/${list.no}`, { method: 'DELETE' });
        await showAlert({ title: '삭제가 완료 되었습니다.' });
        navigate(0);
      }
    } catch (error) { }
  };

  return (
    <Card className="RequestCard" raised={true}>
      {/* 1. 사진 */}
      <div className="RequestCard-media">
        <CardMedia
          component="img"
          image={preview}
          onClick={isEditing ? handleOnClick : undefined}
          className="RequestCard-img"
        />
        <input className='RWimageinput' type='file' onChange={handleImgChange} style={{ display: 'none' }} />
      </div>

      {/* 2. 설명 */}
      <div className="RequestCard-content">
        {/* 상단 바 */}
        {isEditing ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: 'white', padding: '6px 0' }}>
            {/* 품종 선택 상자 */}
            <TextField
              variant='filled'
              select
              label="종류"
              name="kind"
              value={editedValues.kind}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 100, marginRight: '10px' }}
            >
              <MenuItem value={'dog'}>강아지</MenuItem>
              <MenuItem value={'cat'}>고양이</MenuItem>
              <MenuItem value={'etc'}>기타</MenuItem>
            </TextField>
            {editedValues.kind === 'etc' ?
              <input type='text' value={editedValues.selectedbreed}
                onChange={e => setEditedValues(prev => ({ ...prev, selectedbreed: e.target.value }))} />
              :
              <>
                <Button variant="contained"
                  sx={{ minWidth: '80px' }}
                  onClick={editedValues.kind === '' ? undefined : () => setOpen(true)}
                >
                  {editedValues.selectedbreed}
                </Button>
                <Dialog
                  onClose={() => setOpen(!open)}
                  open={open}
                >
                  <DialogTitle sx={{ background: '#cceeff' }}>품종을 선택하세요</DialogTitle>
                  {animal[editedValues.kind === 'cat' ? 'cat' : 'dog'].map((animal, index) => (
                    <ListItemButton key={index}
                      onClick={() => {
                        setEditedValues(prev => ({ ...prev, selectedbreed: Object.keys(animal)[0] }));
                        setOpen(false);
                      }}>
                      <ListItem disablePadding sx={{ border: '1px solid #cceeff' }}>
                        {<img className="DBdialogimg" src={`/img/${editedValues.kind}_picture/${Object.values(animal)[0]}.jpg`} alt="품종" />}
                        {Object.keys(animal)[0]}
                      </ListItem>
                    </ListItemButton>
                  ))}
                </Dialog>
              </>
            }
            <TextField
              variant='filled'
              select
              label="성별"
              name="sex"
              value={editedValues.sex}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={true}>수컷</MenuItem>
              <MenuItem value={false}>암컷</MenuItem>
            </TextField>
            <TextField
              variant='filled'
              label="나이"
              name="age"
              value={editedValues.age}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 80 }}
            />
            <TextField
              variant='filled'
              label="이름"
              name="name"
              value={editedValues.name}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 80 }}
            />
          </div>
        ) : (
          <Typography
            sx={{
              backgroundColor: '#ff6666', color: 'white', textAlign: 'center',
              padding: '8px 4px', fontSize: '1.1rem', borderRadius: '6px'
            }}
            variant="h6"
            component="div"
          >
            🐾[{editedValues.kind}] {editedValues.selectedbreed} | 🧸{editedValues.sex === true ? '수컷' : '암컷'} | 🕒{editedValues.age} | 🏷️{editedValues.name}
          </Typography>
        )}

        {/* 본문/설명 */}
        <CardContent
          className="RequestCard-CardContent"
        >
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <TextField fullWidth variant='filled' label="실종 장소" name="local" value={editedValues.local} onChange={handleChange} />
                <TextField fullWidth variant='filled' label="실종 날짜" name="time" value={editedValues.time} onChange={handleChange} />
              </div>
              <TextField variant='filled' label="연락수단" value={editedValues.phone} onChange={e => setEditedValues(prev => ({ ...prev, phone: e.target.value }))} />
              <TextField
                variant='filled'
                label="특징"
                name="detail"
                value={editedValues.detail}
                onChange={handleChange}
                multiline
              />
            </div>
          ) : (
            <div>
              <Typography sx={inputTheme} gutterBottom variant="h5" component="div">
                <b>실종 장소</b>: {editedValues.local}
              </Typography>
              <Typography sx={inputTheme} gutterBottom variant="h5" component="div">
                <b>실종 시간</b>: {editedValues.time}
              </Typography>
              <Typography sx={inputTheme} gutterBottom variant="h5" component="div">
                <b>연락수단</b>: {editedValues.phone}
              </Typography>
              <Typography
                sx={{ ...inputTheme, fontSize: '18px', whiteSpace: 'pre-line', height: '70px' }}
                gutterBottom
                variant="h5"
                component="div"
              >
                <b>특징</b>: {editedValues.detail}
              </Typography>
            </div>
          )}

          {/* 버튼 쪽 */}
          <div className="RequestCard-actions">
            {isEditing ? (
              <>
                <Button variant="outlined" color="success" onClick={handleSave}>저장</Button>
                <Button variant="outlined" color="error" onClick={() => {
                  setIsEditing(false);
                  navigate(0);
                }}>취소</Button>
              </>
            ) : (
              <Button variant="outlined" color="primary" onClick={handleUpdate}>수정</Button>
            )}
            <Button variant="outlined" color="primary" onClick={handleDelete}>삭제</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
