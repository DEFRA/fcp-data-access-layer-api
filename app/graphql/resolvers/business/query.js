import { NotFound } from '../../../errors/graphql.js'
import { GRAPHQL_RESOLVERS_BUSINESS_001 } from '../../../logger/codes.js'
import { transformOrganisationToBusiness } from '../../../transformers/rural-payments/business.js'

export const Query = {
  async business (__, { sbi }, { dataSources, logger }) {
    const response = await dataSources.ruralPaymentsBusiness.getOrganisationBySBI(sbi)

    if (!response) {
      this.logger.warn('#graphql - business/query - Business not found for SBI', { sbi, code: GRAPHQL_RESOLVERS_BUSINESS_001 })
      throw new NotFound('Business not found')
    }

    const business = transformOrganisationToBusiness(response)
    return {
      sbi,
      land: { sbi },
      ...business
    }
  }
}
