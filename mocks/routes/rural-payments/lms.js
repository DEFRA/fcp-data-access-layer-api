import { coversSummary, landCover, landCovers, landParcels, landParcelsGeometry } from '../../fixtures/lms.js'
import { badRequestResponse, okOrNotFoundResponse } from '../../utils/requestResponse.js'

export default [
  {
    id: 'rural-payments-lms-get-land-covers',
    url: '/v1/lms/organisation/:orgId/land-covers',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const orgId = req.params.orgId
            const data = landCovers(orgId)

            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  },
  {
    id: 'rural-payments-lms-get-parcels',
    url: '/v1/lms/organisation/:orgId/parcels',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const orgId = req.params.orgId
            const data = landParcels(orgId)

            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  },
  {
    id: 'rural-payments-lms-get-covers-summary',
    url: '/v1/lms/organisation/:orgId/covers-summary/historic/:historicDate',
    method: 'GET',
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const orgId = req.params.orgId
            const data = coversSummary(orgId)

            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  },
  {
    id: 'rural-payments-lms-get-parcels-geometry',
    url: '/v1/lms/organisation/:orgId/geometries',
    method: 'GET',
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const bbox = req.query.bbox
            if (!bbox) {
              return badRequestResponse(res)
            }

            const historicDate = req.query.historicDate
            if (!historicDate) {
              return badRequestResponse(res)
            }

            if (parseInt(historicDate.substring(4, 8)) < 2020) {
              return okOrNotFoundResponse(res, { type: 'FeatureCollection', features: [] })
            }

            const orgId = req.params.orgId
            const data = landParcelsGeometry(orgId)

            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  },{
    id: 'rural-payments-lms-get-land-covers-by-sheet-id-and-parcel-id',
    url: '/v1/lms/organisation/:orgId/parcel/sheet-id/:sheetId/parcel-id/:parcelId/land-covers',
    method: ['GET'],
    variants: [
      {
        id: 'default',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const {orgId, sheetId, parcelId} = req.params
            const data = landCover(orgId, sheetId, parcelId)

            return okOrNotFoundResponse(res, data)
          }
        }
      }
    ]
  },
]
