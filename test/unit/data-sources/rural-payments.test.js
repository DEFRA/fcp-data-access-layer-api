import { jest } from '@jest/globals'
import { RuralPayments } from '../../../app/data-sources/rural-payments/RuralPayments.js'
import { APIM_APIM_REQUEST_001, RURALPAYMENTS_API_REQUEST_001 } from '../../../app/logger/codes.js'

const logger = {
  error: jest.fn(),
  warn: jest.fn()
}

describe('RuralPayments', () => {
  test('handles RPP errors', () => {
    // eslint-disable-next-line no-new
    const rp = new RuralPayments({ logger })

    const error = new Error('test error')
    error.extensions = { response: { status: 400, headers: { get: () => 'text/html' } } }
    const request = {}
    const url = 'test url'

    rp.didEncounterError(error, request, url)

    expect(logger.error).toHaveBeenCalledWith('#datasource - Rural payments - request error', {
      error,
      request,
      response: error.extensions.response,
      code: RURALPAYMENTS_API_REQUEST_001
    })
  })

  test('handles APIM errors with error.extensions', () => {
    // eslint-disable-next-line no-new
    const rp = new RuralPayments({ logger })

    const error = new Error('test error')
    error.extensions = { response: { status: 400 } }
    const request = {}
    const url = 'test url'

    rp.didEncounterError(error, request, url)

    expect(logger.error).toHaveBeenCalledWith('#datasource - apim - request error', {
      error,
      request,
      response: error.extensions.response,
      code: APIM_APIM_REQUEST_001
    })
  })

  test('handles APIM errors without error.extensions', () => {
    // eslint-disable-next-line no-new
    const rp = new RuralPayments({ logger })

    const error = new Error('test error')
    const request = {}
    const url = 'test url'

    rp.didEncounterError(error, request, url)

    expect(logger.error).toHaveBeenCalledWith('#datasource - apim - request error', {
      error,
      request,
      response: error?.extensions?.response,
      code: APIM_APIM_REQUEST_001
    })
  })
})
