import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreatePasswordValue } from '../../CreateMnemonicDialog/CreatePasswordForm/CreatePasswordForm'
import { FormControl } from '../../../../UIkit/Form/FormControl'
import { Input } from '../../../../UIkit/Form/Input'
import { ErrorMessage } from '../../../../UIkit/Form/ErrorMessage'
import { Button, Txt } from '../../../../UIkit'
import { styled } from '../../../../../styles'
import { useSeedProvider } from '../../../../processing'
import { useAccount } from 'wagmi'
import { stringifyError } from '../../../../utils/error'

export interface UnlockSectionProps {
  onSuccess?: () => void
}

interface UnlockSectionForm {
  password: string
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  gap: '$3'
})

export const UnlockSection: FC<UnlockSectionProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePasswordValue>()

  const { address } = useAccount()
  const { seedProvider } = useSeedProvider(address)

  const [error, setError] = useState<string>()

  const onSubmit = useCallback((v: UnlockSectionForm) => {
    if (seedProvider) {
      seedProvider
        .unlock(v.password)
        .then(onSuccess)
        .catch(err => setError(stringifyError(err)))
    }
  }, [seedProvider])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Input
          type="password"
          placeholder='Enter a password'
          {...register('password', { required: 'Please, enter a password' })}
          isError={!!errors?.password}
        />
        {errors?.password && <ErrorMessage><Txt h5>{errors.password?.message}</Txt></ErrorMessage>}
      </FormControl>
      <ButtonContainer>
        {error && (<ErrorMessage>{error}</ErrorMessage>)}
        <Button
          type="submit"
          primary
          isDisabled={!!(errors.password)}
        >
          Unlock
        </Button>
      </ButtonContainer>
    </form>
  )
}
