import { convertSquareMetersToHectares } from '../../utils/numbers.js'

export function transformLandCovers(landCover) {
  const items = landCover?.features || []
  return items
    .filter((item) => item?.properties?.area !== '0')
    .map(({ id, properties }) => {
      const { code, area, name, isBpsEligible } = properties
      return {
        id,
        code,
        area: convertSquareMetersToHectares(area),
        name: name.toUpperCase().split(' ').join('_'),
        isBpsEligible: isBpsEligible === 'true'
      }
    })
}

export function transformLandParcelsEffectiveDates(parcelId, sheetId, parcels) {
  const parcel = parcels.find((p) => p.parcelId === parcelId && p.sheetId === sheetId)

  return {
    effectiveFrom: parcel?.validFrom,
    effectiveTo: parcel?.validTo
  }
}

export function transformLandCoversToArea(name, landCovers) {
  const { area } = landCovers.find((landCover) => landCover.name === name)
  return convertSquareMetersToHectares(area)
}

export function transformLandParcelsWithGeometry(landParcels) {
  const { features } = landParcels
  return features.map((parcel) => {
    return {
      id: String(parcel.id),
      parcelId: parcel.properties.parcelId,
      sheetId: parcel.properties.sheetId,
      area: convertSquareMetersToHectares(parcel.properties.area),
      pendingDigitisation: parcel.properties.pendingDigitisation === 'true'
    }
  })
}

export function transformTotalParcels(landParcels) {
  const { features } = landParcels
  return new Set(features.map((parcel) => String(parcel.id))).size
}

export function transformTotalArea(landCovers) {
  const totalMeterageArea = landCovers.reduce((totalArea, { area }) => totalArea + area, 0)
  return convertSquareMetersToHectares(totalMeterageArea)
}
