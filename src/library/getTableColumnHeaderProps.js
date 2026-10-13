import i18next from '../../i18n'

export const getTableColumnHeaderProps = (column) => {
  // react-table only defaults `title` for sortable columns, but the title we pass below is
  // applied last and overrides that, so a column with no accessor would otherwise advertise a
  // sort it cannot do. Bail out first so the tooltip matches the sort arrow - see M2076.
  if (!column.canSort) {
    return column.getSortByToggleProps()
  }

  let sortByTitle = i18next.t('sort_ascending')

  if (column.isSortedDesc === true) {
    sortByTitle = i18next.t('remove_sort')
  } else if (column.isSortedDesc === false) {
    sortByTitle = i18next.t('sort_descending')
  }

  return column.getSortByToggleProps({ title: sortByTitle })
}
