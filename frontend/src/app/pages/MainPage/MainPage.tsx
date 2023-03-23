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
      <script async src="https://app.chatpoint.ai/chatpoint.js" data-id="chatpoint-connector" data-website-id="94c2f83d-b71f-4d31-a25b-092514fb967a"></script>
    </>
  )
}
