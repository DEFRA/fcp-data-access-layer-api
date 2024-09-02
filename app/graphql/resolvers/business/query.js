import { GraphQLError } from 'graphql'
import { transformOrganisationToBusiness } from '../../../transformers/rural-payments/business.js'

export const Query = {
  async business (__, { sbi }, { dataSources }) {
    const response = await dataSources.ruralPaymentsBusiness.getOrganisationBySBI(sbi)

    if (!response) {
      throw new GraphQLError('Business not found', {
        extensions: {
          code: 'NOT_FOUND'
        }
      })
    }

    const business = transformOrganisationToBusiness(response)
    return {
      sbi,
      land: { sbi },
      ...business
    }
  }
}
