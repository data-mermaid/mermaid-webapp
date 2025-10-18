import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Column } from '../../generic/positioning'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconPlus } from '../../icons'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import theme from '../../../theme'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useTranslation } from 'react-i18next'

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
      <IconPlus /> {t('buttons.add_sample_unit')}
    </>
  )

  return (
    <StyledButtonSecondaryDropdown label={label}>
      <Column as="nav" data-testid="new-sample-unit-nav">
        <CustomNavLink to={`${currentProjectPath}/collecting/fishbelt`}>{t('protocol_titles.fishbelt')}</CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpit`}>
          {t('protocol_titles.benthicpit')}
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthiclit`}>
          {t('protocol_titles.benthiclit')}
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpqt`}>
          {t('protocol_titles.benthicpqt')}
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/bleachingqc`}>{t('protocol_titles.bleachingqc')}</CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/habitatcomplexity`}>
          {t('protocol_titles.habitatcomplexity')}
        </CustomNavLink>
      </Column>
    </StyledButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
