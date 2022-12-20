import WelcomeBlock from './Blocks/WelcomeBlock'
import { styled } from '../../../styles'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-y'
})

export default function MainPage() {
  return (
    <GradientWrapper>
      <WelcomeBlock />
    </GradientWrapper>
  )
}
