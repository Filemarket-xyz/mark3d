import { styled } from '../../../styles'
import { textVariant } from '../Txt'
import { Input, inputStyles } from './Input'

const InputWithPrefix = styled('div', {
  ...inputStyles,
  '&:focus-within': inputStyles['&:focus'],
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center'
})

const InputPostfix = styled('span', {
  color: '#a1a1ab',
  ...textVariant('primary1').true,
  fontWeight: 600
})

interface PrefixedInputProps {
  postfix: string
  placeholder: string
}

export default function PostfixedInput(props: PrefixedInputProps) {
  return (
    <InputWithPrefix>
      <Input
        css={{
          paddingLR: 0,
          borderRadius: 0,
          border: 'none',
          flexGrow: 1,
          height: '100%',
          boxShadow: 'none',
          '&:focus': {
            boxShadow: 'none'
          }
        }}
        placeholder={props.placeholder}
      />
      <InputPostfix>{props.postfix}</InputPostfix>
    </InputWithPrefix>
  )
}
