import React from 'react'

import { CheckBoxContainer } from '../generic/buttons'
import { useTranslation } from 'react-i18next'

interface IntervalCheckboxProps {
  isChecked: boolean
  handleChange: (checked: boolean) => void
}

const IntervalCheckbox: React.FC<IntervalCheckboxProps> = ({ isChecked, handleChange }) => {
  const { t } = useTranslation()

  return (
    <CheckBoxContainer>
      <input
        id="checkbox-sync"
        type="checkbox"
        checked={isChecked}
        onChange={(event) => handleChange(event.target.checked)}
        data-testid="interval-start-sync-checkbox"
      />
      <label htmlFor="checkbox-sync">{t('use_interval_size_as_start')}</label>
    </CheckBoxContainer>
  )
}

export default IntervalCheckbox
