import {Link, useNavigate}from 'react-router-dom'
import {Card,CardContent,CardMedia,CardActionArea,Typography, Alert} from '@mui/material'
export const CardComponent = ({img,title,detail,url='',row=false,list}) => {

    const navigate = useNavigate();

    if(!row){
        return(
            // 카드(세로)
        <Card sx={{ flex:'0 0 18%'}} raised={true} >
            <CardActionArea onClick={()=>{
                navigate('/about/select',{state:list})
                window.scrollTo(0,0)
                }}           
                >
                <CardMedia
                component="img"
                height="auto"
                image={img}
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {detail}
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
                image={img}
                sx={{ width: 400, height: 300, objectFit: 'cover' }} //  크기 제한
                />
                <CardContent sx={{width: 500, }}> {/* ✅ flex-grow */}
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        특징 : {detail}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>



    )
}