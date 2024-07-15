import { transformOrganisationCSApplicationToBusinessApplications } from '../../../transformers/rural-payments-portal/applications-cs.js'
import { transformOrganisationCPH } from '../../../transformers/rural-payments-portal/business-cph.js'
import { transformOrganisationCustomers } from '../../../transformers/rural-payments-portal/business.js'
import { transformPrivilegesListToBusinessCustomerPermissions } from '../../../transformers/rural-payments-portal/permissions.js'

export const Business = {
  land ({ businessId }) {
    return { businessId }
  },

  async cph ({ businessId }, _, { dataSources }) {
    return transformOrganisationCPH(businessId, await dataSources.ruralPaymentsPortalApi.getOrganisationCPHCollectionBySBI(businessId))
  },

  async customers ({ businessId }, _, { dataSources }) {
    return transformOrganisationCustomers(await dataSources.ruralPaymentsPortalApi.getOrganisationCustomersByOrganisationId(businessId))
  },

  async applications ({ businessId }, _, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getApplicationsCountrysideStewardshipOrganisationId(businessId)

    return transformOrganisationCSApplicationToBusinessApplications(response.applications)
  }
}

export const BusinessCustomer = {
  permissions ({ privileges }, __, { dataSources }) {
    return transformPrivilegesListToBusinessCustomerPermissions(privileges, dataSources.permissions.getPermissionGroups())
  }
}
