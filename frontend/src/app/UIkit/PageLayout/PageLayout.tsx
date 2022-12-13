import { styled } from '../../../styles'
import { Container } from '../Container'

export const PageLayout = styled(Container, {
  paddingTop: 'calc($layout$navBarHeight + $layout$bannerHeight + $space$4)',
  paddingBottom: '$space4',
  backgroundColor: '$gray100',
  minHeight: '100%'
})
