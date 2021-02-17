import PropTypes from 'prop-types'
import raw from 'raw.macro'
import React from 'react'
import styled from 'styled-components/macro'
import Toggle from 'react-toggle'

const ToggleCss = raw('react-toggle/style.css')

const ToggleWrapper = styled.div`
  ${ToggleCss}
  & .react-toggle--checked .react-toggle-track {
    background-color: red;
  }
  .react-toggle--checked .react-toggle-thumb {
    border-color: red;
  }
  .react-toggle--checked:hover:not(.react-toggle--disabled)
    .react-toggle-track {
    background-color: darkred;
  }
`

const OfflineToggle = ({ onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.checked)
  }

  return (
    <ToggleWrapper>
      <Toggle
        onChange={handleChange}
        aria-label="offline-toggle-switch"
        icons={false}
      />
    </ToggleWrapper>
  )
}

OfflineToggle.propTypes = { onChange: PropTypes.func }
OfflineToggle.defaultProps = { onChange: () => {} }

export default OfflineToggle
