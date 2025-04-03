import { graphql } from 'graphql'
import { context } from '../../app/graphql/context.js'
import { createSchema } from '../../app/graphql/schema.js'

export async function makeTestQuery(source, variableValues = {}) {
  return graphql({
    source,
    schema: await createSchema(),
    contextValue: {
      ...(await context({ request: { headers: { email: 'test@defra.gov.uk' } } })),
      auth: { groups: [process.env.ADMIN_AD_GROUP_ID] }
    },
    variableValues
  })
}
