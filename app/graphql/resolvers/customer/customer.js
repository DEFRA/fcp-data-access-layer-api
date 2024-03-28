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
  async roles ({ id, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    const authorisation = await dataSources
      .ruralPaymentsPortalApi
      .getAuthorisationByOrganisationId(sbi)

    return transformPersonRolesToCustomerAuthorisedBusinessesRoles(id, authorisation.personRoles)
  },

  async messages ({ id, sbi }, { pagination, showOnlyDeleted }, { dataSources }) {
    if (!sbi) {
      return null
    }

    const notifications = await dataSources
      .ruralPaymentsPortalApi
      .getNotificationsByOrganisationIdAndPersonId(
        sbi,
        id,
        pagination?.page || 1,
        pagination?.perPage || 1
      )

    return transformNotificationsToMessages(notifications, showOnlyDeleted)
  },

  async permissionGroups ({ id, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    return dataSources.permissions.getPermissionGroups().map(
      permissionGroup => ({ ...permissionGroup, businessId: sbi, customerId: id })
    )
  }
}

export const CustomerBusinessPermissionGroup = {
  async level ({ id, permissions, sbi }, __, { dataSources }) {
    if (!sbi) {
      return null
    }

    const authorisation = await dataSources
      .ruralPaymentsPortalApi
      .getAuthorisationByOrganisationIdAndPersonId(sbi, id)

    return transformOrganisationAuthorisationToCustomerBusinessPermissionLevel(permissions, authorisation)
  }
}
