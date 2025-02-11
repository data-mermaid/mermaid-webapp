import PropTypes from 'prop-types'
import React from 'react'

import { ClearTagButton, TagStyle, TagStyleWrapper, TooltipPopup } from './ProjectInfo.styles'
import { createUuid } from '../../../library/createUuid'
import { IconClose } from '../../icons'
import language from '../../../language'

export const OrganizationList = ({ organizations, handleOrganizationsChange }) => {
  return (
    organizations && (
      <TagStyleWrapper>
        {organizations.map((item) => {
          const uid = createUuid()

          return (
            <TagStyle tabIndex="0" key={item}>
              <ClearTagButton
                type="button"
                onClick={() => handleOrganizationsChange(item)}
                id={`remove-button-${uid}`}
                aria-labelledby={`aria-tooltip-label${uid}`}
              >
                <IconClose />
              </ClearTagButton>
              <TooltipPopup id={`aria-tooltip-label${uid}`}>
                {language.pages.projectInfo.removeOrganization}
              </TooltipPopup>
              {item}
            </TagStyle>
          )
        })}
      </TagStyleWrapper>
    )
  )
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOrganizationsChange: PropTypes.func.isRequired,
}
