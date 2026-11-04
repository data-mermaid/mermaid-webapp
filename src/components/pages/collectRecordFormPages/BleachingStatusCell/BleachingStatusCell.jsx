import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { getBleachingStatusOptions } from '../../../../library/bleachingStatus'
import { Select } from '../../../generic/form'
import { Td } from '../../../generic/Table/table'

// A coral observation offers the five statuses and never a blank. Any other observation is not
// assessed for bleaching: it shows NA and cannot be changed.
const BleachingStatusCell = ({ bleachingStatus, isCoral, onChange, onKeyDown }) => {
  const { t } = useTranslation()

  return (
    <Td $align="right">
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
  isCoral: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
}

export default BleachingStatusCell
