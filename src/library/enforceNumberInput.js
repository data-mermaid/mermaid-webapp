export const enforceNumberInput = (event) => {
  // Allow only numbers, special key presses, and copy paste shortcuts.
  const specialActionAndCharacterKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Delete',
    '-',
    '.',
    'Tab',
  ]

  const isModifiersKeyPressed = event.metaKey || event.ctrlKey || event.shiftKey
  const isMovingAndSpecialCharactersKeyPressed = specialActionAndCharacterKeys.includes(event.key)
  const isNumbersKeyPressed =
    (event.keyCode >= 48 && event.keyCode <= 58) || (event.keyCode >= 96 && event.keyCode <= 105)

  return !(isModifiersKeyPressed || isMovingAndSpecialCharactersKeyPressed || isNumbersKeyPressed)
}
