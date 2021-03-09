import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

export const CustomToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress',
  position: 'top-right',
  autoClose: '5000',
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
})`
  .Toastify__toast--default {
  }
`
