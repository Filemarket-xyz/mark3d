import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { styled } from '../../../../styles'
import { Label } from '../../../pages/CreatePage/CreateCollectionPage'
import { Button } from '../../../UIkit'
import { FormControl } from '../../../UIkit/Form/FormControl'
import { Input } from '../../../UIkit/Form/Input'

export interface TransferFormValue {
  address: string
}

export interface TransferFormProps {
  defaultValues?: TransferFormValue
  onSubmit?: (value: TransferFormValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end',
})

export const TransferForm: FC<TransferFormProps> = ({ defaultValues, onSubmit }) => {
  const { handleSubmit, control } = useForm<TransferFormValue>({
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(values => {
      onSubmit?.(values)
    })}
    >
      <FormControl>
        <Label>Send to</Label>
        <Input<TransferFormValue>
          type="string"
          placeholder='0x1a1F...Df'
          controlledInputProps={{
            control,
            name: 'address',
            rules: { pattern: /^0x[0-9a-fA-F]{40}$/ },
          }}
        />
      </FormControl>
      <ButtonContainer>
        <Button
          secondary
          type="submit"
        >
          Initialize transfer
        </Button>
      </ButtonContainer>
    </form>
  )
}
