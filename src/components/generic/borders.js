import styled, { css } from 'styled-components/macro'

export const OfflineBordersStyle = styled.div`
  position: fixed;
  background-color: #cc0a00;
  z-index: 1000;

  ${(props) =>
    props.top &&
    css`
      height: 3px;
      width: 100%;
    `}
  ${(props) =>
    props.right &&
    css`
      height: calc(100% - 3em);
      width: 3px;
      right: 0;
    `}
  ${(props) =>
    props.bottom &&
    css`
      height: 3px;
      width: 100%;
      bottom: 51px;
    `}
  ${(props) =>
    props.left &&
    css`
      height: calc(100% - 3em);
      width: 3px;
    `}

  
`
