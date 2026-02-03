import React, { ChangeEventHandler, ReactNode } from 'react'
import buttonStyles from '../../../style/buttons.module.scss'
import formStyles from '../../../style/forms.module.scss'

interface InputAndButtonProps {
  buttonChildren: ReactNode
  buttonOnClick: () => void
  buttonType?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  inputId: string
  labelText: string
  isLoading: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  formValue?: string
}

const InputAndButton = ({
  buttonChildren,
  buttonOnClick,
  buttonType = 'button',
  disabled = false,
  inputId,
  isLoading,
  onChange,
  labelText,
  formValue,
}: InputAndButtonProps) => {
  return (
    <div>
      <label htmlFor={inputId}>{labelText}</label>
      <div
        className={
          formValue && formValue.length > 0
            ? formStyles['form__input_button_wrapper--warning']
            : formStyles['form__input_button_wrapper']
        }
      >
        <input
          disabled={disabled}
          className={formStyles['form__input']}
          id={inputId}
          type="text"
          onChange={onChange}
        />
        <button
          className={buttonStyles['button--input']}
          type={buttonType}
          onClick={buttonOnClick}
          disabled={isLoading || disabled}
        >
          {buttonChildren}
        </button>
      </div>
    </div>
  )
}

export default InputAndButton
