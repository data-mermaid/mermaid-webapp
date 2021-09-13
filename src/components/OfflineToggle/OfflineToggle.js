import PropTypes from 'prop-types'
import raw from 'raw.macro'
import React from 'react'
import styled from 'styled-components/macro'
import Toggle from 'react-toggle'
import theme from '../../theme'
import { useOnlineStatus } from '../../library/onlineStatusContext'

const ToggleCss = raw('react-toggle/style.css')

const ToggleWrapper = styled.div`
  ${ToggleCss}
  display: inline-block;
  // weighted alignment adjustment
  position: relative;
  top: 3px;
  //
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
    background-color: ${theme.color.cautionColor};
  }
  .react-toggle--checked .react-toggle-thumb {
    left: 16px;
    border-color: ${theme.color.cautionColor};
  }
  .react-toggle--checked:hover:not(.react-toggle--disabled)
    .react-toggle-track {
    background-color: ${theme.color.cautionHover};
  }
`

const OfflineToggle = ({ offlineToggleState, handleToggleChange }) => {
  const { ping, stopPing, pingState, isWifiOn } = useOnlineStatus()
  const disabledToggleConditions =
    pingState === false || (pingState === null && !isWifiOn)

  const handleChange = (event) => {
    const checkedValue = event.target.checked

    handleToggleChange(checkedValue)
    if (checkedValue) {
      localStorage.setItem('offline-toggle', true)
      stopPing()
    } else {
      localStorage.removeItem('offline-toggle')
      ping()
    }
  }

  return (
    <ToggleWrapper>
      <Toggle
        id="offline-toggle-switch"
        aria-label="offline-toggle-switch"
        checked={offlineToggleState}
        onChange={handleChange}
        icons={false}
        disabled={disabledToggleConditions}
      />
    </ToggleWrapper>
  )
}

OfflineToggle.propTypes = {
  offlineToggleState: PropTypes.bool.isRequired,
  handleToggleChange: PropTypes.func.isRequired,
}

export default OfflineToggle
