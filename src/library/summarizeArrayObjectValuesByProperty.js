export const summarizeArrayObjectValuesByProperty = (arrayOfObjects, objectPropertyName) => {
  const summaryReducer = (accumulator, object) => {
    const property = object[objectPropertyName] ? parseFloat(object[objectPropertyName]) : 0

    return accumulator + property
  }

  return arrayOfObjects.reduce(summaryReducer, 0)
}
