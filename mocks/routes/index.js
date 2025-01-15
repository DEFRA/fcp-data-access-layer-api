import apimAuthentication from './apim/authentication.js'
import rppAuthenticate from './rpp/authenticate.js'
import rppLms from './rpp/lms.js'
import rppOrganisation from './rpp/organisation.js'

import ruralPaymentsAuthenticate from './rural-payments/authenticate.js'
import ruralPaymentsLms from './rural-payments/lms.js'
import ruralPaymentsMessages from './rural-payments/messages.js'
import ruralPaymentsOrganisation from './rural-payments/organisation.js'
import ruralPaymentsPerson from './rural-payments/person.js'
import ruralPaymentsSitiAgri from './rural-payments/siti-agri.js'

export const routes = [
  ...rppAuthenticate,
  ...rppLms,
  ...rppOrganisation,
  ...ruralPaymentsMessages,
  ...ruralPaymentsPerson,
  ...ruralPaymentsOrganisation,
  ...apimAuthentication,
  ...ruralPaymentsLms,
  ...ruralPaymentsSitiAgri,
  ...ruralPaymentsAuthenticate
]
