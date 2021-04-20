export const reactTableNaturalSort = (rowA, rowB, columnId) => {
  const rowACellContents = rowA.original[columnId] ?? ''
  const rowBCellContents = rowB.original[columnId] ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}
