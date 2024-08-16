import { jest } from '@jest/globals'
import { EntraIdApi } from '../app/data-sources/entra-id/EntraIdApi.js'

global.jest = jest

const { context } = await import('../app/graphql/context.js')
const contextObject = await context({})

export const fakeContext = {
  ...contextObject,
  dataSources: {
    ...contextObject.dataSources,
    authenticateDatabase: {
      getAuthenticateQuestionsAnswersByCRN: jest.fn()
    },
    entraIdApi: new EntraIdApi({
      async getToken () { return 'mockToken' },
      baseURL: `http://127.0.0.1:${process.env.PORT_MOCK}/entra-id/`
    })
  },
  authorize: { checkAuthGroup: () => [process.env.ADMIN] }
}
