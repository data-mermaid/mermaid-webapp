import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconCloseCircle, IconGfcr } from '../icons'
import language from '../../language'

const StyledGfcrCallout = styled('div')`
  padding: 10px;
  margin-bottom: 1em;
  background-color: #F9F9FB;
`

const buttonStyle = `
  display: flex;
  align-items: center;
  padding: 1rem;
`

const iconStyle = `
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  ${buttonStyle}
`

const StyledButtonSecondary = styled(ButtonSecondary)`
  ${buttonStyle}
`

const StyledIconCloseCircle = styled(IconCloseCircle)`
  ${iconStyle}
`

const StyledIconIconGfcr = styled(IconGfcr)`
  ${iconStyle}
`

const GfcrCallout = ({ isGfcr, handleUpdateIncludesGfcr }) => {
  return (
    <StyledGfcrCallout>
      <h3>{language.pages.projectInfo.gfcrCalloutHeading}</h3>
      {isGfcr
        ? <>
          <p>{language.pages.projectInfo.gfcrRemoveParagraph}</p>
          <StyledButtonSecondary type="button" onClick={() => handleUpdateIncludesGfcr(false)}>
            <StyledIconCloseCircle inline={true}/> {language.pages.projectInfo.gfcrRemoveButton}
          </StyledButtonSecondary>
        </>
        : <>
          <p>{language.pages.projectInfo.gfcrAddParagraph}</p>
          <StyledButtonPrimary type="button" onClick={() => handleUpdateIncludesGfcr(true)}>
            <StyledIconIconGfcr /> {language.pages.projectInfo.gfcrAddButton}
          </StyledButtonPrimary>
        </>
      }
    </StyledGfcrCallout>
  )
}

GfcrCallout.propTypes = {
  isGfcr: PropTypes.bool,
  handleUpdateIncludesGfcr: PropTypes.func.isRequired
}

GfcrCallout.defaultProps = {
  isGfcr: false
}

export default GfcrCallout
