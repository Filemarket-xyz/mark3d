import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { styled } from '../../../../../styles'
import { ButtonGlowing, Txt } from '../../../../UIkit'
import { ErrorMessage } from '../../../../UIkit/Form/ErrorMessage'
import { FormControlModal, InputModalTitleText, ModalDescription } from '../../../../UIkit/Modal/Modal'
import { PasswordInput } from '../../../Form/PasswordInput/PasswordInput'
import { validatePassword } from '../../ConnectFileWalletDialog/utils/validate'

const CreatePasswordStyle = styled('form', {
  width: '100%',
  margin: '0 auto',
})

export const FormControlStyle = styled(FormControlModal, {
  display: 'flex',
  flexDirection: 'column',
})

export interface CreatePasswordValue {
  password: string
  repeatPassword: string
}

export interface CreatePasswordProps {
  onSubmit: (value: CreatePasswordValue) => void
}

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'end',
})

export const CreatePasswordForm: FC<CreatePasswordProps> = ({ onSubmit }) => {
  const { handleSubmit, formState: { errors }, watch, control } = useForm<CreatePasswordValue>()

  const password = watch('password')
  const passwordRepeat = watch('repeatPassword')

  return (
    <CreatePasswordStyle onSubmit={handleSubmit(onSubmit)}>
      <ModalDescription style={{ fontSize: '20px', lineHeight: '28px' }}>This password will be used to protect your seed phrase</ModalDescription>
      <FormControlStyle>
        <InputModalTitleText>Enter password</InputModalTitleText>
        <PasswordInput<CreatePasswordValue>
          inputProps={{
            type: 'password',
            isError: !!errors?.password,
          }}
          controlledInputProps={{
            name: 'password',
            control,
            rules: {
              required: true,
              validate: validatePassword,
            },
          }}
        />
        {errors?.password && <ErrorMessage><Txt h5>{errors.password?.message}</Txt></ErrorMessage>}
      </FormControlStyle>
      <FormControlStyle style={{ marginBottom: '40px' }}>
        <InputModalTitleText>Repeat a password</InputModalTitleText>
        <PasswordInput<CreatePasswordValue>
          inputProps={{
            type: 'password',
            isError: !!errors?.repeatPassword,
          }}
          controlledInputProps={{
            name: 'repeatPassword',
            control,
            rules: {
              required: true,
              validate: () => password === passwordRepeat ? undefined : 'Password are not matching',
            },
          }}
        />
        {errors?.repeatPassword && <ErrorMessage><Txt h5>{errors.repeatPassword?.message}</Txt></ErrorMessage>}
      </FormControlStyle>
      <ButtonContainer>
        <ButtonGlowing
          modalButton
          whiteWithBlue
          modalButtonFontSize
          type="submit"
          isDisabled={!!(errors.password)}
        >
          Save password
        </ButtonGlowing>
      </ButtonContainer>
    </CreatePasswordStyle>
  )
}
