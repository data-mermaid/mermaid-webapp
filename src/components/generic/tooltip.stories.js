import React from 'react'
import { TooltipWithText } from './tooltip'

export default {
  title: 'Tootlip',
}
export const basic = () => (
  <>
    <TooltipWithText
      text={<>AI</>}
      tooltipText={
        <>
          looks like AL, but it's actually ai which stands for{' '}
          <strike>Alan Leonard</strike>, I mean artificial intelligence
        </>
      }
      id="someID"
    />
    <hr />
    <TooltipWithText
      text={<>What's all this then?</>}
      tooltipText={<>hi, I'm a tootlip</>}
      id="anotherID"
    />
    <hr />
    <TooltipWithText
      as="h2"
      text={<>What's all this then?</>}
      tooltipText={
        <>
          hi, I'm
          <br />a tootlip
        </>
      }
      id="aThridID"
    />
    <hr />
  </>
)
