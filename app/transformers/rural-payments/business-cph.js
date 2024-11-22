export function transformOrganisationCPH (organisationId, data = []) {
  if (!organisationId) {
    return null
  }

  if (!data) {
    return null
  }

  return data.map(({ cphNumber, parcelNumbers }) => ({
    number: cphNumber,
    parcelNumbers
  }))
}

export function transformCPHInfo (cphNumber, list = [], info = {}) {
  if (!cphNumber) {
    return null
  }

  return {
    parish: info.parish,
    species: info.species,
    parcelNumbers: list.find((cph) => cph.cphNumber === cphNumber)?.parcelNumbers,
    number: cphNumber,
    startDate: parseInt(info.startDate) / 1000,
    expiryDate: parseInt(info.expiryDate) / 1000,
    coordinate: {
      y: info.yCoordinate,
      x: info.xCoordinate
    }
  }
}
