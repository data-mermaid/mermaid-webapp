export const getObjectById = (arrayWithObjects, searchId) => {
  if (arrayWithObjects.length <= 0 || !searchId) {
    return undefined
  }

  return arrayWithObjects.find((object) => {
    const objectValueOrId = object.id || object.value

    return objectValueOrId === searchId
  })
}
