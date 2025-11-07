import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Column } from '../../generic/positioning'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconPlus } from '../../icons'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import theme from '../../../theme'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'

const CustomNavLink = styled(NavLink)`
  padding: ${theme.spacing.buttonPadding};
  text-decoration: none;
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
`
const StyledButtonSecondaryDropdown = styled(ButtonSecondaryDropdown)`
  white-space: nowrap;
`
const AddSampleUnitButton = () => {
  const { t } = useTranslation()
  const currentProjectPath = useCurrentProjectPath()
  const label = (
    <>
      <IconPlus /> {t('sample_units.add')}
    </>
  )

  return (
    <StyledButtonSecondaryDropdown label={label} data-testid="add-sample-unit-button">
      <Column as="nav" data-testid="new-sample-unit-nav">
        <CustomNavLink to={`${currentProjectPath}/collecting/fishbelt`} data-testid="fishbelt-link">
          {t('protocol_titles.fishbelt')}
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/benthicpit`}
          data-testid="benthicpit-link"
        >
          {t('protocol_titles.benthicpit')}
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/benthiclit`}
          data-testid="benthiclit-link"
        >
          {t('protocol_titles.benthiclit')}
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/benthicpqt`}
          data-testid="benthicpqt-link"
        >
          {t('protocol_titles.benthicpqt')}
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/bleachingqc`}
          data-testid="bleachingqc-link"
        >
          {t('protocol_titles.bleachingqc')}
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/habitatcomplexity`}
          data-testid="habitatcomplexity-link"
        >
          {t('protocol_titles.habitatcomplexity')}
        </CustomNavLink>
      </Column>
    </StyledButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
