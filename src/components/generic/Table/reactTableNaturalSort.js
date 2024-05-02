const reactTableNaturalSort = (rowA, rowB, columnId) => {
  const rowACellContents = rowA?.original[columnId] ?? ''
  const rowBCellContents = rowB?.original[columnId] ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

const reactTableNaturalSortReactNodes = (rowA, rowB, columnId) => {
  // this sort is different, because the data values will be children of react nodes

  const rowACellContents = rowA?.original[columnId].props.children ?? ''
  const rowBCellContents = rowB?.original[columnId].props.children ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

const reactTableNaturalSortReactNodesSecondChild = (rowA, rowB, columnId) => {
  // this sort is similar to reactTableNaturalSortReactNodes,
  // but it gets the second element of the children array

  const rowACellContents = rowA?.original[columnId].props.children[1] ?? ''
  const rowBCellContents = rowB?.original[columnId].props.children[1] ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

const reactTableNaturalSortDates = (rowA, rowB, columnId) => {
  const rowACellContents = Date.parse(rowA?.original[columnId]) ?? ''
  const rowBCellContents = Date.parse(rowB?.original[columnId]) ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
  })
}

export {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortReactNodesSecondChild,
  reactTableNaturalSortDates,
}
