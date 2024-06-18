import { transformPayments } from '../../../transformers/payments/payments.js'

export const BusinessApplication = {
  async payments ({ applicationId }, _, { dataSources }) {
    const response = await dataSources.paymentsDatabase.getPaymentsByApplicationId(applicationId)
    return transformPayments(response)
  }
}
