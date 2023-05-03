import WelcomeBlock from './Blocks/WelcomeBlock'
import { styled } from '../../../styles'
import PoweredBy from './Blocks/PoweredBy'
import CardsBlock from './Blocks/CardsBlock'

const GradientWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$gray100'
})

export default function MainPage() {
  return (
    <>
      <GradientWrapper>
        <WelcomeBlock />
         <CardsBlock/>
        <PoweredBy/>
      </GradientWrapper>
    </>
  )
}
