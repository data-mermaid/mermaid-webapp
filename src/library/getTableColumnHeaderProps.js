import i18next from 'i18next'

export const getTableColumnHeaderProps = (column) => {
  let sortByTitle = i18next.t('sort_ascending')

  if (column.isSortedDesc === true) {
    sortByTitle = i18next.t('remove_sort')
  } else if (column.isSortedDesc === false) {
    sortByTitle = i18next.t('sort_descending')
  }

  return column.getSortByToggleProps({ title: sortByTitle })
}
