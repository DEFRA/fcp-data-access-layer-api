export function transformAuthenticateQuestionsAnswers(questionAnswers) {
  return {
    memorableDate: questionAnswers?.date !== '' ? questionAnswers?.date : null,
    memorableEvent: questionAnswers?.event !== '' ? questionAnswers?.event : null,
    memorablePlace: questionAnswers?.location !== '' ? questionAnswers?.location : null,
    updatedAt: questionAnswers?.lastUpdatedOn !== '' ? questionAnswers?.lastUpdatedOn : null,
    isFound: questionAnswers !== null
  }
}
