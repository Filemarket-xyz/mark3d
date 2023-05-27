import { styled } from '../../../styles'

export const RowWrapper = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  minHeight: '80px',
  color: '$gray500',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    open: {
      true: {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
      },
    },
  },
})

export const RowBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '1 1 auto',
  gap: '$3',
  '@sm': {
    paddingLR: '$3',
  },
})
