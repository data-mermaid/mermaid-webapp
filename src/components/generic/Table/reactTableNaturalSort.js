export const reactTableNaturalSort = (rowA, rowB, columnId) => {
  return rowA.original[columnId].localeCompare(rowB.original[columnId], 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}
