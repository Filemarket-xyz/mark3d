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

const InputPrefix = styled('span', {
  color: '$gray500',
  ...textVariant('secondary1').true,
  fontWeight: 600
})

interface PrefixedInputProps {
  prefix: string
  placeholder: string
}

export default function PrefixedInput(props: PrefixedInputProps) {
  return (
    <InputWithPrefix>
      <InputPrefix>{props.prefix}</InputPrefix>
      <Input
          onChange={(event) => {
              console.log(event)
          }}
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
    </InputWithPrefix>
  )
}
