import { describe, expect, jest } from '@jest/globals'
import { Privileges } from '../../../../app/data-sources/privilege/descriptions.js'
import { Permissions } from '../../../../app/data-sources/static/permissions.js'
import {
  transformBusinessCustomerPrivilegesToPermissionGroups,
  transformOrganisationCustomers
} from '../../../../app/transformers/rural-payments/business.js'
import { organisationPeopleByOrgId } from '../../../../mocks/fixtures/organisation.js'
import mockServer from '../../../../mocks/server'

describe('Business transformer', () => {
  beforeAll(mockServer.start)
  afterAll(mockServer.stop)

  test('#transformOrganisationCustomers', () => {
    const { _data: customers } = organisationPeopleByOrgId(5565448)

    const transformedCustomers = customers.map((customer) => {
      return {
        personId: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        crn: customer.customerReference,
        role: customer.role,
        privileges: customer.privileges
      }
    })

    expect(transformOrganisationCustomers(customers)).toEqual(transformedCustomers)
  })

  test('#transformBusinessCustomerPrivilegesToPermissionGroups', async () => {
    const permissions = new Permissions().getPermissionGroups()
    const privilegeDescriptions = await new Privileges({
      logger: { silly: jest.fn() }
    }).getPrivileges()
    const { _data: customers } = organisationPeopleByOrgId(5565448)

    const transformedPermissionGroups = customers.map((customer) => {
      return transformBusinessCustomerPrivilegesToPermissionGroups(
        customer.privileges,
        permissions,
        privilegeDescriptions
      )
    })

    expect(transformedPermissionGroups).toEqual([
      [
        { id: 'BASIC_PAYMENT_SCHEME', level: 'SUBMIT' },
        { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
        { id: 'ENTITLEMENTS', level: 'AMEND' },
        { id: 'LAND_DETAILS', level: 'AMEND' }
      ],
      [
        { id: 'BASIC_PAYMENT_SCHEME', level: 'SUBMIT' },
        { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS', level: 'SUBMIT' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS', level: 'SUBMIT' },
        { id: 'ENTITLEMENTS', level: 'AMEND' },
        { id: 'LAND_DETAILS', level: 'AMEND' }
      ],
      [
        { id: 'BASIC_PAYMENT_SCHEME', level: 'AMEND' },
        { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS', level: 'SUBMIT' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS', level: 'SUBMIT' },
        { id: 'ENTITLEMENTS', level: 'AMEND' },
        { id: 'LAND_DETAILS', level: 'AMEND' }
      ],
      [
        { id: 'BASIC_PAYMENT_SCHEME', level: 'SUBMIT' },
        { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS', level: 'SUBMIT' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS', level: 'SUBMIT' },
        { id: 'ENTITLEMENTS', level: 'AMEND' },
        {
          id: 'ENVIRONMENTAL_LAND_MANAGEMENT_APPLICATIONS',
          level: 'SUBMIT'
        },
        { id: 'LAND_DETAILS', level: 'AMEND' }
      ],
      [
        { id: 'BASIC_PAYMENT_SCHEME', level: 'SUBMIT' },
        { id: 'BUSINESS_DETAILS', level: 'FULL_PERMISSION' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_AGREEMENTS', level: 'SUBMIT' },
        { id: 'COUNTRYSIDE_STEWARDSHIP_APPLICATIONS', level: 'SUBMIT' },
        { id: 'ENTITLEMENTS', level: 'AMEND' },
        {
          id: 'ENVIRONMENTAL_LAND_MANAGEMENT_APPLICATIONS',
          level: 'NO_ACCESS'
        },
        { id: 'LAND_DETAILS', level: 'AMEND' }
      ]
    ])
  })
})
