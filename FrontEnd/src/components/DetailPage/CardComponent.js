import {Link, useNavigate}from 'react-router-dom'
import {Card,CardContent,CardMedia,CardActionArea,Typography, Alert} from '@mui/material'
import defimg from '../../assets/noImage.jpg';
import { useState } from 'react';
export const CardComponent = ({img,row=false,index,filteredData}) => {

    const navigate = useNavigate();
    const [imgSrc,setImgSrc] = useState(img);
    const list = filteredData[index]
    
    // console.log('해당하는 자료 :',list)
    // console.log('넘겨받은 번호 :',index)
    // console.log('넘겨받은 필터자료 : ',filteredData)

    
    if(!row){
        return(
            // 카드(세로)
        <Card sx={{ flex:'0 0 20%'}} raised={true} >
            <CardActionArea onClick={()=>{
                navigate('/about/select',{state:{list:filteredData,index:index}})
                window.scrollTo(0,0)
                }}           
                >
                <CardMedia
                    component="img"
                    height="140px"
                    image={imgSrc}
                    onError={()=>setImgSrc(defimg)}
                />
                <CardContent sx={{marginLeft:'12px'}}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <small>보호번호: {list.desertionNo}</small>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <small>품종: {list.kindFullNm}</small>
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        )
    }

    return(
        // 미디어 카드(가로) maxWidth: 350,
        <Card sx={{ display:'flex' }} raised={true}>
            <CardActionArea
                onClick={() => {
                navigate('/about/select',{state:list});
                window.scrollTo(0, 0);
                }}
                sx={{ display: 'flex', flexDirection: 'row' }} // 가로 정렬
            >
                <CardMedia
                component="img"
                image={imgSrc}
                onError={()=>setImgSrc(defimg)}
                sx={{ width: 380, height: 300, objectFit: 'cover' }} //  크기 제한
                />
                <CardContent sx={{width: 500, }}> {/* ✅ flex-grow */}
                    <Typography gutterBottom variant="h5" component="div">
                        보호번호: {list.desertionNo}
                    </Typography>
                    <br/>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        주소 : {list.careAddr}
                    </Typography>
                    <br/>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        상태 : {list.processState}
                        </Typography>
                    <br/>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        특징 : {list.kindFullNm}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>



    )
}