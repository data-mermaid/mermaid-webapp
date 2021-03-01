const { createGlobalStyle } = require('styled-components')

const GlobalStyle = createGlobalStyle`
    :root{
        font-size: 62.5%;
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
`

export default GlobalStyle
