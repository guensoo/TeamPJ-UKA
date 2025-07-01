import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888';
const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/board`);
                setPosts(res.data);
            } catch (err) {
                console.error('전체 게시글 불러오기 실패:', err);
            }
        };
        fetchAllPosts();
    }, []);

    return (
        <BoardContext.Provider value={{ posts }}>
            {children}
        </BoardContext.Provider>
    );
};