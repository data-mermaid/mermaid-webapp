export const getObjectById = (arrayWithObjects, searchId) => {
  if (arrayWithObjects.length <= 0 || !searchId) {
    return undefined
  }

  return arrayWithObjects.find((object) => object.id === searchId)
}
