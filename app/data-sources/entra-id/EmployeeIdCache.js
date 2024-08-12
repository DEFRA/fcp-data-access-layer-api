import EntraGraphQL from './EntraGraphQL'

const cache = {}

export default {
  getEmployeeId: async objectId => {
    return cache[objectId] || (cache[objectId] = await EntraGraphQL.lookupEmployeeID(objectId))
  }
}
