import { styled } from '../../../styles'
import { Container } from '../Container'

export const PageLayout = styled(Container, {
  paddingTop: 'calc($layout$navBarHeight + $space$4)',
  paddingBottom: '$space4',
  backgroundColor: '$gray100',
  minHeight: '100%',
  variants: {
    nonePaddingTop: {
      true: {
        paddingTop: 0
      }
    }
  }
})
