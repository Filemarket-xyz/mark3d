import ToolsScreen from './ToolsScreen'
import WelcomeScreen from './WelcomeScreen'
import gradient from './img/Gradient.jpg'
import { styled } from '../../../styles'

const GradientWrapper = styled('div', {
  backgroundImage: `url(${gradient})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-y'
})

export default function MainPage() {
  return (
    <GradientWrapper>
      <WelcomeScreen />
      <ToolsScreen />
    </GradientWrapper>
  )
}
