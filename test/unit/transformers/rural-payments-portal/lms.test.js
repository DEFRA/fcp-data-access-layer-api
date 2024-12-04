import {
  transformLandCovers,
  transformLandCoversToArea,
  transformLandParcelsEffectiveDates,
  transformLandParcelsWithGeometry
} from '../../../../app/transformers/rural-payments/lms.js'

describe('LMS transformer', () => {
  test('transformLandCovers', () => {
    const input = {
      type: 'FeatureCollection',
      features: [
        {
          id: 'mockId',
          geometry: null,
          properties: {
            area: '1000',
            code: 'mockId',
            name: 'Mock Name',
            isBpsEligible: 'true'
          },
          type: 'Feature'
        }
      ]
    }
    const output = [
      { area: 1000, id: 'mockId', name: 'MOCK_NAME', code: 'mockId', isBpsEligible: true }
    ]
    expect(transformLandCovers(input)).toEqual(output)
  })

  test('transformLandCoversToArea', () => {
    const input = ['mockName', [{ name: 'mockName', area: 1000 }]]
    const output = 1000
    expect(transformLandCoversToArea(...input)).toEqual(output)
  })

  test('transformLandParcelsWithGeometry', () => {
    const input = {
      features: [
        {
          id: 'mockId',
          properties: {
            sheetId: 'mockSheetId',
            area: 1000,
            parcelId: 'mockParcelId',
            pendingDigitisation: 'false'
          }
        }
      ]
    }
    const output = [
      {
        id: 'mockId',
        sheetId: 'mockSheetId',
        area: 1000,
        parcelId: 'mockParcelId',
        pendingDigitisation: false
      }
    ]
    expect(transformLandParcelsWithGeometry(input)).toEqual(output)
  })

  test('transformLandParcelsEffectiveDates', () => {
    const parcelId = 'mockParcelId'
    const sheetId = 'mockSheetId'
    const parcels = [{ parcelId, sheetId, validFrom: '2023-01-01', validTo: '2024-01-01' }]
    const output = { effectiveTo: '2024-01-01', effectiveFrom: '2023-01-01' }
    expect(transformLandParcelsEffectiveDates(parcelId, sheetId, parcels)).toEqual(output)
  })
})
