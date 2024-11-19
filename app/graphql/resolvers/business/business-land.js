import { NotFound } from '../../../errors/graphql.js'
import {
  transformLandCovers,
  transformLandCoversToArea,
  transformLandParcelsWithGeometry,
  transformTotalArea,
  transformTotalParcels
} from '../../../transformers/rural-payments/lms.js'
import { validateDate } from '../../../utils/date.js'

export const BusinessLand = {
  summary ({ organisationId }) {
    return { organisationId }
  },

  async parcel ({ organisationId }, { date, parcelId }, { dataSources }) {
    validateDate(date)

    const parcels = await BusinessLand.parcels({ organisationId }, { date }, { dataSources })

    const parcel = parcels?.find(p => p.parcelId === parcelId)
    if (!parcel) {
      throw new NotFound(`No parcel found for parcelId: ${parcelId}`)
    }

    return parcel
  },

  async parcels ({ organisationId }, { date }, { dataSources }) {
    validateDate(date)

    return transformLandParcelsWithGeometry(
      await dataSources.ruralPaymentsBusiness.getParcelsByOrganisationIdAndDate(
        organisationId, date
      )
    )
  },

  async parcelCovers ({ organisationId }, { date, parcelId }, { dataSources }) {
    validateDate(date)

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
