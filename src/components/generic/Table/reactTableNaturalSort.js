export const reactTableNaturalSort = (rowA, rowB, columnId) => {
  return rowA.original[columnId]
    .toString()
    .localeCompare(rowB.original[columnId], 'en', {
      numeric: true,
      caseFirst: 'upper',
    })
}
