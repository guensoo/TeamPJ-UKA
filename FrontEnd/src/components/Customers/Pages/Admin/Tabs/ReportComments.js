import React from 'react';

const ReportedComments = () => {
    // ❗현재는 댓글 기능/데이터 연동이 없다고 가정하고 기본 틀만 구성
    // 나중에 comment 데이터를 받아와서 isReported 필터링 추가하면 됨

    return (
        <div>
            <h2>💬 신고된 댓글</h2>
            <p>신고된 댓글이 없습니다.</p>
        </div>
    );
};

export default ReportedComments;
