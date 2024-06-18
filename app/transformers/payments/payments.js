export function transformPayments (payments = []) {
  if (!payments) {
    return []
  }

  if (payments.length === 0) {
    return []
  }

  return payments.map(payment => {
    return {
      firmReferenceNumber: payment.firm_reference_number,
      bacsRef: payment.bacs_ref,
      paymentDate: payment.payment_date,
      agreementClaimNumber: payment.agreement_claim_no,
      scheme: payment.scheme,
      marketingYear: payment.marketing_year,
      description: payment.description,
      transactionAmount: payment.transaction_amount,
      transactionCurrency: payment.transaction_currency
    }
  })
}
