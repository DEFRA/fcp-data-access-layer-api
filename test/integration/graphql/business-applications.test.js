import { graphql } from 'graphql/index.js'
import { schema } from '../../../app/graphql/server.js'
import { fakeContext } from '../../test-setup.js'

describe('Query businessApplications', () => {
  it('should return application data', async () => {
    const paymentsResponse = [
      {
        firm_reference_number: 'some reference number',
        bacs_ref: 'some bacs ref',
        payment_date: 'some payment date',
        agreement_claim_no: 'some agreement claim number',
        scheme: 'some scheme',
        marketing_year: 'some marketing year',
        description: 'some description',
        transaction_amount: 'some transaction amount',
        transaction_currency: 'some transaction currency'
      }
    ]
    fakeContext.dataSources.paymentsDatabase.getPaymentsByApplicationId.mockResolvedValue(paymentsResponse)

    const result = await graphql({
      source: `#graphql
      query BusinessApplications {
          businessApplications(sbi: "107183280") {
              applicationId
              applicationStatus {
                  open
                  status
                  type
                  sector
                  year
                  frn
                  office
              }
              csClaim {
                  schemaYear
                  type
                  status
                  lastMovement
              }
              payments {
                  firmReferenceNumber
                  bacsRef
                  paymentDate
                  agreementClaimNumber
                  scheme
                  marketingYear
                  description
                  transactionAmount
                  transactionCurrency
              }
          }
      }
      `,
      variableValues: {
        sbi: '5444918'
      },
      schema,
      contextValue: fakeContext
    })

    expect(result).toEqual({
      data: {
        businessApplications: [
          {
            applicationId: expect.any(String),
            applicationStatus: {
              open: null,
              status: 'Withdrawn',
              type: expect.any(String),
              sector: null,
              year: 2023,
              frn: expect.any(String),
              office: null
            },
            csClaim: {
              schemaYear: 2023,
              type: expect.any(String),
              status: 'WTHDRW',
              lastMovement: expect.any(String)
            },
            payments: [
              {
                firmReferenceNumber: expect.any(String),
                bacsRef: expect.any(String),
                paymentDate: expect.any(String),
                agreementClaimNumber: expect.any(String),
                scheme: expect.any(String),
                marketingYear: expect.any(String),
                description: expect.any(String),
                transactionAmount: expect.any(String),
                transactionCurrency: expect.any(String)
              }
            ]
          },
          {
            applicationId: expect.any(String),
            applicationStatus: {
              open: null,
              status: 'Agreement Live',
              type: expect.any(String),
              sector: 'STANDA',
              year: 2023,
              frn: expect.any(String),
              office: null
            },
            csClaim: {
              schemaYear: 2023,
              type: expect.any(String),
              status: 'AGRLIV',
              lastMovement: expect.any(String)
            },
            payments: [
              {
                firmReferenceNumber: expect.any(String),
                bacsRef: expect.any(String),
                paymentDate: expect.any(String),
                agreementClaimNumber: expect.any(String),
                scheme: expect.any(String),
                marketingYear: expect.any(String),
                description: expect.any(String),
                transactionAmount: expect.any(String),
                transactionCurrency: expect.any(String)
              }
            ]
          }
        ]
      }
    })
  })
})
