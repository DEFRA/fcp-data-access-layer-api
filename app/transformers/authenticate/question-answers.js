export function transformAuthenticateQuestionsAnswers (questionAnswers) {
  return {
    memorableDate: questionAnswers?.memorableDate !== '' ? questionAnswers?.memorableDate : null,
    memorableEvent: questionAnswers?.memorableEvent !== '' ? questionAnswers?.memorableEvent : null,
    memorableLocation:
      questionAnswers?.memorableLocation !== '' ? questionAnswers?.memorableLocation : null,
    updatedAt: questionAnswers?.lastUpdatedOn !== '' ? questionAnswers?.lastUpdatedOn : null,
    isFound: questionAnswers !== null
  }
}
