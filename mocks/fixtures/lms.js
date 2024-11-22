import files from '../utils/files.js'

const { getJSON } = files(import.meta.url)

export const coversSummary = (orgId) => {
  return getJSON(`./orgId/${orgId}/covers-summary.json`)
}

export const landCovers = (orgId) => {
  return getJSON(`./orgId/${orgId}/land-covers.json`)
}

export const landCover = (orgId, _sheetId, parcelId) => {
  const covers = landCovers(orgId)
  return covers.find((cover) => cover.id.includes(parcelId))
}

export const landParcels = (orgId) => {
  return getJSON(`./orgId/${orgId}/land-parcels.json`)
}

export const landParcelsGeometry = (orgId) => {
  return getJSON(`./orgId/${orgId}/land-parcels-geometry.json`)
}
