import { ToastContainer } from 'react-toastify'
import { styled } from 'styled-components'
import theme from '../../theme'

export const CustomToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress',
  position: 'top-center',
  autoClose: '5000',
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: false,
  pauseOnHover: true,
})`
  .toast {
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
  .Toastify__toast--default {
  }
`
