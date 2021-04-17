const reactTableNaturalSort = (rowA, rowB, columnId) => {
  const rowACellContents = rowA.original[columnId] ?? ''
  const rowBCellContents = rowB.original[columnId] ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

const reactTableNaturalSortReactNodes = (rowA, rowB, columnId) => {
  // this sort is different, because the data values will be children of react nodes

  const rowACellContents = rowA.original[columnId].props.children ?? ''
  const rowBCellContents = rowB.original[columnId].props.children ?? ''

  return rowACellContents.localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

export { reactTableNaturalSort, reactTableNaturalSortReactNodes }
