import React from 'react'
import { ToastContainer } from 'react-toastify'
import { styled } from 'styled-components'
import theme from '../../theme'

const ToastWrapper = styled.div`
  .Toastify__toast {
    &,
    .Toastify__close-button {
      color: ${theme.color.black};
    }
    background: ${theme.color.white};
    border: solid ${theme.spacing.borderSmall};
    border-color: ${theme.color.border};
    border-left-color: ${theme.color.primaryColor};
    border-left-width: ${theme.spacing.borderXLarge};
    border-radius: 0;
    &:hover {
      transition: ${theme.timing.hoverTransition};
      background: ${theme.color.secondaryHover};
    }
  }
  .Toastify__toast--warning {
    border-left-color: ${theme.color.warningColor};
  }
  .Toastify__toast--error {
    border-left-color: ${theme.color.cautionColor};
  }
`

export const CustomToastContainer = (props) => (
  <ToastWrapper>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      {...props}
    />
  </ToastWrapper>
)
