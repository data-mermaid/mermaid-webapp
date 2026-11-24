import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { getBleachingStatusOptions } from '../../../../library/bleachingStatus'
import { Select } from '../../../generic/form'
import { Td } from '../../../generic/Table/table'

const BleachingStatusCell = ({ bleachingStatus, cellMarkProps, isCoral, onChange, onKeyDown }) => {
  const { t } = useTranslation()

  return (
    <Td {...cellMarkProps} $align="right">
      {isCoral ? (
        <Select
          aria-labelledby="bleaching-label"
          data-testid="bleaching-status-select"
          value={bleachingStatus ?? ''}
          onChange={onChange}
          onKeyDown={onKeyDown}
        >
          {getBleachingStatusOptions(t).map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      ) : (
        <Select aria-labelledby="bleaching-label" data-testid="bleaching-status-select" disabled>
          <option>{t('bleaching_status.na')}</option>
        </Select>
      )}
    </Td>
  )
}

BleachingStatusCell.propTypes = {
  bleachingStatus: PropTypes.number,
  cellMarkProps: PropTypes.shape({ 'data-validation-mark': PropTypes.string }).isRequired,
  isCoral: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
}

export default BleachingStatusCell
