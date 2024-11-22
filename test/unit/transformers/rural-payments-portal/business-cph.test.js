import { transformCPHInfo, transformOrganisationCPH } from '../../../../app/transformers/rural-payments/business-cph.js'
import { organisationCPH, organisationCPHInfo } from '../../../../mocks/fixtures/organisation-cph.js'

const organisationCPHInfoFixture = organisationCPHInfo('5565448').data
const organisationCPHFixture = organisationCPH('5565448').data

describe('Test Business CPHField Transformer', () => {
  describe('transformOrganisationCPH', () => {
    const systemUnderTest = transformOrganisationCPH

    test('given id is not populated, should return null', () => {
      expect(
        transformOrganisationCPH(null, [
          {
            cphNumber: '43/060/0025',
            parcelNumbers: ['SP2936 2318']
          }
        ])
      ).toEqual(null)
    })

    test('given data is not populated, should return null', () => {
      expect(transformOrganisationCPH('ID', null)).toEqual(null)
    })

    test('given input is populated with all the fields, should enrich and transform to new data model', () => {
      expect(
        systemUnderTest('id', [
          {
            cphNumber: '43/060/0025',
            parcelNumbers: ['SP2936 2318']
          }
        ])
      ).toEqual([
        {
          number: '43/060/0025',
          parcelNumbers: ['SP2936 2318']
        }
      ])
    })
  })

  describe('transformCPHInfo', () => {
    const systemUnderTest = transformCPHInfo

    test('given input is empty, should return null', () => {
      expect(systemUnderTest(null)).toEqual(null)
    })

    test('given input has coordinates populated, should return null', () => {
      expect(
        systemUnderTest(
          '10/327/0023',
          organisationCPHFixture,
          organisationCPHInfoFixture
        )
      ).toEqual({
        coordinate: { x: 267000, y: 128000 },
        expiryDate: 1456876800,
        number: '10/327/0023',
        parcelNumbers: ['SS6927 1650'],
        parish: 'FILLEIGH',
        species: ['OTHER'],
        startDate: 1381359600
      })
    })
  })
})
