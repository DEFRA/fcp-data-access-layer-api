import { RESTDataSource } from '@apollo/datasource-rest'
import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { Privileges } from '../../../app/data-sources/privilege/descriptions.js'

const logger = { error: jest.fn(), verbose: jest.fn(), silly: jest.fn() }
const data = {
  permssions: 'descriptions'
}

describe('privilege descriptions', () => {
  describe('getPrivileges', () => {
    const mockFetch = jest.spyOn(RESTDataSource.prototype, 'fetch')

    beforeEach(() => {
      mockFetch.mockReset()
    })
    afterAll(() => {
      mockFetch.mockRestore()
    })

    it('should return data fetched from upstream', async () => {
      mockFetch.mockResolvedValueOnce({ parsedBody: { data } })

      const descriptions = await new Privileges({ logger }).getPrivileges()
      expect(descriptions).toBe(data)
    })
  })
})
