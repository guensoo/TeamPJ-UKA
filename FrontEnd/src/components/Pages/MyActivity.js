import MyPosts from './MyPosts';
import MyComments from './MyComments';
import MyLikes from './MyLikes';

const MyActivity = () => (
    <div className="content-section">
        <div className="section-header">
            <h2>활동 내역</h2>
            <p>작성한 글, 댓글, 좋아요 내역을 확인하세요</p>
        </div>
        <div className="activity-lists">
            <MyPosts />
            <MyComments />
            <MyLikes />
        </div>
    </div>
);

export default MyActivity;