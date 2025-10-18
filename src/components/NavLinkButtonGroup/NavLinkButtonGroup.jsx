import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLinkThatLooksLikeButtonIcon } from '../generic/links'
import { IconCollect, IconData, IconInfo, IconProjectOverview } from '../icons'
import stopEventPropagation from '../../library/stopEventPropagation'
import OfflineHide from '../generic/OfflineHide'
import { useTranslation } from 'react-i18next'

const ButtonLabel = styled('span')``

const NavLinkButtonGroup = ({ projectUrl }) => {
  const { t } = useTranslation()

  return (
    <>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/observers-and-transects`}
          aria-label={t('aria.users_and_transects')}
          onClick={stopEventPropagation}
        >
          <IconProjectOverview />
          <ButtonLabel>{t('navigation.overview')}</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
      <NavLinkThatLooksLikeButtonIcon
        to={`${projectUrl}/collecting`}
        aria-label={t('aria.collect')}
        onClick={stopEventPropagation}
      >
        <IconCollect />
        <ButtonLabel>{t('navigation.collecting')}</ButtonLabel>
      </NavLinkThatLooksLikeButtonIcon>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/submitted`}
          aria-label={t('aria.submitted')}
          onClick={stopEventPropagation}
        >
          <IconData />
          <ButtonLabel>{t('navigation.submitted')}</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/project-info`}
          aria-label={t('aria.project_info')}
          onClick={stopEventPropagation}
        >
          <IconInfo />
          <ButtonLabel>{t('navigation.info')}</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
    </>
  )
}

NavLinkButtonGroup.propTypes = {
  projectUrl: PropTypes.string.isRequired,
}

export default NavLinkButtonGroup
