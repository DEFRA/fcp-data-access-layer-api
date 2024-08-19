import { apolloServer } from './server.js'
import { AuthenticateDatabase } from '../data-sources/authenticate/AuthenticateDatabase.js'
import { Authorize } from '../auth/authorize.js'
import { EntraIdApi } from '../data-sources/entra-id/EntraIdApi.js'
import { getAuth } from '../auth/authenticate.js'
import { Permissions } from '../data-sources/static/permissions.js'
import { RuralPaymentsPortalApi } from '../data-sources/rural-payments-portal/RuralPaymentsPortalApi.js'

export async function context ({ request }) {
  const auth = await getAuth(request)
  return {
    authorize: new Authorize(
      { adGroups: auth.groups || [] }
    ),
    auth,
    dataSources: {
      ruralPaymentsPortalApi: new RuralPaymentsPortalApi(),
      authenticateDatabase: new AuthenticateDatabase(),
      permissions: new Permissions(),
      entraIdApi: new EntraIdApi({ cache: apolloServer.cache })
    }
  }
}
