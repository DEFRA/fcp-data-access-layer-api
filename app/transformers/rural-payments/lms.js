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
  if (!landCovers || !Array.isArray(landCovers)) {
    return 0
  }
  const landCover = landCovers.find((landCover) => landCover?.name === name)
  if (!landCover || !landCover.area) {
    return 0
  }
  return convertSquareMetersToHectares(landCover.area)
}

export function transformLandParcels(landParcels) {
  return landParcels.map((parcel) => {
    return {
      ...parcel,
      id: `${parcel.id}`, // Transform to string to match the type in the graphql schema
      area: convertSquareMetersToHectares(parcel.area)
    }
  })
}

export function transformTotalParcels(landParcels) {
  return landParcels.length
}

export function transformTotalArea(landCovers) {
  const totalMeterageArea = landCovers.reduce((totalArea, { area }) => totalArea + area, 0)
  return convertSquareMetersToHectares(totalMeterageArea)
}
