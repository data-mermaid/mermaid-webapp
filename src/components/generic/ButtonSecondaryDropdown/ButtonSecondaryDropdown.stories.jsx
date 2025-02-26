import React from 'react'
import { IconSync } from '../../icons'
import ButtonSecondaryDropdown from '.'
import { ButtonPrimary, ButtonSecondary, ButtonCaution } from '../buttons'

export default {
  title: 'ButtonSecondaryDropdown',
  component: ButtonSecondaryDropdown,
}
export const basic = () => (
  <>
    <ButtonSecondaryDropdown label="lil lbl">
      <div>Could be a div</div>
      <a href="./">Could be a link</a>
      <a href="./">with a divider</a>
      <hr />
      <a href="./">
        Then a link &amp; icon <IconSync />
      </a>
      <a href="./">
        <IconSync /> Then a icon &amp; link
      </a>
      <a href="./">ohanotherreallylongtextlinkicantbelievehowlongthiswordiswowowowowow</a>
      <hr />
      <p>Paragraph Text</p>
      <ButtonPrimary>omg a button‽</ButtonPrimary>
      <ButtonCaution>Delete Everyting</ButtonCaution>
    </ButtonSecondaryDropdown>

    <br />
    <ButtonSecondaryDropdown label="A button dropdown">
      <a href="./">Option 1</a>
      <a href="./">Lots of little words just like a regular sentence.</a>
      <a href="./">Option 3</a>
      <a href="./">Option 4</a>
    </ButtonSecondaryDropdown>
    <br />
    <ButtonSecondaryDropdown label="Long long button label but short options">
      <a href="./">Link</a>
    </ButtonSecondaryDropdown>
    <br />
    <ButtonSecondaryDropdown label="Only Buttons">
      <ButtonSecondary>A button</ButtonSecondary>
      <ButtonSecondary>Another Button</ButtonSecondary>
      <ButtonSecondary>Button the third</ButtonSecondary>
      <ButtonCaution>Delete Everyting</ButtonCaution>
    </ButtonSecondaryDropdown>
  </>
)
