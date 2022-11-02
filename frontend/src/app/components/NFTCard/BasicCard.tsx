import { styled } from '../../../styles'

const BasicCard = styled('div', {
  maxWidth: '255px',
  height: '320px',
  borderRadius: '$3',
  position: 'relative',
  overflow: 'hidden',
  filter: 'drop-shadow(0px 4px 15px rgba(19, 19, 45, 0.1))',
  '&:hover': {
    filter: 'drop-shadow(0px 12px 25px rgba(19, 19, 45, 0.35))'
  }
})

export default BasicCard
