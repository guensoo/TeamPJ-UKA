import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/default.jpg';
import { Card, CardContent, CardMedia, Typography, Button, TextField, MenuItem } from '@mui/material';
import { useState } from 'react';

export const RequestComponent = ({
  img = `${defimg}`, kind = '종류', sex = '성별', age = '나이',
  name = '이름', local = '지역', time = '시간', phone = '연락처',
  descripsion = '특징', url = '', row = false
}) => {

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    kind, sex, age, name, local, time, phone, descripsion
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedValues(prev => ({
      ...prev,
      [name]: name === 'sex' ? (value === 'true') : value  // sex는 boolean 처리
    }));
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('수정된 값:', editedValues);
    // 여기에 axios 등으로 서버 저장 가능
  };

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
          <div style={{ display: 'flex', gap: '20px', backgroundColor: 'red', color: 'white', padding: '10px 15px',width:'92%' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '655px' }}>
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
                  name="descripsion"
                  value={editedValues.descripsion}
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
                  <b>특징</b>: {editedValues.descripsion}
                </Typography>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px',marginTop:'20px' }}>
              {isEditing ? (
                <Button variant="contained" color="primary" onClick={handleSave}>저장</Button>
              ) : (
                <Button variant="outlined" color="primary" onClick={handleUpdate}>수정</Button>
              )}
              <Button sx={{ marginRight: '20px' }} variant="outlined" color="primary" onClick={() => { }}>
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