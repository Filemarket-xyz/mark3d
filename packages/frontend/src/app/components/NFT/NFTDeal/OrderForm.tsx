import { BigNumber } from 'ethers'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { styled } from '../../../../styles'
import { Label } from '../../../pages/CreatePage/CreateCollectionPage'
import { Button, textVariant } from '../../../UIkit'
import { FormControl } from '../../../UIkit/Form/FormControl'
import { Input } from '../../../UIkit/Form/Input'
import { fromCurrency, toCurrency } from '../../../utils/web3/currency'

export interface OrderFormValue {
  price: BigNumber
}

interface OrderFormRawValue {
  price: number | null // to be correct, it should be string, but string validation as number is too tedious
}

const importFormValue = (value?: OrderFormValue): OrderFormRawValue => ({
  price: value ? toCurrency(value.price) : null,
})

const exportFormValue = (rawValue: OrderFormRawValue): OrderFormValue => ({
  price: fromCurrency(rawValue.price ?? 0),
})

export interface OrderFormProps {
  defaultValues?: OrderFormValue
  onSubmit?: (value: OrderFormValue) => void
}

const FormControlStyle = styled(FormControl, {
  '& .inputDiv': {
    position: 'relative',
  },
  '& .inputDiv:after': {
    content: 'FIL',
    position: 'absolute',
    color: '$gray400',
    ...textVariant('primary1').true,
    fontWeight: '600',
    top: '14px',
    right: '16px',
  },
})

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end',
})

export const OrderForm: FC<OrderFormProps> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<OrderFormRawValue>({
    defaultValues: importFormValue(defaultValues),
  })

  return (
    <form onSubmit={handleSubmit(values => {
      onSubmit?.(exportFormValue(values))
    })}
    >
      <FormControlStyle>
        <Label>Price</Label>
        <div className='inputDiv'>
          <Input
            type="number"
            step="any"
            placeholder='1.01'
            {...register('price', { required: true })}
          />
        </div>
      </FormControlStyle>
      <ButtonContainer>
        <Button
          secondary
          type="submit"
        >
          Place order
        </Button>
      </ButtonContainer>
    </form>
  )
}
