import { DefaultAzureCredential } from '@azure/identity'

const credential = new DefaultAzureCredential()

export const auditRoute = {
  method: 'GET',
  path: '/audit',
  handler: async (request, h) => {
    try {
      const auth = await credential.getToken('https://graph.microsoft.com/.default')

      const headers = new Headers()
      headers.append('Authorization', auth.token)

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      // const auditInfo = await fetch(
      //   `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${request.query.email}'&$select=id,displayName,employeeId`,
      //   requestOptions
      // )
      // const { value: details } = await auditInfo.json()

      const auditInfo = await fetch(
        `https://graph.microsoft.com/v1.0/users/${request.query.id}?$select=id,displayName,employeeId`,
        requestOptions
      )
      const details = await auditInfo.json()

      return h.response(JSON.stringify(details)).code(200)
    } catch (err) {
      console.error(err)
      return h.response(`whoops!\n${JSON.stringify(err)}`).code(500)
    }
  }
}
