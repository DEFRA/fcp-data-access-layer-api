import { jest } from '@jest/globals'

const objectId = 'object-id'
const employeeId = 'employee-id'
jest.mock('../../../app/data-sources/entra-id/EntraGraphQL', () => ({
  __esModule: true,
  default: { lookupEmployeeID: jest.fn() }
}))

import EmployeeIdCache from '../../../app/data-sources/entra-id/EmployeeIdCache'
import EntraGraphQL from '../../../app/data-sources/entra-id/EntraGraphQL'

describe('EmployeeIdCache test - getEmployeeId', () => {
  it('returns the employee ID after an object ID lookup when not in the cache', async () => {
    EntraGraphQL.lookupEmployeeID = jest.fn().mockResolvedValue(employeeId)

    expect(await EmployeeIdCache.getEmployeeId(objectId)).toEqual(employeeId)
    expect(EntraGraphQL.lookupEmployeeID).toHaveBeenCalledTimes(1)
  })

  it('returns the employee ID immediately when object ID already in the cache', async () => {
    EntraGraphQL.lookupEmployeeID = jest.fn().mockResolvedValue(employeeId)
    // NOTE: this extra call to getEmployeeId ensures the cache contains the entry if running this test in isolation
    await EmployeeIdCache.getEmployeeId(objectId)
    EntraGraphQL.lookupEmployeeID.mockClear()

    expect(await EmployeeIdCache.getEmployeeId(objectId)).toEqual(employeeId)
    expect(EntraGraphQL.lookupEmployeeID).not.toHaveBeenCalled()
  })
})
