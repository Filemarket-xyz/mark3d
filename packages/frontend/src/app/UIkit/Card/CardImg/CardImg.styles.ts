import { styled } from '../../../../styles'

export const StyledImgRoot = styled('div', {
  position: 'relative',
  paddingBottom: '100%',
})

export const StyledImgWrapper = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  variants: {
    variant: {
      primary: { padding: 12 },
      secondary: { padding: 20 },
    },
  },
})

export const StyledImgContainer = styled('div', {
  width: '100%',
  height: '100%',
  position: 'relative',
  variants: {
    variant: {
      primary: {
        borderRadius: '$2',
        '&::after': { borderRadius: '$2' },
      },
      secondary: {
        borderRadius: '$1',
        '&::after': { borderRadius: '$1' },
      },
    },
  },
  '&::after': {
    pointerEvents: 'none',
    content: '""',
    position: 'absolute',
    inset: 0,
    opacity: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    transition: 'all 0.25s ease-in-out',
  },
})

export const StyledImg = styled('img', {
  objectFit: 'cover',
  borderRadius: 'inherit',
  width: '100%',
  height: '100%',
})
