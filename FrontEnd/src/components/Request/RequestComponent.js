import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/default.jpg';
import { Card, CardContent, CardMedia, Typography, Button, TextField, MenuItem, Dialog, DialogTitle, ListItemButton, ListItem } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Customers/Context/AlertContext';
import { animal } from "../DetailPage/DetailBodyData.js";

export const RequestComponent = ({
  img = `${defimg}`, kind='', sex = '성별', age = '나이',
  name = '이름', local = '지역', time = '시간', phone,
  detail = '특징', url = '', row = false, no,list,selectedBreed
}) => {

  // console.log(list.selectedbreed)

  const theme={
    '& .MuiFilledInput-root': {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      width:'98%'
    },
    '& .MuiFilledInput-root:hover': {
      backgroundColor: '#f5f5f5',
    },
    '& .MuiFilledInput-root.Mui-focused': {
      backgroundColor: '#fff',
    }, 
    '& .MuiFilledInput-root::before': {
      borderBottom: 'none',
    },
  }

  const navigate = useNavigate();
  // 고객센터에 만들어진 alert 가져오기
  const { showAlert } = useAlert();
  // 수정모드 상태관리
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    kind, sex, age, name, local, time, phone, detail, no,selectedBreed,
  });

  const [open,setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedValues(prev => ({
      ...prev,
      [name]: name === 'sex' ? (value === 'true') : value  // sex는 boolean 처리
    }));
  };

  // 수정모드 시작
  const handleUpdate = () => {
    try {
      // 여기서 아이디 검사 해야할듯 (작성자와 접속자 비교 해서 처리)
    } catch (error) {
      console.log("권한없음")
    }

    try {
      setEditedValues(prev=>({...prev,no:no,img:list.img,selectedBreed:list.selectedbreed}))
      setIsEditing(true);
    } catch (error) {
      console.log('수정 실패')
    } 
  };

  // [PUT]
  const handleSave = async() => {
    setIsEditing(false);
    setEditedValues(prev=>({...prev,kind:editedValues.kind==='cat'?'고양이':'강아지'}))
    console.log('수정된 값:', editedValues);
    // 여기서 서버 저장
    try {
        const result = await fetch('http://localhost:8888/request',{
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(editedValues)
        })
        await showAlert({title:'수정이 완료 되었습니다.'})
        // 새로고침
    } catch (error) {
      console.log("수정하기 연결 실패",error)
    }
  };

  //[Delete]
  const handleDelete = async() => {
    try {
      // 여기서 아이디 검사 해야할듯 (작성자와 접속자 비교 해서 처리)
    } catch (error) {
      console.log("권한없음")
    }

    try {
      const result = await showAlert({
          title:'정말 삭제하시겠습니까?',
          showCancelButton : true,
          confirmButtonText: '네',
          cancelButtonText:'아니요',
          icon: 'warning'
      })

      // '네' 버튼 눌렀을 시
      if(result.isConfirmed){
        const result =  await fetch(`http://localhost:8888/request/${list.no}`,{
          method:'DELETE'
        })
        await showAlert({title:'삭제가 완료 되었습니다.'})
        // 새로고침
        navigate(0);
      }  
    } catch (error) {
      console.log("삭제 실패")
    } 
  }

  return (
    <Card sx={{ flex: '0 0 90%', display: 'flex', flexDirection: 'row' }} raised={true}>
      <div>
        <CardMedia
          component="img"
          height="auto"
          image={img}
          sx={{ width: 360, height: 360, objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column'}}>
        {/* 상단 바 */}
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px',  color: 'white', padding: '10px 15px',width:'92%'}}>
            {/* <TextField sx={theme} variant='filled' label="종류" name="kind" value={editedValues.kind} onChange={handleChange} size="small" /> */}
            {/* 품종 선택 상자 */}
            <span style={{display:'flex',flexDirection:'row'}}>

              {/* <select value={editedValues.kind} onChange={(e)=>{setEditedValues(prev=>({...prev,kind:e.target.value}))}}>
                  <option value="" disabled selected hidden>종류</option>
                  <option value="dog">강아지</option>
                  <option value="cat" >고양이</option>
              </select> */}

            
            <TextField
              variant='filled'
              select
              label="종류"
              name="kind"
              value={editedValues.kind==='고양이'?'cat':'dog'}
              onChange={handleChange}
              size="small"
              sx={{minWidth: 100,marginRight:'10px','& .MuiFilledInput-root': {
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  
                },
                '& .MuiFilledInput-root:hover': {
                  backgroundColor: '#f5f5f5',
                },
                  '& .MuiFilledInput-root::before': {
                    borderBottom: 'none',
                  },
                '& .MuiFilledInput-root.Mui-focused': {
                  backgroundColor: '#fff',
                },  }}
            >
              <MenuItem  value={'dog'}>강아지</MenuItem>
              <MenuItem  value={'cat'}>고양이</MenuItem>
            </TextField>


              <Button variant="contained"
                sx={{minWidth:'80px'}}
               onClick={editedValues.kind===''?(()=>{}):()=>setOpen(true)}
              >
                  {editedValues.selectedBreed}
              </Button>
          
              <Dialog
                  onClose={()=>{setOpen(!open)}}
                  open={open}
              >
                  <DialogTitle
                      sx={{background:'#cceeff'}}
                  >품종을 선택하세요</DialogTitle>
                      {animal[editedValues.kind === 'cat' ? 'cat' : 'dog'].map((animal, index) => (
                          <ListItemButton key={index} 
                          onClick={()=>{
                              setEditedValues(prev=>({...prev,selectedBreed:Object.keys(animal)[0]}))
                              // setSeletedBreed(Object.keys(animal)[0])
                              setOpen(false);
                          }}>
                              <ListItem disablePadding sx={{border:'1px solid #cceeff'}}>
                                  {<img className="DBdialogimg" src={`/img/${editedValues.kind}_picture/${Object.values(animal)[0]}.jpg`} alt="고양이 이미지" />}
                                  {Object.keys(animal)[0]}
                              </ListItem>
                      </ListItemButton>
                      ))}               
              </Dialog>
          </span>

            <TextField
              variant='filled'
              select
              label="성별"
              name="sex"
              value={editedValues.sex}
              onChange={handleChange}
              size="small"
              sx={{minWidth: 80,'& .MuiFilledInput-root': {
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  
                },
                '& .MuiFilledInput-root:hover': {
                  backgroundColor: '#f5f5f5',
                },
                  '& .MuiFilledInput-root::before': {
                    borderBottom: 'none',
                  },
                '& .MuiFilledInput-root.Mui-focused': {
                  backgroundColor: '#fff',
                },  }}
            >
              <MenuItem  value={true}>수컷</MenuItem>
              <MenuItem  value={false}>암컷</MenuItem>
            </TextField>
            <TextField sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                width:'130px'
              },
              '& .MuiFilledInput-root:hover': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiFilledInput-root.Mui-focused': {
                backgroundColor: '#fff',
              }, 
              '& .MuiFilledInput-root::before': {
                borderBottom: 'none',
              },
            }} 
            variant='filled' label="나이" name="age" value={editedValues.age} onChange={handleChange} size="small" />
            <TextField sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                width:'130px'
              },
              '& .MuiFilledInput-root:hover': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiFilledInput-root.Mui-focused': {
                backgroundColor: '#fff',
              }, 
              '& .MuiFilledInput-root::before': {
                borderBottom: 'none',
              },
            }}  
            variant='filled' label="이름" name="name" value={editedValues.name} onChange={handleChange} size="small" />
          </div>
        ) : (
          <Typography
            sx={{ backgroundColor: '#ff6666', color: 'white', textAlign: 'center',padding: '10px 20px' }}
            variant="h5"
            component="div"
          >
            🐾[{editedValues.kind}] {editedValues.selectedBreed} | 🧸{editedValues.sex === true ? '수컷' : '암컷'} | 🕒{editedValues.age} | 🏷️{editedValues.name}
          </Typography>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '700px'}}>
          <CardContent
            sx={{ width: '92%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height:'250px',}}
          >
            {isEditing ? (
              <>
                <TextField sx={theme} variant='filled' label="실종 장소" name="local" value={editedValues.local} onChange={handleChange} />
                <TextField sx={theme} variant='filled' label="실종 시간" name="time" value={editedValues.time} onChange={handleChange} />
                <TextField sx={theme} variant='filled' label="연락수단" name="phone" value={editedValues.phone} onChange={handleChange} />
                <TextField
                  sx={theme}
                  variant='filled'
                  label="특징"
                  name="detail"
                  value={editedValues.detail}
                  onChange={handleChange}
                  multiline
                />
              </>
            ) : (
              <div>
                <Typography sx={{ fontSize: '20px' }} gutterBottom variant="h5" component="div">
                  <b>실종 장소</b>: {editedValues.local}
                </Typography>
                <Typography sx={{ fontSize: '20px' }} gutterBottom variant="h5" component="div">
                  <b>실종 시간</b>: {editedValues.time}
                </Typography>
                <Typography sx={{ fontSize: '20px' }} gutterBottom variant="h5" component="div">
                  <b>연락수단</b>: {editedValues.phone}
                </Typography>
                <Typography
                  sx={{ fontSize: '20px', whiteSpace: 'pre-line', height: '100px' }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  <b>특징</b>: {editedValues.detail}
                </Typography>
              </div>
            )}
            {/* 버튼 쪽 */}
            <div style={{ position:'relative', top:'10px',display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
              {isEditing ? (<>
                <Button variant="contained" color="success" onClick={handleSave}>저장</Button>
                <Button variant="contained" color="error" onClick={()=>{setIsEditing(false)}}>취소</Button></>
              ) : (
                <Button variant="outlined" color="primary" onClick={handleUpdate}>수정</Button>
              )}
              <Button sx={{ marginRight: '20px' }} variant="outlined" color="primary" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
    )
}