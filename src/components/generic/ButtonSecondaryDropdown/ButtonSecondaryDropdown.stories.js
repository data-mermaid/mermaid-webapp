import React from 'react'
import { IconRefresh } from '../../icons'
import ButtonSecondaryDropdown from '.'
import { ButtonPrimary, ButtonSecondary, ButtonCaution } from '../buttons'

export default {
  title: 'ButtonSecondaryDropdown',
  component: ButtonSecondaryDropdown,
}
export const basic = () => (
  <>
    <ButtonSecondaryDropdown label="short label">
      <div>Could be a div</div>
      <a href="#">Could be a link</a>
      <a href="#">with a divider</a>
      <hr />
      <a href="#">
        Then a link &amp; icon <IconRefresh />
      </a>
      <a href="#">
        <IconRefresh /> Then a icon &amp; link
      </a>
      <a href="#">
        ohanotherreallylongtextlinkicantbelievehowlongthiswordiswowowowowow
      </a>
      <hr />
      <p>Paragraph Text</p>
      <ButtonPrimary>omg a button?!</ButtonPrimary>
      <ButtonCaution>Delete Everyting</ButtonCaution>
    </ButtonSecondaryDropdown>

    <br />
    <ButtonSecondaryDropdown label="Long long button label but short options">
      <a href="#">Link</a>
    </ButtonSecondaryDropdown>
    <br />
    <ButtonSecondaryDropdown label="Button label">
      <h3>Only buttons</h3>
      <ButtonSecondary>A button</ButtonSecondary>
      <ButtonSecondary>Another Button</ButtonSecondary>
      <ButtonSecondary>Button the third</ButtonSecondary>
      <hr />
      <p>Danger Zone</p>
      <ButtonCaution>Delete Everyting</ButtonCaution>
    </ButtonSecondaryDropdown>
  </>
)
