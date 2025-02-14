import styled, { css } from 'styled-components'

import { MODAL_CONTENT_HEIGHT } from '../../generic/Modal/Modal'
import theme from '../../../theme'

const citationLabelStyles = css`
  display: block;
  font-weight: bold;
  margin-top: ${theme.spacing.medium};
`

export const MainContentWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.xlarge};
  overflow-y: hidden;
  max-height: calc(${MODAL_CONTENT_HEIGHT} - (${theme.spacing.medium}*2));
`
export const ProjectInfoWrapper = styled.div`
  background-color: ${theme.color.grey4};
  border: solid thin ${theme.color.border};
  overflow-y: auto;
  padding: ${theme.spacing.small};
  box-sizing: border-box;
  width: 100%;
  overflow-y: auto;
`

export const CitationDefinitionList = styled.dl`
  all: unset;
  & > dt {
    font-weight: bold;
    margin-top: ${theme.spacing.medium};
  }
  & > dt:first-child {
    margin-top: 0;
  }
  & > dd {
    all: unset;
  }
`
export const CitationModalColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  width: 100%;
`
export const CitationLabel = styled.label`
  ${citationLabelStyles}
`
export const EditCitationLabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.small};

  & > label {
    margin: 0;
  }
`
