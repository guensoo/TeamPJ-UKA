import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/default.jpg';
import { Card, CardContent, CardMedia, Typography, Button, TextField, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Customers/Context/AlertContext';

export const RequestComponent = ({
  img = `${defimg}`, kind = '종류', sex = '성별', age = '나이',
  name = '이름', local = '지역', time = '시간', phone,
  detail = '특징', url = '', row = false, no,list
}) => {

  const navigate = useNavigate();
  // 고객센터에 만들어진 alert 가져오기
  const { showAlert } = useAlert();
  // 수정모드 상태관리
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    kind, sex, age, name, local, time, phone, detail,no
  });

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
      setEditedValues(prev=>({...prev,no:no,img:list.img}))
      setIsEditing(true);
    } catch (error) {
      console.log('수정 실패')
    } 
  };

  // [PUT]
  const handleSave = async() => {
    setIsEditing(false);
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
          <div style={{ display: 'flex', gap: '20px',  color: 'white', padding: '10px 15px',width:'92%'}}>
            <TextField label="종류" name="kind" value={editedValues.kind} onChange={handleChange} size="small" />
            <TextField
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
            <TextField label="나이" name="age" value={editedValues.age} onChange={handleChange} size="small" />
            <TextField label="이름" name="name" value={editedValues.name} onChange={handleChange} size="small" />
          </div>
        ) : (
          <Typography
            sx={{ backgroundColor: 'red', color: 'white', textAlign: 'center' }}
            variant="h5"
            component="div"
          >
            🐾{editedValues.kind} | 🧸{editedValues.sex === true ? '수컷' : '암컷'} | 🕒{editedValues.age} | 🏷️{editedValues.name}
          </Typography>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '700px' }}>
          <CardContent
            sx={{ width: '92%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height:'260px'}}
          >
            {isEditing ? (
              <>
                <TextField label="실종 장소" name="local" value={editedValues.local} onChange={handleChange} />
                <TextField label="실종 시간" name="time" value={editedValues.time} onChange={handleChange} />
                <TextField label="연락수단" name="phone" value={editedValues.phone} onChange={handleChange} />
                <TextField
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
            <div style={{ position:'relative', left:'20px',top:'20px',display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
              {isEditing ? (
                <Button variant="contained" color="primary" onClick={handleSave}>저장</Button>
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
        // <Card sx={{ flex:'0 0 92%', display:'flex',flexDirection:'row'}} raised={true}>
        //         <div>
        //         {/* 카드 사진 내용 */}
        //             <CardMedia 
        //             component="img"
        //             height="auto"
        //             image={`/img/userimg/${img}`}
        //             sx={{ width: 360, height: 300, objectFit: 'cover'}}
        //             />
        //         </div>

        //         <div style={{display:'flex',flexDirection:'column'}}>
        //             {/* 빨간 div */}
        //             <Typography 
        //             sx={{backgroundColor:'red', color:'white', textAlign:'center' }}
        //             variant="h5" component="div" >
        //                 🐾{kind} | 🧸{sex===true?'수컷':'암컷'} | 🕒{age} | 🏷️{name}
        //             </Typography>
                    
        //             {/* 카드 상세 내용 */}
        //             <div style={{display:'flex', flexDirection:'column',justifyContent:'center',width:'655px'}}>
        //                 {/* 내용 들어있는 상자. */}
        //                 <CardContent
        //                     sx={{width:'95%',display:'flex',flexDirection:'column',height:'100%',height:'228px',justifyContent:'center'}}
        //                 >    
        //                     <Typography sx={{fontSize:'16px'}}
        //                     gutterBottom variant="h5" component="div">
        //                     <b>실종 장소</b>: {local}
        //                     </Typography>
        //                     <Typography sx={{fontSize:'16px'}}
        //                     gutterBottom variant="h5" component="div">
        //                     <b>실종 시간</b>: {time}
        //                     </Typography>
        //                     <Typography sx={{fontSize:'16px'}}
        //                     gutterBottom variant="h5" component="div">
        //                     <b>연락수단</b>: {phone}
        //                     </Typography>
        //                     <Typography sx={{fontSize:'16px', whiteSpace:'pre-line', height:'100px' }} 
        //                     gutterBottom variant="h5" component="div">
        //                     <b>특징</b>: {`${descripsion}`}
        //                     </Typography>
        //                     {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        //                         {description}
        //                     </Typography> */}
        //                     {/* 버튼구역 */}
        //                     <div style={{display:'flex', flexDirection:'row',justifyContent:'flex-end', gap:'10px'}}>
        //                         <Button variant='outlined' color='primary'
        //                             onClick={(e)=>handleUpdate(e)}
        //                         >수정</Button>
        //                         <Button sx={{marginRight:'20px'}} variant='outlined' color='primary'
        //                             onClick={()=>{}}
        //                         >삭제</Button>
        //                     </div>
        //                 </CardContent>
        //             </div>
        //         </div>
        
        // </Card>

    )
}