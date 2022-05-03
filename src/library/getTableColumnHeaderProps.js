import language from '../language'

export const getTableColumnHeaderProps = (column) => {
  const getSortByToggleTitle = (isSortedDesc) =>
    ({
      undefined: language.table.sortAscendingTitle,
      true: language.table.sortRemoveTitle,
      false: language.table.sortDescendingTitle,
    }[isSortedDesc])

  return column.getSortByToggleProps({ title: getSortByToggleTitle(column.isSortedDesc) })
}
