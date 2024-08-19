import { transformAuthenticateQuestionsAnswers } from '../../../transformers/authenticate/question-answers.js'
import {
  ruralPaymentsPortalCustomerTransformer,
  transformNotificationsToMessages,
  transformPersonSummaryToCustomerAuthorisedFilteredBusiness,
  transformBusinessCustomerToCustomerPermissionGroups,
  transformBusinessCustomerToCustomerRole,
  transformPersonSummaryToCustomerAuthorisedBusinesses
} from '../../../transformers/rural-payments/customer.js'
import { logger } from '../../../utils/logger.js'

export const Customer = {
  async personId ({ crn }, __, { dataSources }) {
    const { id: personId } =
      await dataSources.ruralPaymentsCustomer.getCustomerByCRN(crn)
    logger.info('Get customer id from crn', { crn, personId })
    return personId
  },

  async info ({ crn }, __, { dataSources }) {
    const response = await dataSources.ruralPaymentsCustomer.getCustomerByCRN(
      crn
    )
    return ruralPaymentsPortalCustomerTransformer(response)
  },

  async business ({ crn }, { sbi }, { dataSources }) {
    const { id: personId } =
      await dataSources.ruralPaymentsCustomer.getCustomerByCRN(crn)

    return transformPersonSummaryToCustomerAuthorisedFilteredBusiness(
      sbi,
      await dataSources.ruralPaymentsCustomer.getPersonBusinessesByPersonId(
        personId,
        sbi
      )
    )
  },

  async businesses ({ crn }, __, { dataSources }) {
    const { id: personId } =
      await dataSources.ruralPaymentsCustomer.getCustomerByCRN(crn)
    const summary =
      await dataSources.ruralPaymentsCustomer.getPersonBusinessesByPersonId(
        personId
      )
    logger.info('Get customer businesses', { crn, personId, summary })
    return transformPersonSummaryToCustomerAuthorisedBusinesses(
      { personId, crn },
      summary
    )
  },

  async authenticationQuestions ({ crn }, __, { dataSources }) {
    const results =
      await dataSources.authenticateDatabase.getAuthenticateQuestionsAnswersByCRN(
        crn
      )
    return transformAuthenticateQuestionsAnswers(results)
  }
}

export const CustomerBusiness = {
  async role ({ organisationId, crn }, __, { dataSources }) {
    logger.info('Get customer business role', { crn, organisationId })
    const businessCustomers =
      await dataSources.ruralPaymentsBusiness.getOrganisationCustomersByOrganisationId(
        organisationId
      )
    return transformBusinessCustomerToCustomerRole(crn, businessCustomers)
  },

  async messages (
    { organisationId, personId },
    { pagination, showOnlyDeleted },
    { dataSources }
  ) {
    const defaultPaginationPage = 1
    const defaultPaginationPerPage = 5

    const notifications =
      await dataSources.ruralPaymentsCustomer.getNotificationsByOrganisationIdAndPersonId(
        organisationId,
        personId,
        pagination?.page || defaultPaginationPage,
        pagination?.perPage || defaultPaginationPerPage
      )

    return transformNotificationsToMessages(notifications, showOnlyDeleted)
  },

  async permissionGroups ({ organisationId, crn }, __, { dataSources }) {
    const businessCustomers =
      await dataSources.ruralPaymentsBusiness.getOrganisationCustomersByOrganisationId(
        organisationId
      )

    return transformBusinessCustomerToCustomerPermissionGroups(
      crn,
      businessCustomers,
      dataSources.permissions.getPermissionGroups()
    )
  }
}
