import { styled } from '../../../../../styles'

const ColorsGradientWrapper = styled('section', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '$4',
  background: 'linear-gradient(270deg, #04E762 40.62%, #0090FF 61.98%)',
  padding: '48px',
})

const ColorWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
})

const ColorName = styled('h3', {
  fontFamily: '$fourfold',
  fontSize: '$h2',
  fontWeight: '$primary',
  lineHeight: '1',
})

const ColorHex = styled('p', {
  fontFamily: '$body',
  fontSize: '$body2',
  lineHeight: 'ternary3',

})

export default function Colors() {
  return (
    <ColorsGradientWrapper >
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
  )
}
