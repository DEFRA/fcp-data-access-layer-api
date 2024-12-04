export function transformLandCovers(landCover) {
  const items = landCover?.features || []
  return items
    .filter((item) => item?.properties?.area !== '0')
    .map(({ id, properties }) => {
      const { code, area, name, isBpsEligible } = properties
      return {
        id,
        code,
        area: parseFloat(area),
        name: name.toUpperCase().split(' ').join('_'),
        isBpsEligible: isBpsEligible === 'true'
      }
    })
}

export function transformLandParcelsEffectiveDates(parcelId, sheetId, parcels) {
  const parcel = parcels.find(
    (parcel) => parcel.parcelId === parcelId && parcel.sheetId === sheetId
  )

  return {
    effectiveFrom: parcel?.validFrom,
    effectiveTo: parcel?.validTo
  }
}

export function transformLandCoversToArea(name, landCovers) {
  const { area } = landCovers.find((landCover) => landCover.name === name)
  return area
}

export function transformLandParcelsWithGeometry(landParcels) {
  const { features } = landParcels
  return features.map((parcel) => {
    return {
      id: String(parcel.id),
      parcelId: parcel.properties.parcelId,
      sheetId: parcel.properties.sheetId,
      area: parseFloat(parcel.properties.area),
      pendingDigitisation: parcel.properties.pendingDigitisation === 'true'
    }
  })
}

export function transformTotalParcels(landParcels) {
  return new Set(landParcels.map((parcel) => parcel.id)).size
}

export function transformTotalArea(landCovers) {
  return landCovers.reduce((totalArea, { area }) => totalArea + area, 0)
}
