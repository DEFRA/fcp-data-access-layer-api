import { transformOrganisationCPHCoordinates } from '../../../transformers/rural-payments-portal/business-cph.js'

export const CPH = {
  async parish ({ businessId, number }, _, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationCPHInfoBySBIAndCPHNumber(businessId, number)
    return response.parish
  },

  async startDate ({ businessId, number }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationCPHInfoBySBIAndCPHNumber(businessId, number)
    // Convert timestamp milliseconds to seconds
    return parseInt(response.startDate) / 1000
  },

  async expiryDate ({ businessId, number }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationCPHInfoBySBIAndCPHNumber(businessId, number)

    // Convert timestamp milliseconds to seconds
    return parseInt(response.expiryDate) / 1000
  },

  async species ({ businessId, number }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationCPHInfoBySBIAndCPHNumber(businessId, number)

    return response.species
  },

  async coordinate ({ businessId, number }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getOrganisationCPHInfoBySBIAndCPHNumber(businessId, number)

    return transformOrganisationCPHCoordinates(response)
  }
}
