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

const OfflineToggle = () => {
  const {
    isAppOnline,
    offlineToggleDisabledCondition,
    handleChangeFromOfflineToggle,
  } = useOnlineStatus()

  return (
    <ToggleWrapper>
      <Toggle
        id="offline-toggle-switch"
        aria-label="offline-toggle-switch"
        onChange={handleChangeFromOfflineToggle}
        checked={!isAppOnline}
        icons={false}
        disabled={offlineToggleDisabledCondition}
      />
    </ToggleWrapper>
  )
}

export default OfflineToggle
