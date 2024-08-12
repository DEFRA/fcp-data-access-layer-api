import { DefaultAzureCredential } from '@azure/identity'
import hapi from '@hapi/hapi'
import { jest } from '@jest/globals'
import EntraGraphQL from '../../../../../../app/data-sources/entra-id/EntraGraphQL'

const mockToken = JSON.stringify({ token: JSON.stringify('authorised') })
const employeeId = 'test-id'
const userId = 'some-user-id'
const missingId = 'object-id-with-missing-employee-id'

describe('EntraGraphQL test - lookupEmployeeID', () => {
  let fakeEntra

  beforeAll(async () => {
    jest.clearAllMocks()
    fakeEntra = hapi.server({ port: 4004 }) // this must match the port in the env var!
    fakeEntra.route([
      {
        method: 'GET',
        path: '/v1.0/users/{id}',
        handler: (request, h) => {
          if (request.params.id === missingId) return h.response(JSON.stringify({ employeeId: null })).code(200)

          return h.response(JSON.stringify({ employeeId })).code(200)
        }
      }
    ])
    await fakeEntra.start()
  })

  it('returns the employee ID from the user object ID', async () => {
    // NOTE: the mock must be set in each test (because jest options), NOT in a `before` step!!
    DefaultAzureCredential.prototype.getToken = jest.fn().mockResolvedValue(JSON.stringify(mockToken))

    expect(await EntraGraphQL.lookupEmployeeID(userId)).toEqual(employeeId)
  })

  it('should fail with an appropriate warning if the Entra ID record is missing the detail', async () => {
    DefaultAzureCredential.prototype.getToken = jest.fn().mockResolvedValue(JSON.stringify(mockToken))

    await expect(() => EntraGraphQL.lookupEmployeeID(missingId)).rejects.toEqual(new Error('Missing employee ID for user: ' + missingId))
  })

  it('should fail if no credential flow is available', async () => {
    await expect(() => EntraGraphQL.lookupEmployeeID(userId)).rejects.toEqual(
      new Error('Could not get the employee ID for the user: ' + userId)
    )
  })

  afterAll(async () => {
    await fakeEntra.stop()
  })
})
