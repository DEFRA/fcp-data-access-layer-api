export function transformLandCovers(landCover) {
  return landCover?.info
    .filter((item) => item.area !== 0)
    .map(({ code, area, name }) => {
      return {
        id: landCover.id,
        code,
        area,
        name: name.toUpperCase().split(' ').join('_')
      }
    })
}

export function transformLandParcelsEffectiveDates(parcelId, sheetId, parcels) {
  const parcel = parcels.find((parcel) => parcel.parcelId === parcelId && parcel.sheetId === sheetId)

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
