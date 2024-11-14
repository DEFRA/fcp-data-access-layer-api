import { BadRequest } from '../../../errors/graphql.js'
import {
  transformLandCovers,
  transformLandCoversToArea,
  transformLandParcelsWithGeometry,
  transformTotalArea,
  transformTotalParcels
} from '../../../transformers/rural-payments/lms.js'

export const BusinessLand = {
  summary ({ organisationId }) {
    return { organisationId }
  },

  async parcels ({ organisationId }, { date }, { dataSources }) {
    const dateObject = new Date(date)
    if (isNaN(dateObject.getTime())) {
      throw new BadRequest(`Invalid date format: "${date}" is not a valid date. Date should be supplied in ISO 8601 format, e.g. 2020-01-01`)
    }

    return transformLandParcelsWithGeometry(
      await dataSources.ruralPaymentsBusiness.getParcelsByOrganisationIdAndDate(
        organisationId, date
      )
    )
  },

  async covers ({ organisationId }, __, { dataSources }) {
    return transformLandCovers(
      await dataSources.ruralPaymentsBusiness.getCoversByOrganisationId(
        organisationId
      )
    )
  }
}

export const BusinessLandSummary = {
  async totalParcels ({ organisationId }, __, { dataSources }) {
    return transformTotalParcels(await dataSources.ruralPaymentsBusiness.getParcelsByOrganisationId(
      organisationId
    ))
  },

  async totalArea ({ organisationId, historicDate = new Date() }, __, { dataSources }) {
    return transformTotalArea(await dataSources.ruralPaymentsBusiness.getCoversSummaryByOrganisationIdAndDate(
      organisationId,
      historicDate
    ))
  },

  async arableLandArea (
    { organisationId, historicDate = new Date() },
    __,
    { dataSources }
  ) {
    return transformLandCoversToArea(
      'Arable Land',
      await dataSources.ruralPaymentsBusiness.getCoversSummaryByOrganisationIdAndDate(
        organisationId,
        historicDate
      )
    )
  },

  async permanentGrasslandArea (
    { organisationId, historicDate = new Date() },
    __,
    { dataSources }
  ) {
    return transformLandCoversToArea(
      'Permanent Grassland',
      await dataSources.ruralPaymentsBusiness.getCoversSummaryByOrganisationIdAndDate(
        organisationId,
        historicDate
      )
    )
  },

  async permanentCropsArea (
    { organisationId, historicDate = new Date() },
    __,
    { dataSources }
  ) {
    return transformLandCoversToArea(
      'Permanent Crops',
      await dataSources.ruralPaymentsBusiness.getCoversSummaryByOrganisationIdAndDate(
        organisationId,
        historicDate
      )
    )
  }
}
