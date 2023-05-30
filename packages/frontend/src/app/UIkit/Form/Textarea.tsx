import { styled } from '../../../styles'
import { inputStyles } from './Input'

export const TextArea = styled('textarea', {
  ...inputStyles,
  padding: '14px $3',
  height: 'auto',
  minHeight: 96,
  resize: 'vertical',
})
