import { createRequire } from 'node:module'

const permissionGroups = createRequire(import.meta.url)('./permission-groups.json')
const permissions = Object.fromEntries(
  permissionGroups.flatMap((group) =>
    group.permissions.flatMap((permission) =>
      permission.privilegeNames.map((name) => [
        name,
        {
          id: group.id,
          ...permission,
          name
        }
      ])
    )
  )
)

export class Permissions {
  logger = null

  constructor(config = {}) {
    this.logger = config.logger
  }

  getPermissionGroups() {
    return permissionGroups
  }

  getPermissionByName(name) {
    return permissions[name]
  }
}
