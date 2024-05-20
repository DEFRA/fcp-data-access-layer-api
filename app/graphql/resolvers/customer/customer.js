import { transformAuthenticateQuestionsAnswers } from '../../../transformers/authenticate/question-answers.js'
import {
  ruralPaymentsPortalCustomerTransformer,
  transformNotificationsToMessages,
  transformPersonRolesToCustomerAuthorisedBusinessesRoles,
  transformPersonSummaryToCustomerAuthorisedBusinesses,
  transformPersonSummaryToCustomerAuthorisedFilteredBusiness
} from '../../../transformers/rural-payments-portal/customer.js'
import { transformOrganisationAuthorisationToCustomerBusinessPermissionLevel } from '../../../transformers/rural-payments-portal/permissions.js'

export const Customer = {
  async customerId ({ crn }, __, { dataSources }) {
    const { id } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    return id
  },

  async info ({ crn }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    return ruralPaymentsPortalCustomerTransformer(response)
  },

  async business ({ crn }, { sbi }, { dataSources }) {
    const { id } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    return transformPersonSummaryToCustomerAuthorisedFilteredBusiness(
      id,
      sbi,
      await dataSources.ruralPaymentsPortalApi.getPersonSummaryByPersonId(id, sbi)
    )
  },

  async businesses ({ crn }, __, { dataSources }) {
    const { id } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    const summary = await dataSources.ruralPaymentsPortalApi.getPersonSummaryByPersonId(id)
    return transformPersonSummaryToCustomerAuthorisedBusinesses(id, summary)
  },

  async authenticationQuestions ({ crn }, __, { dataSources }) {
    const results = await dataSources.authenticateDatabase.getAuthenticateQuestionsAnswersByCRN(crn)
    return transformAuthenticateQuestionsAnswers(results)
  }
}

export const CustomerBusiness = {
  async roles ({ businessId, customerId }, __, { dataSources }) {
    const authorisation = await dataSources.ruralPaymentsPortalApi.getAuthorisationByOrganisationId(businessId)
    return transformPersonRolesToCustomerAuthorisedBusinessesRoles(customerId, authorisation.personRoles)
  },

  async messages ({ businessId, customerId }, { pagination, showOnlyDeleted }, { dataSources }) {
    const defaultPaginationPage = 1
    const defaultPaginationPerPage = 5

    const notifications = await dataSources.ruralPaymentsPortalApi.getNotificationsByOrganisationIdAndPersonId(
      businessId,
      customerId,
      pagination?.page || defaultPaginationPage,
      pagination?.perPage || defaultPaginationPerPage
    )

    return transformNotificationsToMessages(notifications, showOnlyDeleted)
  },

  async permissionGroups ({ businessId, customerId }, __, { dataSources }) {
    return dataSources.permissions.getPermissionGroups().map(permissionGroup => ({ ...permissionGroup, businessId, customerId }))
  }
}

export const CustomerBusinessPermissionGroup = {
  async level ({ businessId, customerId, permissions }, __, { dataSources }) {
    const authorisation = await dataSources.ruralPaymentsPortalApi.getAuthorisationByOrganisationId(businessId)
    return transformOrganisationAuthorisationToCustomerBusinessPermissionLevel(customerId, permissions, authorisation.personPrivileges)
  }
}
