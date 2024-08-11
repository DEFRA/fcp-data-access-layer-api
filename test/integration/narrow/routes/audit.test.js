import { DefaultAzureCredential } from '@azure/identity'
import hapi from '@hapi/hapi'
import { jest } from '@jest/globals'
import { server } from '../../../../app/server.js'

const mockToken = JSON.stringify({ token: JSON.stringify('authorised') })
const dummyResponse = JSON.stringify({ employeeId: 'test-id' })

describe('Audit test', () => {
  let fakeEntra
  beforeAll(async () => {
    jest.clearAllMocks()
    await server.start()
    fakeEntra = hapi.server({ port: 4004 }) // this must match the port in the env var!
    fakeEntra.route([
      {
        method: 'GET',
        path: '/v1.0/users/{id}',
        handler: (_, h) => {
          return h.response(dummyResponse).code(200)
        }
      }
    ])
    await fakeEntra.start()
  })

  it('GET /audit route returns 200', async () => {
    // NOTE: the mock only seems to work when setup here, NOT in the `before` step!!
    DefaultAzureCredential.prototype.getToken = jest.fn().mockResolvedValue(JSON.stringify(mockToken))

    const options = {
      method: 'GET',
      url: '/audit'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual(dummyResponse)
  })

  it('should fail if no credential flow is available', async () => {
    DefaultAzureCredential.prototype.getToken.mockRestore()

    const options = {
      method: 'GET',
      url: '/audit'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(500)
  })

  afterAll(async () => {
    await server.stop()
    await fakeEntra.stop()
  })
})
