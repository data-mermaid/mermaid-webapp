import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ClearTagButton, TagStyle, TagStyleWrapper, TooltipPopup } from './ProjectInfo.styles'
import { createUuid } from '../../../library/createUuid'
import { IconClose } from '../../icons'

export const OrganizationList = ({ organizations, handleOrganizationsChange }) => {
  const { t } = useTranslation()

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
                {t('organizations.remove_organization')}
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
