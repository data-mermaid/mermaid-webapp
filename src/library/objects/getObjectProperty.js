const getObjectProperty = ({ object, path }) => {
  // this returns a new object and leaves the original untouched

  if (!object || !path) {
    throw new Error('getObjectProperty requires parameters for object and path')
  }
  const properties = path.split('.')
  const propertiesLength = properties.length
  const propertyToGet = properties[propertiesLength - 1]

  let objectReference = object // remember, referential equality in JS. This is a pointer to a property of newObject or newObject itself

  // update objectReference to each property until one before end
  for (let index = 0; index < propertiesLength - 1; index++) {
    const property = properties[index]

    if (!objectReference[property]) {
      return undefined
    }
    objectReference = objectReference[property]
  }

  return objectReference[propertyToGet]
}

export default getObjectProperty
