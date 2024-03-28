import {
  transformOrganisationCSApplicationToBusinessApplications
} from '../../../transformers/rural-payments-portal/applications-cs.js'
import {
  transformOrganisationToBusiness
} from '../../../transformers/rural-payments-portal/business.js'

export const Query = {
  async business (__, { id }, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationBySBI(id)
    const business = transformOrganisationToBusiness(response)

    return {
      id,
      land: { sbi: id },
      ...business,
      customers: async () => {
        const customerIdCollection = []
        if (Array.isArray(response.persons)) {
          for (const customerId of response.persons) {
            customerIdCollection.push({ id: customerId })
          }

          return customerIdCollection
        }

        return null
      }
    }
  },

  async businessApplications (_, { id }, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getApplicationsCountrysideStewardshipBySbi(id)

    return transformOrganisationCSApplicationToBusinessApplications(response.applications)
  }
}
