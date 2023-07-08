import { styled } from '../../../../../styles'

const ColorsGradientWrapper = styled('section', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '$4',
  background: 'linear-gradient(270deg, #04E762 40.62%, #0090FF 61.98%)',
  border: '4px solid #EAEAEC',
  padding: '48px',
  '@md': {
    padding: '35px',
  },
  '@sm': {
    display: 'none',
  },
})

const ColorWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: '10px',
})

const ColorName = styled('h3', {
  fontFamily: '$fourfold',
  fontSize: '$h2',
  fontWeight: '$primary',
  lineHeight: '1',
  '@md': {
    fontSize: '$h3',
  },
})

const ColorHex = styled('p', {
  fontFamily: '$body',
  fontSize: '$body2',
  lineHeight: 'ternary3',
})

const ColorsGradientWrapperMobile = styled('section', {
  display: 'none',
  alignItems: 'center',
  columnGap: '24px',
  '@sm': {
    display: 'flex',
  },
})

const ColorsGradientMobile = styled('div', {
  width: '112px',
  alignSelf: 'stretch',
  borderRadius: '$4',
  background: 'linear-gradient(360deg, #04E762 40.62%, #0090FF 61.98%)',
  border: '4px solid #EAEAEC',
  padding: '48px',
  '@md': {
    padding: '35px',
  },
})

const ColorsWrapperMobile = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '152px',
  paddingTop: '64px',
  paddingBottom: '64px',
})

export default function Colors() {
  return (
    <>
      <ColorsGradientWrapper>
        <ColorWrapper>
          <ColorName css={{ color: '$white' }}>KYANITE</ColorName>
          <ColorHex css={{ color: '$white' }}>
            <span style={{ userSelect: 'none' }}>HEX: </span>
            #0090FF
          </ColorHex>
        </ColorWrapper>
        <ColorWrapper css={{ alignItems: 'flex-end' }}>
          <ColorName css={{ color: '$gray700' }}>MALACHITE</ColorName>
          <ColorHex css={{ color: '$gray700' }}>
            <span style={{ userSelect: 'none' }}>HEX: </span>
            #04E762
          </ColorHex>
        </ColorWrapper>
      </ColorsGradientWrapper>
      <ColorsGradientWrapperMobile>
        <ColorsGradientMobile />
        <ColorsWrapperMobile>
          <ColorWrapper>
            <ColorName css={{ color: '$gray700' }}>KYANITE</ColorName>
            <ColorHex css={{ color: '$gray700' }}>
              <span style={{ userSelect: 'none' }}>HEX: </span>
              #0090FF
            </ColorHex>
          </ColorWrapper>
          <ColorWrapper>
            <ColorName css={{ color: '$gray700' }}>MALACHITE</ColorName>
            <ColorHex css={{ color: '$gray700' }}>
              <span style={{ userSelect: 'none' }}>HEX: </span>
              #04E762
            </ColorHex>
          </ColorWrapper>
        </ColorsWrapperMobile>
      </ColorsGradientWrapperMobile>
    </>
  )
}
