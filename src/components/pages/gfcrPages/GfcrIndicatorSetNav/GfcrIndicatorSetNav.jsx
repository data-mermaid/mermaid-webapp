import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'
import { hoverState } from '../../../../library/styling/mediaQueries'

const StyledNav = styled.nav`
  width: 26rem;
`

const itemStyles = (props) => css`
  border: 1.5px solid white;
  background-color: ${props.selected ? theme.color.grey5 : theme.color.grey4};
  background-color: ${props.selected ? theme.color.primaryColor : theme.color.grey4};
  color: ${props.selected ? theme.color.white : theme.color.textColor};
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
    cursor: pointer;
  `)}
`

const NavHeader = styled.h3(
  (props) => css`
    background: ${theme.color.grey4};
    margin: 0;
    padding: 10px;
    /* ${itemStyles(props)} */
  `,
)

const NavSubHeader = styled.div(
  (props) => css`
    background: ${theme.color.grey4};
    margin: 0;
    padding: 10px;
    /* padding-left: 6px; */
    ${itemStyles(props)}
  `,
)

const NavList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding-left: 6px;
`

const NavListItem = styled.li(
  (props) => css`
    display: flex;
    margin: 0;
    padding: 10px;
    font-size: 14px;
    ${itemStyles(props)}
  `,
)

const FText = styled.span`
  font-weight: bold;
  padding-right: 8px;
`

const LiText = styled.span`
  /* margin: 0; */
`

const GfcrIndicatorSetNav = ({ selectedNavItem, setSelectedNavItem }) => {
  const { t } = useTranslation()

  return (
    <StyledNav>
      <NavHeader>{t('gfcr.fund_indicators')}</NavHeader>
      <NavSubHeader
        id="report-title-and-year"
        selected={selectedNavItem === 'report-title-and-year'}
        onClick={(e) => {
          setSelectedNavItem(e.currentTarget.id)
        }}
      >
        {t('gfcr.report_title_and_date')}
      </NavSubHeader>
      <NavList>
        <NavListItem
          id="f1"
          selected={selectedNavItem === 'f1'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F1</FText>
          <LiText>{t('gfcr.programme_area')}</LiText>
        </NavListItem>
        <NavListItem
          id="f2"
          selected={selectedNavItem === 'f2'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F2</FText>
          <LiText>{t('gfcr.conservation_and_management')}</LiText>
        </NavListItem>
        <NavListItem
          id="f3"
          selected={selectedNavItem === 'f3'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F3</FText>
          <LiText>{t('gfcr.restoration')}</LiText>
        </NavListItem>
        <NavListItem
          id="f4"
          selected={selectedNavItem === 'f4'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F4</FText>
          <LiText>{t('gfcr.coral_reef_health')}</LiText>
        </NavListItem>
        <NavListItem
          id="f5"
          selected={selectedNavItem === 'f5'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F5</FText>
          <LiText>{t('gfcr.communities')}</LiText>
        </NavListItem>
        <NavListItem
          id="f6"
          selected={selectedNavItem === 'f6'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F6</FText>
          <LiText>{t('gfcr.people')}</LiText>
        </NavListItem>
        <NavListItem
          id="f7"
          selected={selectedNavItem === 'f7'}
          onClick={(e) => setSelectedNavItem(e.currentTarget.id)}
        >
          <FText>F7</FText>
          <LiText>{t('gfcr.climate_response')}</LiText>
        </NavListItem>
      </NavList>
      <NavHeader>F8, F9, F10</NavHeader>
      <NavSubHeader
        id="finance-solutions"
        selected={selectedNavItem === 'finance-solutions'}
        onClick={(e) => {
          setSelectedNavItem(e.currentTarget.id)
        }}
      >
        {t('gfcr.businesses_finance_solutions')}
      </NavSubHeader>
      <NavSubHeader
        id="investments"
        selected={selectedNavItem === 'investments'}
        onClick={(e) => {
          setSelectedNavItem(e.currentTarget.id)
        }}
      >
        {t('gfcr.investments')}
      </NavSubHeader>
      <NavSubHeader
        id="revenues"
        selected={selectedNavItem === 'revenues'}
        onClick={(e) => {
          setSelectedNavItem(e.currentTarget.id)
        }}
      >
        {t('gfcr.revenues')}
      </NavSubHeader>
    </StyledNav>
  )
}

GfcrIndicatorSetNav.propTypes = {
  selectedNavItem: PropTypes.string.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
}

export default GfcrIndicatorSetNav
