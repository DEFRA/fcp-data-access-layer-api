/*
 *
 * Levels:
 * error: // Used for errors that prevent the application from operating correctly
 * warn: // Used for errors that do not prevent the application from operating correctly, but may cause issues
 * info: // Application access logs
 * http: // Third party response logs without body
 * verbose: // Third party access logs
 * debug: // Third party response logs with body
 * silly: // Detailed function logs
 */

import { createLogger, format, transports } from 'winston'
import { AzureEventHubTransport } from './AzureEventHubTransport.js'
import { jsonStringify } from './utils.js'
import { redactSensitiveData, sampleResponseBodyData } from './winstonFormatters.js'

const transportTypes = []
// If AppInsights is enabled, means we are running in Azure, format logs for AppInsights
if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
  transportTypes.push(
    new transports.Console({
      format: format.combine(sampleResponseBodyData(), redactSensitiveData(), format.json())
    })
  )
} else {
  // if AppInsights is not enabled, send logs to console
  transportTypes.push(
    new transports.Console({
      format: format.combine(
        sampleResponseBodyData(),
        redactSensitiveData(),
        format.align(),
        format.colorize(),
        format.printf(
          (info) =>
            `${info.level}: ${info.message}${
              Object.keys(info).length > 2 ? `\n${jsonStringify(info)}` : ''
            }`
        )
      )
    })
  )
}

if (process.env.EVENT_HUB_DISABLED !== 'true') {
  transportTypes.push(
    new AzureEventHubTransport({
      connectionString: process.env.EVENT_HUB_CONNECTION_STRING,
      eventHubName: process.env.EVENT_HUB_NAME
    })
  )
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: transportTypes
})

process.on('exit', () => {
  logger.transports.forEach((transport) => {
    if (typeof transport.close === 'function') {
      transport.close()
    }
  })
})
