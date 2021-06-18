export const getObjectById = (arrayWithObjects, searchId) =>
  arrayWithObjects.find((object) => object.id === searchId)
