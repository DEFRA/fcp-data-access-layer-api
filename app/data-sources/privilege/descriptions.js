import { RESTDataSource } from '@apollo/datasource-rest'

export class Privileges extends RESTDataSource {
  baseURL = process.env.RP_INTERNAL_APIM_URL

  async getPrivileges() {
    this.logger.silly('Getting privileges')
    const privilegeData = await this.get('SitiAgriApi/authorisation/privilege')
    this.logger.silly('Siti Agri privileges', { privilegeData })

    return privilegeData.data
  }
}
