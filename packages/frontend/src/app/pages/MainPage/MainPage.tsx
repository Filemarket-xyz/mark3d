import WelcomeBlock from './Blocks/WelcomeBlock'
import { styled } from '../../../styles'
import PoweredBy from './Blocks/PoweredBy'
import CardsBlock from './Blocks/CardsBlock'
import InfoBlock from './Blocks/InfoBlock'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$gray100'
})

export default function MainPage() {
  return (
    <>
      <GradientWrapper>
        <WelcomeBlock />
        <InfoBlock/>
         <CardsBlock/>
        <PoweredBy/>
      </GradientWrapper>
    </>
  )
}
