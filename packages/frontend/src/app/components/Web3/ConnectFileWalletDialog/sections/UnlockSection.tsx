import { FC, useCallback, useEffect, useState } from 'react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'

import ArrowUnlock from '../../../../../assets/img/ArrowUnlock.svg'
import { styled } from '../../../../../styles'
import { useSeedProvider } from '../../../../processing'
import { ButtonGlowing } from '../../../../UIkit'
import { FormControl } from '../../../../UIkit/Form/FormControl'
import { InputModalTitleText } from '../../../../UIkit/Modal/Modal'
import { PasswordInput } from '../../../Form/PasswordInput/PasswordInput'

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
  gap: '$3',
})

export const UnlockSection: FC<UnlockSectionProps> = ({ onSuccess }) => {
  const { handleSubmit, formState: { errors }, watch, control } = useForm<UnlockSectionForm>()

  const { address } = useAccount()
  const { seedProvider } = useSeedProvider(address)

  const [error, setError] = useState<string>()

  const onSubmit = useCallback((v: UnlockSectionForm) => {
    console.log('SUBMIT')
    if (seedProvider) {
      console.log(v.password)
      seedProvider
        .unlock(v.password)
        .then(() => {
          onSuccess?.()
          console.log('SUCESS')
        })
        .catch((err) => {
          console.log(err)
          setError('Incorrect password')
        })
    }
  }, [seedProvider])

  const password = watch('password')

  useEffect(() => {
    console.log(password)
  }, [password])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl style={{ marginBottom: '48px' }}>
        <InputModalTitleText>Password</InputModalTitleText>
        <PasswordInput<UnlockSectionForm>
          isCanReset
          inputProps={{
            type: 'password',
            placeholder: 'Enter FileWallet password',
            isError: !!errors?.password || !!error,
            isDisabledFocusStyle: false,
            errorMessage: error ?? errors?.password?.message,
          }}
          controlledInputProps={{
            control,
            name: 'password',
            rules: { required: true },
          }}
        />
      </FormControl>
      <ButtonContainer>
        <ButtonGlowing
          modalButton
          whiteWithBlue
          modalButtonFontSize
          type="submit"
        >
          Unlock
          <img style={{ marginLeft: '10px' }} src={ArrowUnlock} />
        </ButtonGlowing>
      </ButtonContainer>
    </form>
  )
}
