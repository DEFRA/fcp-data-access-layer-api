import { BadRequest, NotFound } from '../../../errors/graphql.js'
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

  async parcel ({ organisationId }, { date, parcelId }, { dataSources }) {
    const dateObject = new Date(date)
    if (isNaN(dateObject.getTime())) {
      throw new BadRequest(`Invalid date format: "${date}" is not a valid date. Date should be supplied in ISO 8601 format, e.g. 2020-01-01`)
    }

    const parcels = await BusinessLand.parcels({ organisationId }, { date }, { dataSources })

    const parcel = parcels?.find(p => p.parcelId === parcelId)
    if (!parcel) {
      throw new NotFound(`No parcel found for parcelId: ${parcelId}`)
    }

    return parcel
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

  async parcelCovers ({ organisationId }, { date, parcelId }, { dataSources }) {
    const dateObject = new Date(date)
    if (isNaN(dateObject.getTime())) {
      throw new BadRequest(`Invalid date format: "${date}" is not a valid date. Date should be supplied in ISO 8601 format, e.g. 2020-01-01`)
    }

    const parcel = await BusinessLand.parcel({ organisationId }, { date, parcelId }, { dataSources })

    return transformLandCovers(
      await dataSources.ruralPaymentsBusiness.getCoversByOrgSheetParcelId(organisationId, parcel.sheetId, parcelId)
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
