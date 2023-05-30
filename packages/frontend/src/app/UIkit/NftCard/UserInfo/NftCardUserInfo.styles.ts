import { styled } from '../../../../styles'
import { Txt } from '../../Txt'

export const StyledUserImg = styled('img', {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '1px solid $gray400',
})

export const StyledUserAddress = styled(Txt, {
  color: '$gray600',
})
