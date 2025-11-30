import React from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import theme from '../../../../../theme'
import { links } from '../../../../../link_constants'

const StyledHelperLink = styled.a`
  font-size: ${theme.typography.smallFontSize};
`

interface GfcrHelperLinksProps {
  translationKey: string
}

const GfcrHelperLinks = ({ translationKey }: GfcrHelperLinksProps) => {
  return (
    <Trans
      i18nKey={translationKey}
      components={{
        acaLink: (
          <StyledHelperLink
            href={links.allenCoralAtlas}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        gfcrPdfLink: (
          <StyledHelperLink href={links.gfcrToolkitPdf} target="_blank" rel="noopener noreferrer" />
        ),
        '2xLink': (
          <StyledHelperLink
            href={links.twoXChallengeCriteria}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  )
}

export default GfcrHelperLinks
