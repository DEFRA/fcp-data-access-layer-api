import { DefaultAzureCredential } from '@azure/identity'
import { graphql, GraphQLError } from 'graphql'

import { NotFound } from '../../../../app/errors/graphql.js'
import { schema } from '../../../../app/graphql/server.js'
import { transformAuthenticateQuestionsAnswers } from '../../../../app/transformers/authenticate/question-answers.js'
import { ruralPaymentsPortalCustomerTransformer } from '../../../../app/transformers/rural-payments/customer.js'
import { personById } from '../../../../mocks/fixtures/person.js'
import mockServer from '../../../../mocks/server.js'
import { fakeContext } from '../../../test-setup.js'

const personFixture = personById({ id: '5007136' })

beforeAll(mockServer.start)
afterAll(mockServer.stop)

describe('Query.customer', () => {
  it('should return customer data', async () => {
    const customerInfo = ruralPaymentsPortalCustomerTransformer(personFixture._data)
    const result = await graphql({
      source: `#graphql
        query Customer($crn: ID!) {
          customer(crn: $crn) {
            crn
            personId
            info {
              name {
                title
                otherTitle
                first
                middle
                last
              }
              dateOfBirth
              phone {
                mobile
                landline
                fax
              }
              email {
                address
                validated
                doNotContact
              }
              status {
                locked
                confirmed
                deactivated
              }
              address {
                pafOrganisationName
                buildingNumberRange
                buildingName
                flatName
                street
                city
                county
                postalCode
                country
                uprn
                dependentLocality
                doubleDependentLocality
                typeId
              }
            }
          }
        }
      `,
      variableValues: {
        crn: '0866159801'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          crn: personFixture._data.customerReferenceNumber,
          personId: personFixture._data.id.toString(),
          info: customerInfo
        }
      }
    })
  })

  it('should handle person not found error', async () => {
    await mockServer.server.mock.useRouteVariant('rural-payments-person-get-by-id:not-found')

    const result = await graphql({
      source: `#graphql
        query Customer($crn: ID!) {
          customer(crn: $crn) {
            info { dateOfBirth }
          }
        }
      `,
      variableValues: {
        crn: '0866159801'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: { customer: { info: null } },
      errors: [new GraphQLError('Rural payments customer not found')]
    })

    await mockServer.server.mock.useRouteVariant('rural-payments-person-get-by-id:default')
  })

  it('should handle error', async () => {
    await mockServer.server.mock.useRouteVariant('rural-payments-person-get-by-id:error')

    const result = await graphql({
      source: `#graphql
        query Customer($crn: ID!) {
          customer(crn: $crn) {
            info { dateOfBirth }
          }
        }
      `,
      variableValues: {
        crn: '0866159801'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: { customer: { info: null } },
      errors: [new GraphQLError('Internal Server Error')]
    })

    await mockServer.server.mock.useRouteVariant('rural-payments-person-get-by-id:default')
  })

  describe('Handle 500 errors', () => {
    afterEach(async () => {
      await mockServer.server.mock.restoreRouteVariants()
    })

    it('should retry request if 500 error', async () => {
      await mockServer.server.mock.useRouteVariant('rural-payments-person-get-by-crn:error')

      const result = await graphql({
        source: `#graphql
          query TestCustomerBusinesses($crn: ID!) {
            customer(crn: $crn) {
              personId
            }
          }
        `,
        variableValues: {
          crn: '9477368292'
        },
        schema,
        contextValue: fakeContext
      })

      expect(result).toEqual({
        data: {
          customer: {
            personId: '5302028'
          }
        }
      })
    })

    it('should throw an error after 3 retries', async () => {
      await mockServer.server.mock.useRouteVariant(
        'rural-payments-person-get-by-crn:error-indefinite'
      )

      const result = await graphql({
        source: `#graphql
          query TestCustomerBusinesses($crn: ID!) {
            customer(crn: $crn) {
              personId
            }
          }
        `,
        variableValues: {
          crn: '9477368292'
        },
        schema,
        contextValue: fakeContext
      })

      expect(result).toEqual({
        data: {
          customer: null
        },
        errors: [new GraphQLError('Internal Server Error')]
      })
    })
  })
})

describe('Handle other errors', () => {
  afterEach(async () => {
    await mockServer.server.mock.restoreRouteVariants()
  })

  it('should handle 403 error', async () => {
    await mockServer.server.mock.useRouteVariant(
      'rural-payments-person-get-by-crn:error-permission'
    )

    const result = await graphql({
      source: `#graphql
        query TestCustomerBusinesses($crn: ID!) {
          customer(crn: $crn) {
            personId
          }
        }
      `,
      variableValues: {
        crn: '1103020285' // personId: 5007136
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: null
      },
      errors: [new GraphQLError('Forbidden')]
    })
  })
})

describe('Query.customer.authenticationQuestions', () => {
  beforeEach(() => {
    jest
      .spyOn(DefaultAzureCredential.prototype, 'getToken')
      .mockImplementation(() => ({ token: 'mockToken' }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return customer authenticate questions', async () => {
    const authenticateQuestionsResponse = {
      date: '11/11/2000',
      event: 'Birthday',
      location: 'location',
      lastUpdatedOn: 3494617373808
    }
    const transformedAuthenticateQuestions = transformAuthenticateQuestionsAnswers(
      authenticateQuestionsResponse
    )
    const result = await graphql({
      source: `#graphql
        query Customer {
          customer(crn: "4705658987") {
            authenticationQuestions {
              memorableDate
              memorableEvent
              memorablePlace
              updatedAt
              isFound
            }
          }
        }
      `,
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          authenticationQuestions: JSON.parse(JSON.stringify(transformedAuthenticateQuestions))
        }
      }
    })
  })

  it('should return isFound false if record not found', async () => {
    await mockServer.server.mock.useRouteVariant('rural-payments-authenticate-get-by-crn:not-found')
    const result = await graphql({
      source: `#graphql
        query Customer {
          customer(crn: "0866159801") {
            authenticationQuestions {
              memorableDate
              memorableEvent
              memorablePlace
              updatedAt
              isFound
            }
          }
        }
      `,
      variableValues: {
        personId: '123'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          authenticationQuestions: {
            memorableDate: null,
            memorableEvent: null,
            memorablePlace: null,
            updatedAt: null,
            isFound: false
          }
        }
      }
    })
  })

  it('should return null for fields that are empty', async () => {
    const result = await graphql({
      source: `#graphql
        query Customer {
          customer(crn: "3646257965") {
            authenticationQuestions {
              memorableDate
              memorableEvent
              memorablePlace
              updatedAt
              isFound
            }
          }
        }
      `,
      variableValues: {
        personId: '123'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          authenticationQuestions: {
            memorableDate: 'Birthday',
            memorableEvent: null,
            memorablePlace: null,
            updatedAt: 3494617373808,
            isFound: true
          }
        }
      }
    })
  })
})

describe('Query.customer.businesses', () => {
  it('should return customer businesses', async () => {
    const result = await graphql({
      source: `#graphql
        query TestCustomerBusinesses($crn: ID!) {
          customer(crn: $crn) {
            businesses {
              sbi
              organisationId
              role
               permissionGroups {
                 id
                 level
               }
            }
          }
        }
      `,
      variableValues: {
        crn: '9477368292'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          businesses: [
            {
              sbi: '107591843',
              organisationId: '5625145',
              role: 'Agent',
              permissionGroups: [
                { id: 'BASIC_PAYMENT_SCHEME', level: 'SUBMIT' },
                { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
                { id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS', level: 'SUBMIT' },
                { id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS', level: 'SUBMIT' },
                { id: 'ENTITLEMENTS', level: 'AMEND' },
                { id: 'ENVIRONMENTAL_LAND_MANAGEMENT_APPLICATIONS', level: 'SUBMIT' },
                { id: 'LAND_DETAILS', level: 'AMEND' }
              ]
            }
          ]
        }
      }
    })
  })

  it('should handle error', async () => {
    await mockServer.server.mock.useRouteVariant(
      'rural-payments-get-person-organisations-summary-by-person-id:error'
    )

    const result = await graphql({
      source: `#graphql
        query Customer($crn: ID!) {
          customer(crn: $crn) {
            businesses {
              sbi
            }
          }
        }
      `,
      variableValues: {
        crn: '0866159801'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: { customer: { businesses: null } },
      errors: [new GraphQLError('Internal Server Error')]
    })

    await mockServer.server.mock.useRouteVariant(
      'rural-payments-get-person-organisations-summary-by-person-id:default'
    )
  })
})

describe('Query.customer.businesses.messages', () => {
  it('should return customer businesses messages', async () => {
    const result = await graphql({
      source: `#graphql
        query Messages($crn: ID!, $pagination: Pagination, $deleted: Boolean) {
          customer(crn: $crn) {
            businesses {
              messages(pagination: $pagination, showOnlyDeleted: $deleted) {
                title
                read
                id
                date
              }

            }
          }
        }
      `,
      variableValues: {
        crn: '0866159801',
        pagination: {
          page: 1,
          perPage: 3
        },
        deleted: false
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          businesses: [
            {
              messages: [
                {
                  title: 'Permission changed for David Paul',
                  read: false,
                  id: '11401',
                  date: 6010706997254
                },
                {
                  title: 'Permission changed for David Paul',
                  read: true,
                  id: '7551987',
                  date: 8327630499790
                }
              ]
            }
          ]
        }
      }
    })
  })

  it('should return deleted customer businesses messages', async () => {
    const result = await graphql({
      source: `#graphql
        query Messages($crn: ID!, $pagination: Pagination, $deleted: Boolean) {
          customer(crn: $crn) {
            businesses {
              messages(pagination: $pagination, showOnlyDeleted: $deleted) {
                title
                read
                id
                date
              }
            }
          }
        }
      `,
      variableValues: {
        crn: '0866159801',
        pagination: {
          page: 1,
          perPage: 3
        },
        deleted: true
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          businesses: [
            {
              messages: [
                {
                  title: 'Permission changed for David Paul',
                  read: false,
                  id: '9315941',
                  date: 8862388585856
                }
              ]
            }
          ]
        }
      }
    })
  })

  it('should handle error when no businesses', async () => {
    const result = await graphql({
      source: `#graphql
        query Messages($crn: ID!, $pagination: Pagination, $deleted: Boolean) {
          customer(crn: $crn) {
            businesses {
              messages(pagination: $pagination, showOnlyDeleted: $deleted) {
                title
                read
                id
                date
              }
            }
          }
        }
      `,
      variableValues: {
        crn: '123',
        pagination: {
          page: 1,
          perPage: 3
        },
        deleted: true
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        customer: {
          businesses: null
        }
      },
      errors: [new NotFound('Rural payments customer not found')]
    })
  })
})
