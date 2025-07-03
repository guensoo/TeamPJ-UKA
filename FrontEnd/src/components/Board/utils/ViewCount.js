import { incrementViewCount } from "../../../api/BoardApi";

const VIEW_EXPIRATION = 1000 * 60 * 5; // 5분

export async function ViewCount(postId) {
    const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
    const now = Date.now();

    if (!viewedPosts[postId] || now - viewedPosts[postId] > VIEW_EXPIRATION) {
        try {
            await incrementViewCount(postId);
            viewedPosts[postId] = now;
            localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));  
        } catch (error) {
            console.error("조회수 증가 실패", error)
        }   
    }
}