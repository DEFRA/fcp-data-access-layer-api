import hapi from '@hapi/hapi'

import { healthyRoute } from './routes/healthy.js'
import { healthzRoute } from './routes/healthz.js'
import { auditRoute } from './routes/audit.js'
import { setupAppInsights } from './insights.js'

setupAppInsights()

export const server = hapi.server({
  port: process.env.PORT
})

const routes = [].concat(healthyRoute, healthzRoute, auditRoute)

server.route(routes)
