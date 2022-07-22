export const getObjectById = (arrayWithObjects, searchId) => {
  if (!arrayWithObjects || !searchId) {
    return undefined
  }

  return arrayWithObjects.find((object) => {
    const objectValueOrId = object.id || object.value

    return objectValueOrId === searchId
  })
}
