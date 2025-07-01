const MapQnaRaw = (raw) => {
  return {
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
    likes: raw.qnaLikes ?? 0, // 주석
    comments: raw.comments ?? [],
  };
}
export {MapQnaRaw};