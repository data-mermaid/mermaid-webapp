export const sortArrayByObjectKey = (arrayToSort, key, isAsc = true) => {
  const sorted = arrayToSort.sort((a, b) => {
    return a[key].toString().localeCompare(b[key], 'en', {
      numeric: true,
      caseFirst: 'upper',
    })
  })

  // Reverse array for descending sort
  if (!isAsc) { return sorted.reverse() }

  return sorted
}
