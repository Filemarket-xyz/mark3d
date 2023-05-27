import { styled } from '../../../../styles'

export const StyledFileType = styled('div', {
  backgroundColor: '$whiteOp50',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
  borderRadius: '$1',
  paddingLR: 4,
  paddingTB: 4,
  display: 'flex',
  gap: '4px',
  transition: 'all 0.25s ease-in-out',
  '& img': {
    width: '16px',
    height: '16px',
  },
})
