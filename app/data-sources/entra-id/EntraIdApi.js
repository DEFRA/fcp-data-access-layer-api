import { RESTDataSource } from '@apollo/datasource-rest'

export class EntraIdApi extends RESTDataSource {
  constructor ({ getToken, cache, baseURL, ttl }) {
    super(cache)
    this.getToken = getToken
    this.baseURL = baseURL
    this.ttl = ttl
  }

  async getEmployeeId (csaUserId) {
    try {
      const { employeeId } = await this.get(
        `v1.0/users/${csaUserId}?$select=employeeId`,
        { headers: { Authorization: await this.getToken() }, cacheOptions: { ttl: this.ttl } }
      )
      return employeeId
    } catch () {
      return null
    }
  }
}
