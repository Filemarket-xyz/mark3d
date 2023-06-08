
import { styled } from '../../../../../styles'
import { Flex, textVariant } from '../../../../UIkit'

export const StyledFlex = styled(Flex, {
  width: '100%',
  padding: '12px $3 $3',
  borderRadius: '$3',
  border: '1px solid $gray300',
})

export const StyledPriceDescription = styled('div', {
  ...textVariant('primary2').true,
  fontWeight: 400,
  textAlign: 'left',
  '& span': {
    fontWeight: 600,
  },
})
