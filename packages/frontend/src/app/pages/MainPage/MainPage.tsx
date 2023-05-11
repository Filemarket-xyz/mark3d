import { styled } from '../../../styles'
import CardsBlock from './Blocks/CardsBlock'
import InfoBlock from './Blocks/InfoBlock'
import PoweredBy from './Blocks/PoweredBy'
import WelcomeBlock from './Blocks/WelcomeBlock'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$gray100'
})

export default function MainPage() {
  return (
    <>
      <GradientWrapper>
        <WelcomeBlock />
        <InfoBlock />
        <CardsBlock />
        <PoweredBy />
      </GradientWrapper>
    </>
  )
}
