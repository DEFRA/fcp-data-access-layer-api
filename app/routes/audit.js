import { DefaultAzureCredential } from '@azure/identity'
import logger from '../utils/logger.js'

const SUCCESS = 200
const ERROR = 500
const ENTRA_ID_URL = process.env.ENTRA_ID_URL || 'https://graph.microsoft.com'

const credential = new DefaultAzureCredential()

export const auditRoute = {
  method: 'GET',
  path: '/audit',
  handler: async (request, h) => {
    try {
      const auth = await credential.getToken(`${ENTRA_ID_URL}/.default`)

      const headers = new Headers()
      headers.append('Authorization', auth.token)

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      // const auditInfo = await fetch(
      //   `${ENTRA_ID_URL}/v1.0/users?$filter=mail eq '${request.query.email}'&$select=id,displayName,employeeId`,
      //   requestOptions
      // )
      // const { value: details } = await auditInfo.json()

      const auditInfo = await fetch(`${ENTRA_ID_URL}/v1.0/users/${request.query.id}?$select=id,displayName,employeeId`, requestOptions)
      const details = await auditInfo.json()

      return h.response(JSON.stringify(details)).code(SUCCESS)
    } catch (err) {
      logger.error(err)
      return h.response(`whoops!\n${JSON.stringify(err)}`).code(ERROR)
    }
  }
}
