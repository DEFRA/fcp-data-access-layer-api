import { transformPayments } from '../../../app/transformers/payments/payments.js'

describe('transformPayments Test', () => {
  const systemUnderTest = transformPayments

  describe('given payload has no payments defined', () => {
    const actual = systemUnderTest(null)

    test('it should return a JSON with applications field and an empty array', () => {
      expect(actual).toEqual([])
    })
  })

  describe('given payload has payments defined as an empty array', () => {
    const actual = systemUnderTest(null)

    test('it should return a JSON with applications field and an empty array', () => {
      expect(actual).toEqual([])
    })
  })

  describe('given payload has two payments defined', () => {
    const paymentsFixture = [
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
      },
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
    const actual = systemUnderTest(paymentsFixture)

    test('it should return an enrich JSON with payments populated', () => {
      expect(actual).toEqual([
        {
          firmReferenceNumber: paymentsFixture[0].firm_reference_number,
          bacsRef: paymentsFixture[0].bacs_ref,
          paymentDate: paymentsFixture[0].payment_date,
          agreementClaimNumber: paymentsFixture[0].agreement_claim_no,
          scheme: paymentsFixture[0].scheme,
          marketingYear: paymentsFixture[0].marketing_year,
          description: paymentsFixture[0].description,
          transactionAmount: paymentsFixture[0].transaction_amount,
          transactionCurrency: paymentsFixture[0].transaction_currency
        },
        {
          firmReferenceNumber: paymentsFixture[1].firm_reference_number,
          bacsRef: paymentsFixture[1].bacs_ref,
          paymentDate: paymentsFixture[1].payment_date,
          agreementClaimNumber: paymentsFixture[1].agreement_claim_no,
          scheme: paymentsFixture[1].scheme,
          marketingYear: paymentsFixture[1].marketing_year,
          description: paymentsFixture[1].description,
          transactionAmount: paymentsFixture[1].transaction_amount,
          transactionCurrency: paymentsFixture[1].transaction_currency
        }
      ])
    })
  })
})
