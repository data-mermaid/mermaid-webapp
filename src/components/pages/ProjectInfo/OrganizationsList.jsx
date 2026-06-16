import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ClearTagButton, TagStyle, TagStyleWrapper } from './ProjectInfo.styles'
import { MuiTooltip } from '../../generic/MuiTooltip'
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
              <MuiTooltip title={t('organizations.remove_organization')} placement="bottom" arrow>
                <ClearTagButton
                  type="button"
                  onClick={() => handleOrganizationsChange(item)}
                  id={`remove-button-${uid}`}
                  aria-label={t('organizations.remove_organization')}
                >
                  <IconClose />
                </ClearTagButton>
              </MuiTooltip>
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
