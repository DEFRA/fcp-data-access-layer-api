import { authenticateAnswers } from '../../fixtures/authenticate.js'
import { okOrNotFoundResponse } from '../../utils/requestResponse.js'

export default [
{
    id: 'rural-payments-authenticate-get-by-crn',
    url: '/external-auth/security-answers/:crn',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const crn = req.params.crn
            const data = authenticateAnswers( crn )
            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  }
]
