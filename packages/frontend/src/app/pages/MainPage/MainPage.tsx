import WelcomeBlock from './Blocks/WelcomeBlock'
import { styled } from '../../../styles'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$gray100'
})

export default function MainPage() {
  return (
    <>
      <GradientWrapper>
        <WelcomeBlock />
      </GradientWrapper>
    </>
  )
}
