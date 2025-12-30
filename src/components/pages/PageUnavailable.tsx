import React from 'react'
import styled from 'styled-components'
import { Column } from '../generic/positioning'
import theme from '../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left: ${theme.spacing.large};
`
// text-align: ${(props) => props.$align};

interface PageUnavailableProps {
  mainText?: string
  subText?: string
  // $align?: 'start' | 'end' | 'center' | 'justify'
  children?: React.ReactNode
  testId?: string
}

const PageUnavailable = ({
  mainText = 'No Data',
  subText,
  // $align = 'start',
  children,
  testId = 'page-unavailable-main-text',
}: PageUnavailableProps) => {
  if (children) {
    return <PageUnavailableContainer data-testid={testId}>{children}</PageUnavailableContainer>
  }

  return (
    <PageUnavailableContainer /**$align={$align}**/ data-testid={testId}>
      {mainText && <h3>{mainText}</h3>}
      {subText && <p>{subText}</p>}
    </PageUnavailableContainer>
  )
}

export default PageUnavailable
