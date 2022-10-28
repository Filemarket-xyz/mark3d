import ToolsBlock from './ToolsBlock'
import WelcomeBlock from './WelcomeBlock'
import gradient from './img/Gradient.jpg'
import { styled } from '../../../styles'
import ExplorerBlock from './ExplorerBlock'

const GradientWrapper = styled('div', {
  backgroundImage: `url(${gradient})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-y'
})

export default function MainPage() {
  return (
    <GradientWrapper>
      <WelcomeBlock />
      <ToolsBlock />
      <ExplorerBlock />
    </GradientWrapper>
  )
}
