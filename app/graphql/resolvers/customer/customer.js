import {
  transformPersonRolesToCustomerAuthorisedBusinessesRoles,
  transformPersonSummaryToCustomerAuthorisedBusinesses,
  transformNotificationsToMessages
} from '../../../transformers/rural-payments-portal/customer.js'
import { transformOrganisationAuthorisationToCustomerBusinessPermissionLevel } from '../../../transformers/rural-payments-portal/permissions.js'

export const Customer = {
  async businesses ({ id }, __, { dataSources }) {
    const summary = await dataSources.ruralPaymentsPortalApi.getPersonSummaryByPersonId(id)
    return transformPersonSummaryToCustomerAuthorisedBusinesses(id, summary)
  }
}

export const CustomerBusiness = {
  async roles ({ customerId, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    const authorisation = await dataSources
      .ruralPaymentsPortalApi
      .getAuthorisationByOrganisationId(sbi)

    return transformPersonRolesToCustomerAuthorisedBusinessesRoles(customerId, authorisation.personRoles)
  },

  async messages ({ customerId, sbi }, { pagination, showOnlyDeleted }, { dataSources }) {
    if (!sbi) {
      return null
    }

    const notifications = await dataSources
      .ruralPaymentsPortalApi
      .getNotificationsByOrganisationIdAndPersonId(
        sbi,
        customerId,
        pagination?.page || 1,
        pagination?.perPage || 1
      )

    return transformNotificationsToMessages(notifications, showOnlyDeleted)
  },

  async permissionGroups ({ customerId, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    return dataSources.permissions.getPermissionGroups().map(
      permissionGroup => ({ ...permissionGroup, businessId: sbi, customerId })
    )
  }
}

export const CustomerBusinessPermissionGroup = {
  async level ({ businessId, customerId, permissions, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    const authorisation = await dataSources
      .ruralPaymentsPortalApi
      .getAuthorisationByOrganisationIdAndPersonId(sbi, customerId)

    return transformOrganisationAuthorisationToCustomerBusinessPermissionLevel(permissions, authorisation)
  }
}
