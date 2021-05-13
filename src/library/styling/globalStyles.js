import { createGlobalStyle, css } from 'styled-components'
import raw from 'raw.macro'
import theme from '../../theme'
import { hoverState } from './mediaQueries'

const toastifyCss = raw('react-toastify/dist/ReactToastify.css')

const GlobalStyle = createGlobalStyle`
    ${toastifyCss}
    :root {
        font-size: 62.5%;
        color: ${theme.color.black};
    }
    body {
        background: ${theme.color.backgroundColor};
    }
    body, select, input, textarea, button, p, a{
        font-family: ${theme.typography.fontStack};
        font-size: ${theme.typography.defaultFontSize};
    
    }
    select, input, textarea, p, a{
        line-height: ${theme.typography.lineHeight};

    }
    svg {
        width: ${(props) => props.theme.typography.defaultIconSize};
        height: ${(props) => props.theme.typography.defaultIconSize};
    }
    *,*::before,*::after {
        box-sizing: border-box;
    } 
    a{
        color: ${theme.color.black};
        text-decoration: underline;
        ${hoverState(css`
          text-decoration: none;
        `)}
    }
`

export default GlobalStyle
