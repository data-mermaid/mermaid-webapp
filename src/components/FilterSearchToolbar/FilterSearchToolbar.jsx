import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import domPurify from 'dompurify'
import { Input, inputStyles } from '../generic/form'
import LabelWithTooltip from '../ColumnHeaderToolTip/LabelWithTooltip'
import theme from '../../theme'

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-grow: 0.5;
  flex-direction: column;
  justify-content: flex-end;
`

const FilterInput = styled(Input)`
  ${inputStyles};
  background-color: ${(props) =>
    props.$hasFilter ? theme.color.getMessageColorBackground('warning') : 'transparent'};

  &:autofill {
    background-color: ${(props) =>
      props.$hasFilter ? theme.color.getMessageColorBackground('warning') : 'transparent'};
  }
`

const FilterSearchToolbar = ({
  id = 'filter-search',
  name,
  disabled = false,
  globalSearchText = '', // react-table sets globalFilter to undefined when cleared; default to '' to keep the input controlled
  handleGlobalFilterChange,
  groupRef = null,
}) => {
  const { t } = useTranslation()

  const handleFilterChange = (event) => {
    handleGlobalFilterChange(event.target.value)
  }

  /* eslint-disable react/no-danger */
  const tooltipTitle = (
    <span
      dangerouslySetInnerHTML={{ __html: domPurify.sanitize(t('filters.search_helper_text')) }}
    />
  )
  /* eslint-enable react/no-danger */

  return (
    <FilterLabelWrapper htmlFor={id}>
      <LabelWithTooltip label={name} tooltipText={tooltipTitle} groupRef={groupRef} />
      <FilterInput
        type="text"
        id={id}
        value={globalSearchText}
        onChange={handleFilterChange}
        disabled={disabled}
        $hasFilter={globalSearchText && globalSearchText.length > 0}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  globalSearchText: PropTypes.string,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  groupRef: PropTypes.shape({
    current: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  }),
}

export default FilterSearchToolbar
