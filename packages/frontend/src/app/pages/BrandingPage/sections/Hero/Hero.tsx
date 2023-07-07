import heroLogoSrc from '../../../../../assets/img/BrandingPage/hero-logo.svg'
import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'

const HeroWrapper = styled('section', {
  position: 'relative',
  paddingTop: '53px',
  paddingBottom: '53px',
  marginBottom: '250px',
  '@xl': {
    marginBottom: '80px',
  },
})

const HeroTextWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: '16px',
  color: '$gray700',
})

const HeroTitle = styled('h1', {
  color: '$gray700',
  fontFamily: '$fourfold',
  fontSize: '3.5rem',
  fontWeight: '$fourfold',
  lineHeight: '1',
  marginBottom: '48px',
})

const HeroLogo = styled('img', {
  position: 'absolute',
  right: '0%',
  top: '0',
  width: '500px',
  height: '500px',
  '@xl': {
    right: '0',
    height: '100%',
    width: 'auto',
  },
})

export default function Hero() {
  return (
    <HeroWrapper>
      <HeroTitle>
        Branding &
        <br />
        Media kit
      </HeroTitle>
      <HeroTextWrapper>
        <Txt body2>
          Thank you for your participation in working with FileMarket,
          <br />
          and welcome to our community!
        </Txt>
        <Txt body2>
          Follow the guidelines when using the FileMarket brand identity
          <br />
          on all marketing channels.
        </Txt>
      </HeroTextWrapper>
      <HeroLogo src={heroLogoSrc} />
    </HeroWrapper>
  )
}
