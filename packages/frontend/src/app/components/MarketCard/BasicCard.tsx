import { styled } from '../../../styles'

export const BasicCard = styled('div', {
  width: '100%',
  height: '364px',
  borderRadius: '$3',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    height: '375px',
  },
})

export const BasicCardSquareImg = styled('img', {
  width: '232px',
  height: '232px',
  borderRadius: '8px',
  outline: '1px solid $whiteOp50',
  outlineOffset: '-1px',
  objectFit: 'cover',
  margin: '0 auto',
  position: 'relative',
})

export const BasicCardControls = styled('div', {
  width: '100%',
  borderRadius: 'inherit',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  backgroundColor: '$white',
  padding: '$3 11px',
})

export default BasicCard
