import { BigNumber } from 'ethers'
import { fromCurrency, toCurrency } from '../../../utils/web3/currency'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../../UIkit/Form/Input'
import { FormControl } from '../../../UIkit/Form/FormControl'
import { Label } from '../../../pages/CreatePage/CreateCollectionPage'
import { styled } from '../../../../styles'
import { Button } from '../../../UIkit'

export interface OrderFormValue {
  price: BigNumber
}

interface OrderFormRawValue {
  price: number | null // to be correct, it should be string, but string validation as number is too tedious
}

const importFormValue = (value?: OrderFormValue): OrderFormRawValue => ({
  price: value ? toCurrency(value.price) : null
})

const exportFormValue = (rawValue: OrderFormRawValue): OrderFormValue => ({
  price: fromCurrency(rawValue.price ?? 0)
})

export interface OrderFormProps {
  defaultValues?: OrderFormValue
  onSubmit?: (value: OrderFormValue) => void
  preSubmit?: (value: OrderFormValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end'
})

export const OrderForm: FC<OrderFormProps> = ({ defaultValues, onSubmit, preSubmit }) => {
  const [value, setValue] = useState<OrderFormValue>()
  const { register, handleSubmit } = useForm<OrderFormRawValue>({
    defaultValues: importFormValue(defaultValues)
  })
  useEffect(() => {
    if (value) {
      onSubmit?.(value)
    }
  }, [value])
  return (
    <form onSubmit={handleSubmit(values => {
      const v = exportFormValue(values)
      preSubmit?.(v)
      setValue(v)
    })}>
      <FormControl>
        <Label>Price</Label>
        <Input
          type="number"
          step="any"
          placeholder='1.01'
          {...register('price', { required: true })}
        />
      </FormControl>
      <ButtonContainer>
        <Button
          type="submit"
          secondary
        >
          Place order
        </Button>
      </ButtonContainer>
    </form>
  )
}
