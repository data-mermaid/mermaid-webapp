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
          looks like AL, but it&apos;s actually ai which stands for <strike>Alan Leonard</strike>, I
          mean artificial intelligence
        </>
      }
      id="someID"
    />
    <hr />
    <TooltipWithText
      text={<>What&apos;s all this then?</>}
      tooltipText={<>hi, I&apos;m a tootlip</>}
      id="anotherID"
    />
    <hr />
    <TooltipWithText
      as="h2"
      text={<>What&apos;s all this then?</>}
      tooltipText={
        <>
          hi, I&apos;m
          <br />a tootlip
        </>
      }
      id="aThridID"
    />
    <hr />
  </>
)
