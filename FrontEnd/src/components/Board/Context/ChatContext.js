import { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();
const now = new Date();
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let postIdCounter = 1;

const authors = ['user1', 'user2', 'admin', 'guest', 'memberA', 'memberB']; //임의의 작성자
const getRandomAuthor = () => authors[Math.floor(Math.random() * authors.length)];

//게시글 임시 생성 컴포넌트
const generatePost = (baseTitle, author, baseContent) => {
    const minutesAgo = getRandomInt(1, 10000);
    const date = new Date(now.getTime() - 1000 * 60 * minutesAgo);
    const id = postIdCounter++;

    const randomNumTitle = getRandomInt(1, 100);
    const randomNumContent = getRandomInt(1, 1000);

    const title = `${baseTitle}${randomNumTitle}`; //글 제목 + 랜덤숫자
    const content = `${baseContent}${randomNumContent}`; //글 내용 + 랜덤숫자

    return{
        id,
        title,
        author,
        comment: getRandomInt(0, 1000),
        views: getRandomInt(1, 20000),
        likes: getRandomInt(0, 5000),
        content,
        report : 0,
        createdAt: date,
    }
};

const initialNotice = Array.from({ length: 10 }, () =>
    generatePost('공지사항', 'admin', '공지사항 내용')
);

const initialChat = Array.from({ length: 60 }, () =>
    generatePost('속닥', getRandomAuthor(), '속닥 내용')
);

const initialReview = Array.from({ length: 60 }, () =>
  generatePost('입양', getRandomAuthor(), '입양후기 내용')
);

export const ChatProvider = ({ children }) => {

    const [notice, setNotice] = useState(initialNotice);
    const [chats, setChats] = useState(initialChat);
    const [review, setReview] = useState(initialReview);

    const addChat = (newPost, postType) => {
        const currentUser = localStorage.getItem("username") || "me";

        const postWithId = {
            ...newPost,
            id: postIdCounter++,
            author: currentUser,
            createdAt: new Date().toISOString(),
            comment: getRandomInt(0, 1000),
            views: getRandomInt(1, 20000),
            likes: getRandomInt(0, 5000),
            report : 0,
            type: postType,
        };

        if(postType === 'notice'){
            setNotice(prev => [postWithId, ...prev]);
        } else if(postType === 'review'){
            setReview(prev => [postWithId, ...prev]);
        } else if(postType === 'chat'){
            setChats(prev => [postWithId, ...prev]);
        }
    }

    const deletePostById = (type, id) => {
        if (type === 'chat') {
            setChats(prev => prev.filter(post => post.id !== id));
        } else if (type === 'review') {
            setReview(prev => prev.filter(post => post.id !== id));
        } else if (type === 'notice') {
            setNotice(prev => prev.filter(post => post.id !== id));
        }
    };

    return <ChatContext.Provider value={{ notice, chats, review, addChat, deletePostById }}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
