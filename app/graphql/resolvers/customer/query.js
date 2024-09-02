import { GraphQLError } from 'graphql'

export const Query = {
  async customer (__, { crn }, { dataSources }) {
    const response = await dataSources.ruralPaymentsCustomer.getCustomerByCRN(crn)

    if (!response) {
      throw new GraphQLError('Customer not found', {
        extensions: {
          code: 'NOT_FOUND'
        }
      })
    }

    return {
      personId: response.id,
      crn: response.customerReferenceNumber
    }
  }
}
