import { graphql } from 'graphql'

import { schema } from '../../../../app/graphql/server.js'
import mockServer from '../../../../mocks/server.js'
import { fakeContext } from '../../../test-setup.js'

beforeAll(mockServer.start)
afterAll(mockServer.stop)

describe('Query.permissionGroups', () => {
  it('should return permissions', async () => {
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
        crn: '1638563942',
        sbi: '107183280'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        permissionGroups: [
          {
            id: 'BASIC_PAYMENT_SCHEME',
            name: 'Basic payment scheme (BPS)',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: [
                  'View business summary',
                  'View claims',
                  'View land, features and covers'
                ],
                level: 'VIEW'
              },
              {
                active: false,
                functions: [
                  'View business summary',
                  'View claims',
                  'View land, features and covers',
                  'Create and edit a claim',
                  'Amend a previously submitted claim',
                  'Amend land, features and covers'
                ],
                level: 'AMEND'
              },
              {
                active: true,
                functions: [
                  'View business summary',
                  'View claims',
                  'View land, features and covers',
                  'Create and edit a claim',
                  'Amend a previously submitted claim',
                  'Amend land, features and covers',
                  'Submit a claim',
                  'Withdraw a claim',
                  'Receive warnings and notifications'
                ],
                level: 'SUBMIT'
              }
            ]
          },
          {
            id: 'BUSINESS_DETAILS',
            name: 'Business details',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: ['View business details', 'View people associated with the business'],
                level: 'VIEW'
              },
              {
                active: false,
                functions: [
                  'View business details',
                  'View people associated with the business',
                  'Amend business and correspondence contact details'
                ],
                level: 'AMEND'
              },
              {
                active: false,
                functions: [
                  'View business details',
                  'View people associated with the business',
                  'Amend business and correspondence contact details',
                  'Amend controlled information, such as business name',
                  'Confirm business details',
                  'Amend bank account details',
                  'Make young/new farmer declaration'
                ],
                level: 'MAKE_LEGAL_CHANGES'
              },
              {
                active: true,
                functions: [
                  'View business details',
                  'View people associated with the business',
                  'Amend business and correspondence contact details',
                  'Amend controlled information, such as business name',
                  'Confirm business details',
                  'Amend bank account details',
                  'Make young/new farmer declaration',
                  'Add someone to the business',
                  'Give permissions on business'
                ],
                level: 'FULL_PERMISSION'
              }
            ]
          },
          {
            id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS',
            name: 'Countryside Stewardship (Agreements)',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: [
                  'View CS Agreements',
                  'View Land, Features and Cover',
                  'View CS Agreement amendments',
                  'View CS agreement Transfers',
                  'View CS Claims'
                ],
                level: 'VIEW'
              },
              {
                active: false,
                functions: [
                  'View CS Agreements',
                  'View Land, Features and Cover',
                  'View CS Agreement amendments',
                  'View CS agreement Transfers',
                  'View CS Claims',
                  'Amend land, Features and Covers',
                  'Create and edit a CS claim',
                  'Amend a previously submitted claim',
                  'Create and edit a CS agreement Amendment',
                  'Revise a previously submitted agreement amendment',
                  'Create and Edit a CS agreement transfer',
                  'Revise a previously submitted agreement transfer'
                ],
                level: 'AMEND'
              },
              {
                active: false,
                functions: [
                  'View CS Agreements',
                  'View Land, Features and Cover',
                  'View CS Agreement amendments',
                  'View CS agreement Transfers',
                  'View CS Claims',
                  'Amend land, Features and Covers',
                  'Create and edit a CS claim',
                  'Amend a previously submitted claim',
                  'Create and edit a CS agreement Amendment',
                  'Revise a previously submitted agreement amendment',
                  'Create and Edit a CS agreement transfer',
                  'Revise a previously submitted agreement transfer',
                  'Submit Acceptance of CS Agreement offer',
                  'Submit rejection of CS agreement offer',
                  'Submit (and resubmit) a CS claim',
                  'Withdraw a CS claim',
                  'Submit (and resubmit) a CS agreement amendment',
                  'Withdraw a CS agreement amendment',
                  'Submit (and resubmit) a CS agreement transfer',
                  'Withdraw a CS agreement transfer',
                  'Receive warnings and notifications'
                ],
                level: 'SUBMIT'
              }
            ]
          },
          {
            id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS',
            name: 'Countryside Stewardship (Applications)',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: [
                  'View CS Scheme eligibility',
                  'View Applications',
                  'View land, features and covers',
                  'View CS agreement offer'
                ],
                level: 'VIEW'
              },
              {
                active: false,
                functions: [
                  'View CS Scheme eligibility',
                  'View Applications',
                  'View land, features and covers',
                  'View CS agreement offer',
                  'View draft CS Agreements',
                  'Create and edit a CS application',
                  'Amend a previously submitted CS application',
                  'Amend Land, Features and Covers'
                ],
                level: 'AMEND'
              },
              {
                active: false,
                functions: [
                  'View CS Scheme eligibility',
                  'View Applications',
                  'View land, features and covers',
                  'View CS agreement offer',
                  'View draft CS Agreements',
                  'Create and edit a CS application',
                  'Amend a previously submitted CS application',
                  'Amend Land, Features and Covers',
                  'Submit CS Application',
                  'Withdraw CS application',
                  'Receive warnings and notifications'
                ],
                level: 'SUBMIT'
              }
            ]
          },
          {
            id: 'ENTITLEMENTS',
            name: 'Entitlements',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: ['View entitlements'],
                level: 'VIEW'
              },
              {
                active: true,
                functions: [
                  'View entitlements',
                  'Transfer entitlements',
                  'Apply for new entitlements'
                ],
                level: 'AMEND'
              }
            ]
          },
          {
            id: 'ENVIRONMENTAL_LAND_MANAGEMENT_APPLICATIONS',
            name: 'Environmental Land Management (Applications)',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: [
                  'View Environmental Land Management scheme eligibility',
                  'View Environmental Land Management applications',
                  'View land, features and covers',
                  'View Environmental Land Management agreement offer'
                ],
                level: 'VIEW'
              },
              {
                active: false,
                functions: [
                  'View Environmental Land Management scheme eligibility',
                  'View Environmental Land Management applications',
                  'View land, features and covers',
                  'View Environmental Land Management agreement offer',
                  'View Environmental Land Management agreements',
                  'Create and edit a Environmental Land Management application',
                  'Amend (but not resubmit) a previously submitted Environmental Land Management application',
                  'Amend land, features and covers'
                ],
                level: 'AMEND'
              },
              {
                active: false,
                functions: [
                  'View Environmental Land Management scheme eligibility',
                  'View Environmental Land Management applications',
                  'View land, features and covers',
                  'View Environmental Land Management agreement offer',
                  'View Environmental Land Management agreements',
                  'Create and edit a Environmental Land Management application',
                  'Amend (but not resubmit) a previously submitted Environmental Land Management application',
                  'Amend land, features and covers',
                  'Submit Environmental Land Management application',
                  'Withdraw Environmental Land Management application',
                  'Submit acceptance of Environmental Land Management agreement offer',
                  'Submit rejection of Environmental Land Management agreement offer',
                  'Receive all application correspondence including all warnings and notifications'
                ],
                level: 'SUBMIT'
              }
            ]
          },
          {
            id: 'LAND_DETAILS',
            name: 'Land details',
            permissions: [
              { active: false, functions: [], level: 'NO_ACCESS' },
              {
                active: false,
                functions: ['View land, features and covers'],
                level: 'VIEW'
              },
              {
                active: true,
                functions: [
                  'View land, features and covers',
                  'Amend land, features and covers',
                  'Transfer land'
                ],
                level: 'AMEND'
              }
            ]
          }
        ]
      }
    })
    expect(true).toEqual(true)
  })
})
