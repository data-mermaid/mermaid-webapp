import React, { useState } from 'react'
import Switch from 'react-switch'
import PropTypes from 'prop-types'

/**
 * Describe your component
 */

const OfflineToggle = ({ onChange }) => {
  const [checked, setChecked] = useState(false)

  const handleChange = (value) => {
    setChecked(value)
    onChange(value)
  }

  return (
    <Switch
      id="offline-toggle-switch"
      aria-label="offline-toggle-switch"
      onChange={handleChange}
      checked={checked}
      onColor="#CC0A00"
      height={16}
      width={32}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      uncheckedIcon={false}
    />
  )
}

OfflineToggle.propTypes = { onChange: PropTypes.func }
OfflineToggle.defaultProps = { onChange: () => {} }

export default OfflineToggle
