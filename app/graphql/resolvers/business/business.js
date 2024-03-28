import { transformOrganisationCPH } from '../../../transformers/rural-payments-portal/business-cph.js'
import {
  transformOrganisationPersonsToBusinessCustomers
} from '../../../transformers/rural-payments-portal/business.js'

export const Business = {
  land ({ id }) {
    return { id }
  },

  async cph ({ id }, _, { dataSources }) {
    return transformOrganisationCPH(
      id,
      await dataSources.ruralPaymentsPortalApi.getOrganisationCPHCollectionBySBI(id)
    )
  },

  async customers({ id }, _, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationBySBI(id)

    return transformOrganisationPersonsToBusinessCustomers(response.persons)
  },
}
