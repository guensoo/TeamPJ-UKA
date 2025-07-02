const MapQnaRaw = (raw) => {
    return {
        id: raw.qnaNo,
        qnaNo: raw.qnaNo,                        // ✅ API 식별용 (PK)
        qnaId: raw.qnaId,                        // ✅ 날짜 기반 표시용
        title: raw.qnaTitle,
        content: raw.qnaContent,
        author: raw.qnaWriter,
        answer: raw.qnaAnswer,
        answerWriter: raw.qnaAnswerWriter,
        isSecret: raw.qnaIsSecret === "Y",
        password: raw.qnaPassword,
        isReported: raw.qnaIsReported === "Y",
        isAnswered: raw.qnaIsAnswered === "Y",
        createdAt: raw.qnaCreatedAt,
        updatedAt: raw.qnaUpdatedAt,
        views: raw.qnaViews ?? 0,
        likes: raw.qnaLikeCount ?? 0, // ✅ 추천 수
        comments: raw.comments ?? [],
        isLikedByMe: raw.likedByMe === true, // ✅ 내가 추천했는지 여부
    };
}
export { MapQnaRaw };