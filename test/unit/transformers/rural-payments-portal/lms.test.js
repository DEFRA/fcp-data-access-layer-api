import {
  transformLandCovers,
  transformLandCoversToArea,
  transformLandParcelsWithGeometry
} from '../../../../app/transformers/rural-payments/lms.js'

describe('LMS transformer', () => {
  test('transformLandCovers', () => {
    const input = { id: 'mockId', info: [{ area: 1000, name: 'Mock Name', code: 'mockId' }] }
    const output = [{ area: 1000, id: 'mockId', name: 'MOCK_NAME', code: 'mockId' }]
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
})
