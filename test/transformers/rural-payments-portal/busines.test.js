import { transformOrganisationToBusiness } from '../../../app/transformers/rural-payments-portal/business.js'
import { organisationByOrgId } from '../../../mocks/fixtures/organisation.js'

describe('Business transformer', () => {
  test('transformOrganisationToBusiness', () => {
    const { _data: organisation } = organisationByOrgId(5565448)

    expect(transformOrganisationToBusiness(organisation)).toEqual({
      businessId: '5565448',
      info: {
        address: {
          buildingName: 'STOCKWELL HALL',
          buildingNumberRange: '7',
          city: 'DARLINGTON',
          country: 'United Kingdom',
          county: 'Dorset',
          dependentLocality: 'ELLICOMBE',
          doubleDependentLocality: 'WOODTHORPE',
          flatName: 'THE COACH HOUSE',
          pafOrganisationName: 'FORTESCUE ESTATES',
          postalCode: 'CO9 3LS',
          street: 'HAREWOOD AVENUE',
          typeId: null,
          uprn: '10008695234'
        },
        email: {
          address: 'henleyrej@eryelnehk.com.test',
          doNotContact: false,
          validated: true
        },
        legalStatus: { code: 102111, type: 'Sole Proprietorship' },
        name: 'HENLEY, RE',
        phone: { fax: null, landline: '01234031859', mobile: null },
        reference: '1102179604',
        registrationNumbers: { charityCommission: null, companiesHouse: null },
        traderNumber: null,
        type: { code: 101443, type: 'Not Specified' },
        vat: null,
        vendorNumber: '694523'
      },
      sbi: '107183280'
    })
  })
})
