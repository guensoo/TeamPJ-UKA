import { Button,Box } from '@mui/material'
import { RequestComponent } from './RequestComponent'
import './RequestMain.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

// const API_BASE_URL = "http://localhost:8888";
const API_BASE_URL = "http://192.168.3.24:8888";

export const RequestMain = () => {
    const navigate = useNavigate();
    const [card,setCard] = useState([]);
    const refs = useRef([]);

    useEffect(()=>{
        const requestApi = async () => {
            try {
                const response = await (await fetch(`${API_BASE_URL}/request`))
                const list = await response.json()
                setCard(list)
            } catch (error) {
                console.log('fetch error',error.message)
            } finally{
                console.log('Request fetch success')
            }
        }
        requestApi();
    },[])

    // 데이터 없을때 표시할 화면
    if(card?.length===0){
        return(
            <div className="RMloading">
                <div><h2>표시할 데이터가 없습니다. </h2></div>
                <img src='../../img/helmetGood.png' />

            </div>
        )
    }
    return(
        <div className="RMcontainer">
            <Button 
                variant="contained"
                className="DBButton"
                color="primary"
                sx={{marginLeft:'auto', marginTop:'20px'}}

                onClick={()=>{
                    navigate('/request/write')
                    window.scrollTo(0,0)
                }}>작성하기
            </Button>

            <Box className='RMtop'>
                {/* 나열식으로 실종신고서 보여주기 */}
                {/* RequestComponent로 데이터 가져오기 */}
                {/* kind,sex,age,name,local,time,phone,descripsion */}

                {/* 데이터 시작 */}
                <div style={{marginTop:'20px'}}></div>

                {card.reverse().map((list,index)=>(
                    <div key={list.no} ref={el => refs.current[index] = el}>
                        <div className='RMone' >
                            <RequestComponent 
                                img={list.img}
                                kind={list.kind}
                                age={list.age}
                                sex={list.sex}
                                name={list.name}
                                local={list.local}
                                time={list.time}
                                phone={list.phone}
                                detail={list.detail}
                                no={list.no}
                                list={list}
                                selectedBreed={list.selectedbreed}
                            /> 
                            {/* 받은값 확인하기. */}
                            {/* {console.log(list)} */}
                        </div>
                        {/* 밑줄 */}
                        <div className='RMhr'></div>
                    </div>
                ))}

            </Box>
        </div>
    )
}