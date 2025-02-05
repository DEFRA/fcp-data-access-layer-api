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
      // NOTE: overriding `RESTDataSource.fetch` to skip `parseBody` and other request/response handling
      mockFetch.mockResolvedValueOnce({ parsedBody: data })

      const descriptions = await new Privileges({ logger }).getPrivileges()
      expect(descriptions).toBe(data)
    })
  })

  describe('parseBody', () => {
    const createResponse = (data) => ({ ok: true, json: async () => Promise.resolve({ data }) })
    const fixture = [
      {
        name: 'NO ACCESS - CS APP - SA',
        description: 'P2 DEFAULT ROLE WITH NO ACCESS TO CS - NO FUNCTIONS ATTACHED TO IT',
        group: null
      },
      {
        name: 'VIEW - CS APP - SA',
        description: 'P2 Applications View Role, providing read-only access to CS applications',
        group: null
      },
      {
        name: 'AMEND - CS APP - SA',
        description:
          'P2 Applications Ammend Role, providing access only for ammending to CS applications',
        group: null
      },
      {
        name: 'SUBMIT - CS APP - SA',
        description: 'P2 Applications Submit Role, providing full access to CS applications',
        group: null
      }
    ]

    it('should return privilege data as an object with name-keys and description-values', async () => {
      expect(await new Privileges({ logger }).parseBody(createResponse(fixture))).toEqual({
        'NO ACCESS - CS APP - SA':
          'P2 DEFAULT ROLE WITH NO ACCESS TO CS - NO FUNCTIONS ATTACHED TO IT',
        'VIEW - CS APP - SA':
          'P2 Applications View Role, providing read-only access to CS applications',
        'AMEND - CS APP - SA':
          'P2 Applications Ammend Role, providing access only for ammending to CS applications',
        'SUBMIT - CS APP - SA':
          'P2 Applications Submit Role, providing full access to CS applications'
      })
    })
  })
})
