import { RESTDataSource } from '@apollo/datasource-rest'

export class Privileges extends RESTDataSource {
  baseURL = process.env.RP_INTERNAL_APIM_URL

  async getPrivileges() {
    this.logger.silly('Getting privileges')
    const privilegeData = await this.get('SitiAgriApi/authorisation/privilege')
    this.logger.silly('Siti Agri privileges', { privilegeData })

    return privilegeData
  }

  async parseBody(response) {
    if (response.ok) {
      const { data } = await response.json()
      return data.reduce(
        (prvilieges, { name, description }) => ({ ...prvilieges, [name]: description }),
        {}
      )
    }
  }

  cloneParsedBody(parsedBody) {
    return structuredClone(parsedBody)
  }
}
