export const sortArray = (arrayToSort, isAsc = true) => {
  const sorted = arrayToSort.sort((a, b) => {
    return a.toString().localeCompare(b, 'en', {
      numeric: true,
      caseFirst: 'upper',
    })
  })

  // Reverse array for descending sort
  if (!isAsc) {
    return sorted.reverse()
  }

  return sorted
}
