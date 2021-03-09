import { createGlobalStyle, css } from 'styled-components'
import raw from 'raw.macro'
import { hoverState } from './mediaQueries'

const toastifyCss = raw('react-toastify/dist/ReactToastify.css')

const GlobalStyle = createGlobalStyle`
    ${toastifyCss}
    :root{
        font-size: 62.5%;
        color: ${(props) => props.theme.color.black};
    }
    body {
        background: ${(props) => props.theme.color.backgroundColor};
    }
    body, select, input, textarea, p, a{
        font-family: ${(props) => props.theme.typography.fontStack};
        font-size: ${(props) => props.theme.typography.defaultFontSize};
    
    }
    select, input, textarea, p, a{
        line-height: ${(props) => props.theme.typography.lineHeight};
    }
    *,*::before,*::after{
        box-sizing: border-box;
    } 
    a{
        color: ${(props) => props.theme.color.black};
        text-decoration: underline;
        ${hoverState(css`
          text-decoration: none;
        `)}
    }
`

export default GlobalStyle
