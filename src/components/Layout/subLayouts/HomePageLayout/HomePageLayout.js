import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../../../theme'
import { mediaQueryPhoneOnly } from '../../../../library/styling/mediaQueries'
import { Column } from '../../../generic/positioning'

const HomePageContainer = styled(Column)`
  margin-top: 23rem;
  margin-bottom: ${theme.spacing.medium};
  ${mediaQueryPhoneOnly(css`
    margin-top: 16rem;
  `)}
`
const TopRow = styled.div``
const BottomRow = styled.div`
  flex-grow: 2;
`

const HomePageLayout = ({ topRow, bottomRow }) => {
  return (
    <HomePageContainer>
      <TopRow>{topRow}</TopRow>
      <BottomRow>{bottomRow}</BottomRow>
    </HomePageContainer>
  )
}

HomePageLayout.propTypes = {
  topRow: PropTypes.node.isRequired,
  bottomRow: PropTypes.node.isRequired,
}

export default HomePageLayout
