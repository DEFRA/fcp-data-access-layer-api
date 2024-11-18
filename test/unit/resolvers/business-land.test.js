import {
  BusinessLand,
  BusinessLandSummary
} from '../../../app/graphql/resolvers/business/business-land.js'

const dataSources = {
  ruralPaymentsPortalApi: {
    getParcelsSummaryByOrganisationId () {
      return {
        totalParcels: 1000,
        totalArea: 2000
      }
    }
  },
  ruralPaymentsBusiness: {
    getParcelsByOrganisationId () {
      return [{ id: 'mockId', sheetId: 'mockSheetId', area: 1000 }]
    },
    getParcelsByOrganisationIdAndDate () {
      return {
        features: [
          {
            id: 'mockId',
            properties: {
              parcelId: 'mockParcelId',
              sheetId: 'mockSheetId',
              area: 1000,
              pendingDigitisation: 'false'
            }
          }
        ]
      }
    },
    getCoversByOrgSheetParcelId () {
      return { id: 'mockId', info: [{ code: 'someCode', area: 1000, name: 'Mock Name' }] }
    },
    getCoversSummaryByOrganisationIdAndDate () {
      return [
        { name: 'Arable Land', area: 1000 },
        { name: 'Permanent Grassland', area: 2000 },
        { name: 'Permanent Crops', area: 3000 }
      ]
    }
  }
}

const mockBusiness = { organisationId: 'mockId' }
const mockArguments = { date: '2022-01-01' }

describe('BusinessLand', () => {
  it('summary', () => {
    expect(BusinessLand.summary(mockBusiness)).toEqual(mockBusiness)
  })

  it('parcels', async () => {
    expect(
      await BusinessLand.parcels(mockBusiness, mockArguments, { dataSources })
    ).toEqual([{
      id: 'mockId',
      sheetId: 'mockSheetId',
      area: 1000,
      parcelId: 'mockParcelId',
      pendingDigitisation: false
    }])
  })

  it('parcel', async () => {
    expect(
      await BusinessLand.parcel(mockBusiness, { ...mockArguments, parcelId: 'mockParcelId' }, { dataSources })
    ).toEqual({
      id: 'mockId',
      sheetId: 'mockSheetId',
      area: 1000,
      parcelId: 'mockParcelId',
      pendingDigitisation: false
    })
  })

  it('parcelCovers', async () => {
    expect(
      await BusinessLand.parcelCovers(mockBusiness, { ...mockArguments, parcelId: 'mockParcelId' }, { dataSources })
    ).toEqual([{ id: 'mockId', area: 1000, name: 'MOCK_NAME', code: 'someCode' }])
  })
})

describe('BusinessLandSummary', () => {
  it('totalParcels', async () => {
    expect(
      await BusinessLandSummary.totalParcels({ id: 'mockId' }, null, {
        dataSources
      })
    ).toEqual(1)
  })

  it('totalArea', async () => {
    expect(
      await BusinessLandSummary.totalArea({ id: 'mockId' }, null, {
        dataSources
      })
    ).toEqual(6000)
  })

  it('arableLandArea', async () => {
    expect(
      await BusinessLandSummary.arableLandArea({ id: 'mockId' }, null, {
        dataSources
      })
    ).toEqual(1000)
  })

  it('permanentGrasslandArea', async () => {
    expect(
      await BusinessLandSummary.permanentGrasslandArea({ id: 'mockId' }, null, {
        dataSources
      })
    ).toEqual(2000)
  })

  it('permanentCropsArea', async () => {
    expect(
      await BusinessLandSummary.permanentCropsArea({ id: 'mockId' }, null, {
        dataSources
      })
    ).toEqual(3000)
  })
})
