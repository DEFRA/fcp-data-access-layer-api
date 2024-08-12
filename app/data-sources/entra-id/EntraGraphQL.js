import { DefaultAzureCredential } from '@azure/identity'
import logger from '../../utils/logger.js'

const ENTRA_ID_URL = process.env.ENTRA_ID_URL || 'https://graph.microsoft.com'

const credential = new DefaultAzureCredential()

export default {
  lookupEmployeeID: async objectID => {
    let employeeId
    try {
      const auth = await credential.getToken(`${ENTRA_ID_URL}/.default`)

      const headers = new Headers()
      headers.append('Authorization', auth.token)

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      const response = await fetch(`${ENTRA_ID_URL}/v1.0/users/${objectID}?$select=employeeId`, requestOptions)
      employeeId = (await response.json()).employeeId
    } catch (err) {
      logger.error(err)
      throw new Error(`Could not get the employee ID for the user: ${objectID}`)
    }

    if (!employeeId?.length) throw new Error(`Missing employee ID for user: ${objectID}`)

    return employeeId
  }
}
