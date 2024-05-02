const setObjectPropertyOnClone = ({ object, path, value }) => {
  // this returns a new object and leaves the original untouched

  if (!object || !path) {
    throw new Error('setObjectPropertyOnClone requires parameters for object and path')
  }
  const properties = path.split('.')
  const propertiesLength = properties.length
  const propertyToSet = properties[propertiesLength - 1]

  const newObject = { ...object }

  let objectReference = newObject // remember, referential equality in JS. This is a pointer to a property of newObject or newObject itself

  // update objectReference to each property until one before end
  for (let index = 0; index < propertiesLength - 1; index++) {
    const property = properties[index]

    if (!objectReference[property]) {
      objectReference[property] = {}
    }
    objectReference = objectReference[property]
  }

  objectReference[propertyToSet] = value

  return newObject
}

export default setObjectPropertyOnClone
