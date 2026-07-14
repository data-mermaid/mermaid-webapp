import React, { useState, useEffect } from 'react'
import { Select } from '../../form'
import { useTranslation } from 'react-i18next'
import styles from './PageSizeSelector.module.scss'

type PageType = 'sample_unit' | 'record' | 'site' | 'user' | 'management_regime'

interface PageSizeSelectorProps {
  pageSize: number
  pageType: PageType
  pageSizeOptions: number[]
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  unfilteredRowLength: number
  methodFilteredRowLength?: number | null
  searchFilteredRowLength?: number | null
  isMethodFilterEnabled?: boolean
  isSearchFilterEnabled?: boolean
}

const PageSizeSelector = ({
  pageSize,
  pageType,
  pageSizeOptions,
  onChange,
  unfilteredRowLength,
  methodFilteredRowLength = null,
  searchFilteredRowLength = null,
  isMethodFilterEnabled = false,
  isSearchFilterEnabled = false,
}: PageSizeSelectorProps) => {
  const { t } = useTranslation()
  const [pageOptionsToDisplay, setPageOptionsToDisplay] = useState<number[]>([])
  const [filteredAmountToDisplay, setFilteredAmountToDisplay] = useState<number | null>(null)

  const _findFilteredAmountToDisplay = useEffect(() => {
    // the search results will be method filtered already, which is not the case the opposite way around
    if (isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }
    if (!isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(methodFilteredRowLength)
    }
    if (isSearchFilterEnabled && !isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }

    return setFilteredAmountToDisplay(unfilteredRowLength)
  }, [
    isMethodFilterEnabled,
    isSearchFilterEnabled,
    methodFilteredRowLength,
    searchFilteredRowLength,
    unfilteredRowLength,
  ])

  const _findPageOptionsToDisplay = useEffect(() => {
    let pageOptionsLessThanRowLength = pageSizeOptions.filter(
      (option) => option < filteredAmountToDisplay,
    )

    if (pageOptionsLessThanRowLength.length === 0) {
      // show the exact number of items as the only selection in the drop down
      pageOptionsLessThanRowLength = [filteredAmountToDisplay]
    } else if (
      pageOptionsLessThanRowLength[pageOptionsLessThanRowLength.length - 1] <
      filteredAmountToDisplay
    ) {
      // show the exact number of items as the last selection in the drop down
      pageOptionsLessThanRowLength.push(filteredAmountToDisplay)
    }

    setPageOptionsToDisplay(pageOptionsLessThanRowLength)
  }, [pageSizeOptions, filteredAmountToDisplay])

  const isFilterEnabled = isSearchFilterEnabled || isMethodFilterEnabled

  return (
    <label htmlFor="page-size-selector">
      {t('page_size_selector.showing')}{' '}
      <Select
        className={styles['page-size-select']}
        value={pageSize}
        onChange={onChange}
        id="page-size-selector"
        data-testid="page-size-selector"
      >
        {pageOptionsToDisplay.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
      {t('page_size_selector.of_total', { total: filteredAmountToDisplay })}
      {isFilterEnabled
        ? ` ${t('page_size_selector.filtered_from', {
            count: unfilteredRowLength,
            itemType: t(`page_size_selector.item_type.${pageType}`, {
              count: unfilteredRowLength,
            }),
          })}`
        : null}
    </label>
  )
}

export default PageSizeSelector
