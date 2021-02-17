import PropTypes from 'prop-types'
import raw from 'raw.macro'
import React from 'react'
import styled from 'styled-components/macro'
import Toggle from 'react-toggle'

const ToggleCss = raw('react-toggle/style.css')

const ToggleWrapper = styled.div`
  ${ToggleCss}
  & .react-toggle-track {
    height: 16px;
    width: 32px;
  }
  .react-toggle-thumb {
    top: 0px;
    left: 0px;
    height: 16px;
    width: 16px;
  }
  .react-toggle--checked .react-toggle-track {
    background-color: red;
  }
  .react-toggle--checked .react-toggle-thumb {
    left: 16px;
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
        id="offline-toggle-switch"
        aria-label="offline-toggle-switch"
        onChange={handleChange}
        icons={false}
      />
    </ToggleWrapper>
  )
}

OfflineToggle.propTypes = { onChange: PropTypes.func }
OfflineToggle.defaultProps = { onChange: () => {} }

export default OfflineToggle
