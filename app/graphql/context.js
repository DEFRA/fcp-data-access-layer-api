import { apolloServer } from './server.js'
import { AuthenticateDatabase } from '../data-sources/authenticate/AuthenticateDatabase.js'
import { Authorize } from '../auth/authorize.js'
import { EntraIdApi } from '../data-sources/entra-id/EntraIdApi.js'
import { getAuth } from '../auth/authenticate.js'
import { Permissions } from '../data-sources/static/permissions.js'
import { RuralPaymentsPortalApi } from '../data-sources/rural-payments-portal/RuralPaymentsPortalApi.js'
import { DefaultAzureCredential } from '@azure/identity'

const ENTRA_ID_URL = process.env.ENTRA_ID_URL
const ENTRA_ID_TTL_IN_SECONDS = process.env.ENTRA_ID_TTL_IN_SECONDS
const credential = new DefaultAzureCredential()

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
      entraIdApi: new EntraIdApi({
        async getToken () {
          const { token } = await credential.getToken(`${ENTRA_ID_URL}/.default`)
          return token
        },
        cache: apolloServer.cache,
        baseURL: ENTRA_ID_URL,
        ttl: ENTRA_ID_TTL_IN_SECONDS
      })
    }
  }
}
