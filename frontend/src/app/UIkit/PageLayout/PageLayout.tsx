import { styled } from '../../../styles'
import { Container } from '../Container'
import { navBarHeightPx } from '../NavBar'

export const PageLayout = styled(Container, {
  paddingTop: `calc(${navBarHeightPx}px + $space$4)`,
  paddingBottom: '$space4',
  backgroundColor: '$gray100',
  minHeight: '100%'
})
