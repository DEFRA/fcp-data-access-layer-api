import { graphql } from 'graphql'

import { context } from '../../../app/graphql/context.js'
import { schema } from '../../../app/graphql/server.js'

describe('Query.customer without authorization header', () => {
  it('customer query should return an auth error', async () => {
    const unAuthedContext = await context({})
    const result = await graphql({
      source: `#graphql
        query Customer {
          customer(crn: "0866159801") {
            crn
            info {
              name {
                title
                otherTitle
                first
                middle
                last
              }
            }
          }
        }
      `,
      schema,
      contextValue: unAuthedContext
    })
    expect(result.data.customer).toBeNull()
    expect(result.errors).toHaveLength(1)
  })

  it('business query should return an auth error', async () => {
    const unAuthedContext = await context({})
    const result = await graphql({
      source: `#graphql
        query Business {
          business(sbi: "107183280") {
            land {
              parcels {
                id
                sheetId
                area
              }
            }
          }
        }
      `,
      schema,
      contextValue: unAuthedContext
    })
    expect(result.data.business).toBeNull()
    expect(result.errors).toHaveLength(1)
  })

  it('permissions query should return an auth error', async () => {
    const unAuthedContext = await context({})
    const result = await graphql({
      source: `#graphql
          query PermissionGroups($crn: ID!, $sbi: ID!) {
            permissionGroups {
              id
              name
              permissions {
                active(crn: $crn, sbi: $sbi)
                functions
                level
              }
            }
          }
        `,
      variableValues: {
        crn: '1102634220',
        sbi: '107183280'
      },
      schema,
      contextValue: unAuthedContext
    })
    expect(result.data.permissionGroups).toBeNull()
    expect(result.errors).toHaveLength(1)
  })
})
