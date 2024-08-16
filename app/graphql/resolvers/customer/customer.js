import { GraphQLError } from 'graphql'
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
    const { id: customerId } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    return customerId
  },

  async info ({ crn }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    return ruralPaymentsPortalCustomerTransformer(response)
  },

  async business ({ crn }, { sbi }, { dataSources }) {
    const { id: customerId } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)

    return transformPersonSummaryToCustomerAuthorisedFilteredBusiness(
      customerId,
      sbi,
      await dataSources.ruralPaymentsPortalApi.getPersonSummaryByPersonId(customerId, sbi)
    )
  },

  async businesses ({ crn }, __, { dataSources }) {
    const { id: customerId } = await dataSources.ruralPaymentsPortalApi.getCustomerByCRN(crn)
    const summary = await dataSources.ruralPaymentsPortalApi.getPersonSummaryByPersonId(customerId)
    return transformPersonSummaryToCustomerAuthorisedBusinesses(customerId, summary)
  },

  async authenticationQuestions ({ crn }, { entraIdUserObjectId }, { dataSources, authorize }) {
    authorize.checkAuthGroup('ADMIN')

    const employeeId = await dataSources.entraIdApi.getEmployeeId(entraIdUserObjectId)

    if (!employeeId) {
      throw new GraphQLError('could not retrieve employee id')
    }

    const results = await dataSources.authenticateDatabase.getAuthenticateQuestionsAnswersByCRN(crn, employeeId)
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
