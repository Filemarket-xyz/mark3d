import { keyframes, styled } from '../../../../styles'
import { Button } from '../../Button'
import { Flex } from '../../Flex'
import { textVariant } from '../../Txt'

const isFirefox = navigator.userAgent.includes('Firefox')
if (!isFirefox) {
  CSS.registerProperty({
    name: '--rotate',
    syntax: '<angle>',
    inherits: false,
    initialValue: '132deg',
  })
}

const spin = keyframes({
  '0%': {
    '--rotate': '0deg',
  },
  '100%': {
    '--rotate': '360deg',
  },
})

export const StyledCardBackground = styled('div', {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: '-8%',
  zIndex: 0,
  height: '100%',
  width: '100%',
  margin: '0 auto',
  transform: 'scale(0.8)',
  filter: 'blur(60px)',
  backgroundImage: 'linear-gradient(var(--rotate), #8efdb5, #028fff, #01e3f8)',
  opacity: 1,
  transition: 'opacity 0.5s',
  animation: `${spin} 2.5s linear infinite`,
})

export const StyledCardInner = styled(Flex, {
  position: 'relative',
  zIndex: 1,
  margin: 4,
  padding: 20,
  background: '#1C1C45',
  borderRadius: 16,
  color: 'rgb(88 199 250 / 100%)',
  height: 'calc(100% - 8px)',
})

export const StyledCardInfo = styled(Flex, {
  color: '$gray400',
  paddingBottom: 12,
  borderBottom: '1px solid $whiteOp25',
})

export const StyledDescription = styled(StyledCardInfo, {
  ...textVariant('primary2').true,
  fontWeight: 400,
  opacity: 0,
  position: 'absolute',
  color: '$gray300',
  height: '100%',
  background: '#1C1C45',
  transition: 'opacity 0.25s',
  '& span': {
    fontWeight: 600,
    lineHeight: '$h1',
  },
})

export const StyledValueList = styled(Flex, {
  color: '#81FFA1',
})

export const StyledCard = styled('div', {
  cursor: 'pointer',
  height: '100%',
  minHeight: 475,
  width: 275,
  position: 'relative',
  zIndex: 1,
  borderRadius: 16,
  backgroundImage: 'linear-gradient(var(--rotate, 132deg), #8efdb5, #028fff, #01e3f8)',
  animation: `${spin} 2.5s linear infinite`,
  '&:hover': {
    animation: 'none',
    background: 'rgba(255,255,255, 0.25)',
  },
  [`&:hover ${StyledCardBackground.selector}`]: {
    animation: 'none',
    opacity: 0,
  },
  [`&:hover ${StyledDescription.selector}`]: {
    transition: 'opacity 0.5s',
    opacity: 1,
  },
  '@sm': {
    width: '100%',
    maxWidth: '400px',
  },
})

export const StyledRarity = styled('span', {
  ...textVariant('body3').true,
  fontWeight: 600,
  textTransform: 'capitalize',
  variants: {
    rarity: {
      common: { color: '#C9CBCF' },
      uncommon: { color: '#028FFF' },
      rare: { color: '#81FFA1' },
      legendary: { color: '#A165EE' },
      mythical: { color: '#FF67F0' },
    },
  },
})

export const StyledText = styled(Flex, {
  ...textVariant('body1').true,
  fontFamily: 'MuseoModerno, sans-serif',
  color: '$white',
  whiteSpace: 'nowrap',
  textAlign: 'center',
})

export const StyledRarityButton = styled(Button, {
  ...textVariant('primary2').true,
  fontWeight: 600,
  background: 'transparent',
  color: '$gray400',
  borderBottom: '1px dashed $gray400',
  height: 'auto',
  minWidth: 'auto',
  borderRadius: 0,
  padding: 0,
})
