import { createGlobalStyle, css } from 'styled-components'
import theme from '../../theme'
import { hoverState } from './mediaQueries'
import '@fontsource/open-sans'
import '@fontsource/open-sans/700.css'

const GlobalStyle = createGlobalStyle`
    :root {
        font-size: 62.5%;
    }
    body {
        background-color: ${theme.color.backgroundColor};
    }
    body, select, input, textarea, button, p, a{
        font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
        font-size: ${theme.typography.defaultFontSize};
        color: ${theme.color.textColor};
        -webkit-font-smoothing: antialiased;

    }
    select, input, textarea, p, a, button{
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
        text-decoration: underline;
        ${hoverState(css`
          text-decoration: none;
        `)}
    }
`

export default GlobalStyle
