import nock from 'nock'
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { makeTestQuery } from './makeTestQuery.js'

beforeAll(() => {
  nock.disableNetConnect()

  nock('http://127.0.0.1:4100')
    .post('/apim/some-tenant-id/oauth2/v2.0/token')
    .reply(200, {
      access_token: randomUUID()
    })
    .post('/v1/organisation/search', {
      searchFieldType: 'SBI',
      primarySearchPhrase: 'sbi',
      offset: 0,
      limit: 1
    })
    .reply(200, {
      _data: [
        {
          id: 'id'
        }
      ]
    })
    .get('/v1/organisation/id')
    .reply(200, {
      _data: {
        id: 'id',
        sbi: 'sbi',
        name: 'name',
        businessReference: 'businessReference'
      }
    })
})

afterAll(() => {
  nock.cleanAll()
  nock.enableNetConnect()
})

test('Query.business', async () => {
  expect(
    await makeTestQuery(`#graphql
      query BusinessTest {
        business(sbi: "sbi") {
          organisationId
          sbi
          # land {
          #   parcels {
          #     id
          #     sheetId
          #     parcelId
          #     area
          #     pendingDigitisation
          #   }
          #   parcel(sheetId: null, parcelId: null, date: null) {
          #     id
          #     sheetId
          #     parcelId
          #     area
          #     pendingDigitisation
          #     effectiveToDate
          #     effectiveFromDate
          #   }
          #   parcelCovers(sheetId: null, parcelId: null) {
          #     id
          #     name
          #     area
          #     code
          #     isBpsEligible
          #   }
          #   summary {
          #     arableLandArea
          #     permanentCropsArea
          #     permanentGrasslandArea
          #     totalArea
          #     totalParcels
          #   }
          # }
          # customers {
          #   personId
          #   firstName
          #   lastName
          #   crn
          #   role
          # }
          # customer(crn: null) {
          #   personId
          #   firstName
          #   lastName
          #   crn
          #   role
          #   permissionGroups {
          #     id
          #     level
          #     functions
          #   }
          # }
        }
      }
`)
  ).toEqual({
    data: {
      business: {
        sbi: 'sbi',
        organisationId: 'id'
      }
    }
  })
})
