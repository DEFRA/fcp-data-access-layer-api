import { describe, expect, it } from '@jest/globals'
import { Permissions } from '../../../../app/data-sources/static/permissions.js'

describe('Permissions', () => {
  describe('getPermissionGroups', () => {
    it('returns the JSON blob', () => {
      const permissions = new Permissions().getPermissionGroups()
      expect(permissions).toBeInstanceOf(Array)
      expect(permissions).toHaveLength(7)
    })
  })

  describe('getPermissionByName', () => {
    const permissions = new Permissions()
    expect(permissions.getPermissionByName('AMEND - BPS - SA')).toEqual({
      id: 'BASIC_PAYMENT_SCHEME',
      level: 'AMEND',
      functions: [
        'All permissions in View BPS',
        'Create and edit a claim',
        'Amend a previously submitted claim',
        'Amend land, features and covers'
      ],
      name: 'AMEND - BPS - SA',
      privilegeNames: ['AMEND - BPS - SA', 'Amend - bps']
    })
  })
})
